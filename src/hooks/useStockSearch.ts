import { useQuery } from '@tanstack/react-query';
import { fetchSearch } from '@/services/yahooFinance';

export function useStockSearch(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ['search', trimmed],
    queryFn: () => fetchSearch(trimmed),
    enabled: trimmed.length >= 1,
    staleTime: 30_000,
    // No polling needed for search
  });
}
