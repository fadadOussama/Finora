import { useQuery } from '@tanstack/react-query';
import { fetchQuote } from '@/services/yahooFinance';

export function useStockQuote(ticker: string | null) {
  return useQuery({
    queryKey: ['quote', ticker],
    queryFn: () => fetchQuote(ticker!),
    enabled: !!ticker,
    staleTime: 15_000,
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
  });
}
