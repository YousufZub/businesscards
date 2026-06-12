import { internalQuery } from './_generated/server';

export const getStats = internalQuery({
  args: {},
  handler: async (ctx) => {
    const [users, contacts, subs, orgs] = await Promise.all([
      ctx.db.query('users').collect(),
      ctx.db.query('contacts').collect(),
      ctx.db.query('subscriptions').collect(),
      ctx.db.query('organizations').collect(),
    ]);

    const planCounts = subs.reduce<Record<string, number>>((acc, s) => {
      acc[s.plan] = (acc[s.plan] ?? 0) + 1;
      return acc;
    }, {});

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const newUsersToday   = users.filter((u) => u.createdAt >= now - dayMs).length;
    const newUsersThisWeek = users.filter((u) => u.createdAt >= now - 7 * dayMs).length;

    return {
      totalUsers:          users.length,
      totalContacts:       contacts.length,
      totalOrganizations:  orgs.length,
      newUsersToday,
      newUsersThisWeek,
      planCounts,
    };
  },
});

export const listUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').order('desc').take(200);

    const results = await Promise.all(
      users.map(async (u) => {
        const sub = await ctx.db
          .query('subscriptions')
          .withIndex('by_userId', (q) => q.eq('userId', u._id))
          .unique();
        return {
          _id:       u._id,
          name:      u.name,
          email:     u.email,
          provider:  u.authProvider,
          plan:      sub?.plan ?? 'free',
          status:    sub?.status ?? 'active',
          scanCount: sub?.scanCount ?? 0,
          scanLimit: sub?.scanLimit ?? 50,
          createdAt: u.createdAt,
        };
      }),
    );

    return results;
  },
});
