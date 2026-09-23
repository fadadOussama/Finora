import type { VercelRequest, VercelResponse } from '@vercel/node';
import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { ticker } = req.query;
  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ error: 'ticker is required' });
  }

  const symbol = ticker.toUpperCase();

  try {
    const quote = await yf.quote(symbol);

    const data = {
      ticker: quote.symbol ?? symbol,
      companyName: quote.longName ?? quote.shortName ?? symbol,
      price: quote.regularMarketPrice ?? 0,
      previousClose: quote.regularMarketPreviousClose ?? 0,
      change: quote.regularMarketChange ?? 0,
      changePercent: quote.regularMarketChangePercent ?? 0,
      open: quote.regularMarketOpen ?? 0,
      high: quote.regularMarketDayHigh ?? 0,
      low: quote.regularMarketDayLow ?? 0,
      volume: quote.regularMarketVolume ?? 0,
      marketCap: quote.marketCap ?? null,
      peRatio: quote.trailingPE ?? null,
      week52High: quote.fiftyTwoWeekHigh ?? null,
      week52Low: quote.fiftyTwoWeekLow ?? null,
      currency: quote.currency ?? 'USD',
      exchangeName: quote.fullExchangeName ?? quote.exchange ?? '',
      marketState: quote.marketState ?? 'CLOSED',
    };

    res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');
    return res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch quote';
    return res.status(502).json({ error: message });
  }
}
