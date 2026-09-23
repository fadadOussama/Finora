export interface StockQuote {
  ticker: string;
  companyName: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number | null;
  peRatio: number | null;
  week52High: number | null;
  week52Low: number | null;
  currency: string;
  exchangeName: string;
  marketState: 'REGULAR' | 'PRE' | 'POST' | 'CLOSED';
}

export interface ChartPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type ChartRange = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

export interface SearchResult {
  ticker: string;
  companyName: string;
  exchange: string;
  type: string;
}
