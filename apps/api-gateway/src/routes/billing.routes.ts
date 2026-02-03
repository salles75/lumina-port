import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { stripe, PLANS, getAnalysisLimitForPlan } from '../lib/stripe.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { AppError } from '../middlewares/error-handler.js';
import { logger } from '../lib/logger.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * GET /api/billing/plans
 * Get available pricing plans
 */
router.get('/plans', async (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfeito para começar a explorar',
      price: { monthly: 0, yearly: 0 },
      features: [
        '100 análises/mês',
        'Upload de CSV',
        'Dashboard básico',
      ],
      analysisLimit: 100,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Ideal para profissionais e PMEs',
      price: { monthly: 79, yearly: 790 },
      features: [
        '5.000 análises/mês',
        'Upload de CSV',
        'Dashboard completo',
        'Análise por URL',
        'Exportar relatórios',
        'Suporte prioritário',
      ],
      analysisLimit: 5000,
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Para grandes equipes e empresas',
      price: { monthly: 299, yearly: 2990 },
      features: [
        'Análises ilimitadas',
        'Upload de CSV',
        'Dashboard completo',
        'Análise por URL',
        'Exportar relatórios',
        'API Access completo',
        'Suporte dedicado 24/7',
      ],
      analysisLimit: -1, // Unlimited
    },
  ];

  res.json(plans);
});

/**
 * POST /api/billing/checkout
 * Create a Stripe checkout session
 */
router.post('/checkout', async (req, res, next) => {
  try {
    const schema = z.object({
      priceId: z.string(),
    });

    const { priceId } = schema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });

      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/billing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/billing/portal
 * Create a Stripe customer portal session
 */
router.post('/portal', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user?.stripeCustomerId) {
      throw new AppError(400, 'No billing account found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard/billing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/billing/subscription
 * Get current subscription status
 */
router.get('/subscription', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        plan: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
        analysisCount: true,
        analysisLimit: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    let subscription = null;

    if (user.stripeSubscriptionId) {
      try {
        subscription = await stripe.subscriptions.retrieve(
          user.stripeSubscriptionId
        );
      } catch {
        // Subscription might have been deleted
      }
    }

    res.json({
      plan: user.plan,
      analysisCount: user.analysisCount,
      analysisLimit: user.analysisLimit,
      subscription: subscription
        ? {
            status: subscription.status,
            currentPeriodEnd: user.stripeCurrentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/billing/history
 * Get billing history (invoices)
 */
router.get('/history', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      res.json({ invoices: [] });
      return;
    }

    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 12,
    });

    res.json({
      invoices: invoices.data.map((invoice) => ({
        id: invoice.id,
        amount: invoice.amount_paid / 100,
        status: invoice.status,
        date: new Date(invoice.created * 1000).toISOString(),
        pdfUrl: invoice.invoice_pdf,
      })),
    });
  } catch (error) {
    next(error);
  }
});

export { router as billingRouter };
