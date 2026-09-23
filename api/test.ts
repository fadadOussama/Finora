import type { VercelRequest, VercelResponse } from '@vercel/node';
import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const q = await yf.quote('AAPL', {}, { validateResult: false }) as { regularMarketPrice: number };
    return res.status(200).json({ ok: true, price: q.regularMarketPrice });
  } catch (err: unknown) {
    const e = err as Error;
    return res.status(200).json({
      ok: false,
      error: e.message,
      stack: e.stack?.split('\n').slice(0, 5),
    });
  }
}
