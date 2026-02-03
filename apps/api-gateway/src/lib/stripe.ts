import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Plan configurations
export const PLANS = {
  FREE: {
    name: 'Free',
    analysisLimit: 100,
    priceId: null,
  },
  PRO: {
    name: 'Pro',
    analysisLimit: 5000,
    priceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    priceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  ENTERPRISE: {
    name: 'Enterprise',
    analysisLimit: Infinity,
    priceIdMonthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY,
    priceIdYearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY,
  },
};

export function getPlanFromPriceId(priceId: string): 'FREE' | 'PRO' | 'ENTERPRISE' {
  if (
    priceId === PLANS.PRO.priceIdMonthly ||
    priceId === PLANS.PRO.priceIdYearly
  ) {
    return 'PRO';
  }
  if (
    priceId === PLANS.ENTERPRISE.priceIdMonthly ||
    priceId === PLANS.ENTERPRISE.priceIdYearly
  ) {
    return 'ENTERPRISE';
  }
  return 'FREE';
}

export function getAnalysisLimitForPlan(plan: 'FREE' | 'PRO' | 'ENTERPRISE'): number {
  return PLANS[plan].analysisLimit;
}
