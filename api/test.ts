import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('yahoo-finance2') as { default: new (opts?: object) => { quote: (s: string) => Promise<unknown> } };
    const YF = mod.default;
    const yf = new YF({ suppressNotices: ['yahooSurvey'] });
    const q = await yf.quote('AAPL') as { regularMarketPrice: number };
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
