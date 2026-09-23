import type { VercelRequest, VercelResponse } from '@vercel/node';
import yahooFinance from 'yahoo-finance2';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q } = req.query;
  if (!q || typeof q !== 'string' || q.trim().length < 1) {
    return res.status(400).json({ error: 'q is required' });
  }

  try {
    const result = await yahooFinance.search(q.trim(), {
      newsCount: 0,
      quotesCount: 10,
    });

    const quotes = (result.quotes ?? [])
      .filter((r) => r.quoteType === 'EQUITY' || r.quoteType === 'ETF')
      .slice(0, 8)
      .map((r) => ({
        ticker: r.symbol ?? '',
        companyName: ('longname' in r ? (r as { longname?: string }).longname : undefined)
          ?? ('shortname' in r ? (r as { shortname?: string }).shortname : undefined)
          ?? r.symbol ?? '',
        exchange: ('exchange' in r ? (r as { exchange?: string }).exchange : undefined) ?? '',
        type: r.quoteType ?? '',
      }));

    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    return res.status(200).json({ results: quotes });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to search';
    return res.status(502).json({ error: message });
  }
}
