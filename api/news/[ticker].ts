import type { VercelRequest, VercelResponse } from '@vercel/node';
import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { ticker } = req.query;
  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ error: 'ticker is required' });
  }

  const symbol = ticker.toUpperCase();

  try {
    const result = await yf.search(symbol, {
      newsCount: 10,
      quotesCount: 0,
    });

    const articles = (result.news ?? []).map((n) => {
      const publishTime = n.providerPublishTime;
      const publishedAt = publishTime instanceof Date
        ? Math.floor(publishTime.getTime() / 1000)
        : typeof publishTime === 'number'
          ? publishTime
          : Math.floor(Date.now() / 1000);

      return {
        id: n.uuid ?? '',
        title: n.title ?? '',
        publisher: n.publisher ?? '',
        publishedAt,
        url: n.link ?? '',
        thumbnailUrl: n.thumbnail?.resolutions?.[0]?.url ?? null,
        relatedTickers: n.relatedTickers ?? [],
      };
    });

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=120');
    return res.status(200).json({ ticker: symbol, articles });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch news';
    return res.status(502).json({ error: message });
  }
}
