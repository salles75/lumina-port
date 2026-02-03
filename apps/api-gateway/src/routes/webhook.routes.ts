import { Router, raw } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';
import { stripe, getPlanFromPriceId, getAnalysisLimitForPlan } from '../lib/stripe.js';
import { logger } from '../lib/logger.js';

const router = Router();

/**
 * POST /api/webhook/stripe
 * Handle Stripe webhook events
 */
router.post(
  '/stripe',
  raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      res.status(400).json({ error: 'Missing signature' });
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      logger.error('Webhook signature verification failed:', err);
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutComplete(session);
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionUpdate(subscription);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionDeleted(subscription);
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice;
          await handlePaymentSucceeded(invoice);
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          await handlePaymentFailed(invoice);
          break;
        }

        default:
          logger.info(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      logger.error('Webhook handler error:', error);
      res.status(500).json({ error: 'Webhook handler failed' });
    }
  }
);

// ==========================================
// Webhook Handlers
// ==========================================

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  if (session.mode !== 'subscription') return;

  const userId = session.metadata?.userId;
  if (!userId) {
    logger.error('No userId in checkout session metadata');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  const priceId = subscription.items.data[0]?.price.id;
  const plan = getPlanFromPriceId(priceId);
  const analysisLimit = getAnalysisLimitForPlan(plan);

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      analysisLimit,
      analysisCount: 0, // Reset count on new subscription
    },
  });

  logger.info(`User ${userId} subscribed to ${plan} plan`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!user) {
    logger.error(`No user found for subscription ${subscription.id}`);
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  const plan = getPlanFromPriceId(priceId);
  const analysisLimit = getAnalysisLimitForPlan(plan);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      analysisLimit,
    },
  });

  logger.info(`User ${user.id} subscription updated to ${plan}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!user) {
    logger.error(`No user found for subscription ${subscription.id}`);
    return;
  }

  // Downgrade to free plan
  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: 'FREE',
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
      analysisLimit: 100,
    },
  });

  logger.info(`User ${user.id} subscription cancelled, downgraded to FREE`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) return;

  // Reset monthly analysis count on successful payment
  await prisma.user.update({
    where: { id: user.id },
    data: { analysisCount: 0 },
  });

  logger.info(`Payment succeeded for user ${user.id}, analysis count reset`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) return;

  // Log the failure - you might want to send an email here
  logger.warn(`Payment failed for user ${user.id}`);

  // Optionally: Add audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'PAYMENT_FAILED',
      resource: 'subscription',
      metadata: {
        invoiceId: invoice.id,
        amount: invoice.amount_due,
      },
    },
  });
}

/**
 * POST /api/webhook/clerk
 * Handle Clerk webhook events
 */
router.post('/clerk', raw({ type: 'application/json' }), async (req, res) => {
  // Clerk webhook handling
  // In production, verify webhook signature

  try {
    const event = JSON.parse(req.body.toString());

    switch (event.type) {
      case 'user.created': {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        await prisma.user.upsert({
          where: { clerkId: id },
          update: {
            email: email_addresses[0]?.email_address || '',
            name: `${first_name || ''} ${last_name || ''}`.trim() || null,
            imageUrl: image_url,
          },
          create: {
            clerkId: id,
            email: email_addresses[0]?.email_address || '',
            name: `${first_name || ''} ${last_name || ''}`.trim() || null,
            imageUrl: image_url,
          },
        });

        logger.info(`User created from Clerk webhook: ${id}`);
        break;
      }

      case 'user.updated': {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        await prisma.user.updateMany({
          where: { clerkId: id },
          data: {
            email: email_addresses[0]?.email_address || '',
            name: `${first_name || ''} ${last_name || ''}`.trim() || null,
            imageUrl: image_url,
          },
        });

        logger.info(`User updated from Clerk webhook: ${id}`);
        break;
      }

      case 'user.deleted': {
        const { id } = event.data;

        await prisma.user.deleteMany({
          where: { clerkId: id },
        });

        logger.info(`User deleted from Clerk webhook: ${id}`);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Clerk webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

export { router as webhookRouter };
