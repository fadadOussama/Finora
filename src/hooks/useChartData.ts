import { useQuery } from '@tanstack/react-query';
import { fetchChart } from '@/services/yahooFinance';
import type { ChartRange } from '@/types/stock';

export function useChartData(ticker: string | null, range: ChartRange = '1D') {
  return useQuery({
    queryKey: ['chart', ticker, range],
    queryFn: () => fetchChart(ticker!, range),
    enabled: !!ticker,
    staleTime: range === '1D' ? 60_000 : 300_000,
    refetchInterval: range === '1D' ? 60_000 : false,
    refetchIntervalInBackground: false,
  });
}
