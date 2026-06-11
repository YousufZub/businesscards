import { action, mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const createCheckoutSession = action({
  args: {
    userId: v.id('users'),
    plan:   v.union(v.literal('personal_pro'), v.literal('enterprise')),
    email:  v.string(),
  },
  handler: async (_ctx, { userId, plan, email }) => {
    const secretKey  = process.env.STRIPE_SECRET_KEY;
    const siteUrl    = process.env.CONVEX_SITE_URL ?? '';
    if (!secretKey) throw new Error('Stripe is not configured — set STRIPE_SECRET_KEY in Convex environment variables.');

    const priceId = plan === 'personal_pro'
      ? process.env.STRIPE_PERSONAL_PRO_PRICE_ID
      : process.env.STRIPE_ENTERPRISE_PRICE_ID;
    if (!priceId) throw new Error(`Missing price ID for plan "${plan}"`);

    const params = new URLSearchParams({
      mode:                     'subscription',
      'line_items[0][price]':   priceId,
      'line_items[0][quantity]':'1',
      customer_email:            email,
      success_url:              `${siteUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:               `${siteUrl}/stripe/cancel`,
      'metadata[userId]':        userId,
      'metadata[plan]':          plan,
    });

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.json() as { error?: { message?: string } };
      throw new Error(err.error?.message ?? 'Stripe API error');
    }

    const session = await res.json() as { url: string; id: string };
    return { url: session.url, sessionId: session.id };
  },
});

export const getByUserId = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();
  },
});

export const upgradeToPersonalPro = mutation({
  args: {
    userId:              v.id('users'),
    stripeCustomerId:    v.string(),
    stripeSubscriptionId:v.string(),
    currentPeriodEnd:    v.number(),
  },
  handler: async (ctx, args) => {
    const sub = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();

    if (!sub) throw new Error('Subscription not found');

    await ctx.db.patch(sub._id, {
      plan:                'personal_pro',
      status:              'active',
      stripeCustomerId:    args.stripeCustomerId,
      stripeSubscriptionId:args.stripeSubscriptionId,
      currentPeriodEnd:    args.currentPeriodEnd,
      scanLimit:           999999,
      updatedAt:           Date.now(),
    });
  },
});

export const handleStripeWebhook = mutation({
  args: {
    event:  v.string(),
    data:   v.any(),
  },
  handler: async (ctx, { event, data }) => {
    if (event === 'customer.subscription.updated' || event === 'customer.subscription.deleted') {
      const stripeSubId = data.id as string;
      const status      = data.status as string;
      const periodEnd   = data.current_period_end as number;

      const sub = await ctx.db
        .query('subscriptions')
        .withIndex('by_stripeCustomer', (q) => q.eq('stripeCustomerId', data.customer))
        .unique();

      if (sub) {
        await ctx.db.patch(sub._id, {
          status:          status === 'active' ? 'active' : status === 'past_due' ? 'past_due' : 'cancelled',
          currentPeriodEnd:periodEnd * 1000,
          updatedAt:       Date.now(),
        });
      }
    }
  },
});
