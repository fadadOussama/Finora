import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '@/services/yahooFinance';

export function useStockNews(ticker: string | null) {
  return useQuery({
    queryKey: ['news', ticker],
    queryFn: () => fetchNews(ticker!),
    enabled: !!ticker,
    staleTime: 300_000, // 5 minutes
  });
}
