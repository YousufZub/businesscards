import { action, internalMutation, internalQuery } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';

export const getCached = internalQuery({
  args: { domain: v.string() },
  handler: async (ctx, { domain }) => {
    return ctx.db
      .query('companyCache')
      .withIndex('by_domain', (q) => q.eq('domain', domain))
      .unique();
  },
});

export const upsertCache = internalMutation({
  args: {
    domain:      v.string(),
    name:        v.string(),
    description: v.optional(v.string()),
    logo:        v.optional(v.string()),
    industry:    v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('companyCache')
      .withIndex('by_domain', (q) => q.eq('domain', args.domain))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, fetchedAt: Date.now() });
    } else {
      await ctx.db.insert('companyCache', { ...args, fetchedAt: Date.now() });
    }
  },
});

export const enrichCompany = action({
  args: { domain: v.string() },
  handler: async (ctx, { domain }): Promise<{ name: string; description?: string; logo?: string } | null> => {
    const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
    const cached: { name: string; description?: string; logo?: string; fetchedAt: number } | null =
      await ctx.runQuery(internal.enrichment.getCached, { domain }) as any;
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      return { name: cached.name, description: cached.description, logo: cached.logo };
    }

    const url = domain.startsWith('http') ? domain : `https://${domain}`;
    let html = '';
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'CardVault/1.0 (contact enrichment)' },
        signal:  AbortSignal.timeout(6000),
      });
      html = await res.text();
    } catch {
      return null;
    }

    const extract = (pattern: RegExp) => pattern.exec(html)?.[1]?.trim();

    const name =
      extract(/<meta[^>]+property="og:site_name"[^>]+content="([^"]+)"/i) ??
      extract(/<title[^>]*>([^<|·–-]+)/i) ??
      domain;

    const description =
      extract(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i) ??
      extract(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i);

    const logo =
      extract(/<link[^>]+rel="apple-touch-icon"[^>]+href="([^"]+)"/i) ??
      extract(/<link[^>]+rel="icon"[^>]+href="([^"]+)"/i);

    const resolvedLogo = logo
      ? logo.startsWith('http') ? logo : `${url}/${logo.replace(/^\//, '')}`
      : undefined;

    await ctx.runMutation(internal.enrichment.upsertCache, {
      domain,
      name:        name.trim(),
      description: description?.slice(0, 300),
      logo:        resolvedLogo,
    });

    return { name, description, logo: resolvedLogo };
  },
});
