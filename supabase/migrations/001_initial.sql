-- Profiles: extends auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watchlist items: one row per user+ticker
CREATE TABLE IF NOT EXISTS public.watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  last_price NUMERIC(12,4),
  prev_close NUMERIC(12,4),
  price_updated_at TIMESTAMPTZ,
  UNIQUE(user_id, ticker)
);

-- Price cache: written by Edge Function cron every 30s
CREATE TABLE IF NOT EXISTS public.price_cache (
  ticker TEXT PRIMARY KEY,
  price NUMERIC(12,4) NOT NULL,
  prev_close NUMERIC(12,4),
  change_percent NUMERIC(8,4),
  volume BIGINT,
  market_cap BIGINT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_cache ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Watchlist: users can manage their own items
CREATE POLICY "Users can manage own watchlist"
  ON public.watchlist_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Price cache: publicly readable (no auth needed for prices)
CREATE POLICY "Price cache is publicly readable"
  ON public.price_cache FOR SELECT
  USING (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable real-time for watchlist and price cache
ALTER PUBLICATION supabase_realtime ADD TABLE public.watchlist_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.price_cache;
