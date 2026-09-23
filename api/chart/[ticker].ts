import type { VercelRequest, VercelResponse } from '@vercel/node';
import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

type RangeKey = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

function getPeriod1(range: RangeKey): Date {
  const now = new Date();
  switch (range) {
    case '1D': return new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    case '1W': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '1M': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '3M': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '1Y': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    case '5Y': return new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
  }
}

const INTERVAL: Record<RangeKey, '1m' | '5m' | '15m' | '30m' | '1d' | '1wk'> = {
  '1D': '5m',
  '1W': '30m',
  '1M': '1d',
  '3M': '1d',
  '1Y': '1d',
  '5Y': '1wk',
};

const CACHE_TTL: Record<RangeKey, number> = {
  '1D': 60, '1W': 120, '1M': 300, '3M': 600, '1Y': 600, '5Y': 3600,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { ticker, range = '1D' } = req.query;
  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ error: 'ticker is required' });
  }

  const symbol = ticker.toUpperCase();
  const rangeKey = (typeof range === 'string' ? range.toUpperCase() : '1D') as RangeKey;
  const interval = INTERVAL[rangeKey] ?? '1d';
  const ttl = CACHE_TTL[rangeKey] ?? 60;
  const period1 = getPeriod1(rangeKey);

  try {
    const result = await yf.chart(symbol, { period1, interval }, { validateResult: false });

    const quotes = result.quotes ?? [];
    const points = quotes
      .filter((q) => q.close != null)
      .map((q) => ({
        timestamp: q.date instanceof Date
          ? Math.floor(q.date.getTime() / 1000)
          : typeof q.date === 'number' ? q.date : 0,
        open: q.open ?? q.close ?? 0,
        high: q.high ?? q.close ?? 0,
        low: q.low ?? q.close ?? 0,
        close: q.close ?? 0,
        volume: q.volume ?? 0,
      }));

    res.setHeader('Cache-Control', `public, s-maxage=${ttl}, stale-while-revalidate=60`);
    return res.status(200).json({ ticker: symbol, range: rangeKey, points });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch chart';
    return res.status(502).json({ error: message });
  }
}
