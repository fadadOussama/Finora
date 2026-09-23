export interface WatchlistItem {
  id: string;
  user_id: string;
  ticker: string;
  company_name: string;
  added_at: string;
  last_price: number | null;
  prev_close: number | null;
  price_updated_at: string | null;
}

export interface PriceCache {
  ticker: string;
  price: number;
  prev_close: number | null;
  change_percent: number | null;
  volume: number | null;
  market_cap: number | null;
  updated_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  created_at: string;
}
