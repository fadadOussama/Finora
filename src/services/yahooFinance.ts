import { Config } from '@/constants/config';
import type { ChartRange, SearchResult, StockQuote } from '@/types/stock';
import type { NewsArticle } from '@/types/news';

const BASE = Config.apiBaseUrl;

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchQuote(ticker: string): Promise<StockQuote> {
  return apiFetch<StockQuote>(`/api/quote/${encodeURIComponent(ticker)}`);
}

export interface ChartResponse {
  ticker: string;
  range: ChartRange;
  points: Array<{
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export async function fetchChart(ticker: string, range: ChartRange = '1D'): Promise<ChartResponse> {
  return apiFetch<ChartResponse>(`/api/chart/${encodeURIComponent(ticker)}?range=${range}`);
}

export async function fetchSearch(query: string): Promise<{ results: SearchResult[] }> {
  return apiFetch<{ results: SearchResult[] }>(`/api/search?q=${encodeURIComponent(query)}`);
}

export async function fetchNews(ticker: string): Promise<{ ticker: string; articles: NewsArticle[] }> {
  return apiFetch<{ ticker: string; articles: NewsArticle[] }>(`/api/news/${encodeURIComponent(ticker)}`);
}
