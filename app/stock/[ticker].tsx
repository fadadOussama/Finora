import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useStockQuote } from '@/hooks/useStockQuote';
import { useChartData } from '@/hooks/useChartData';
import { useStockNews } from '@/hooks/useStockNews';
import { PriceChart } from '@/components/charts/PriceChart';
import { RangeSelector } from '@/components/charts/RangeSelector';
import { StockHeader } from '@/components/stock/StockHeader';
import { StockStats } from '@/components/stock/StockStats';
import { NewsCard } from '@/components/news/NewsCard';
import type { ChartRange } from '@/types/stock';
import type { NewsArticle } from '@/types/news';

export default function StockDetailScreen() {
  const { ticker } = useLocalSearchParams<{ ticker: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [range, setRange] = useState<ChartRange>('1D');

  const { data: quote, isLoading: quoteLoading, error: quoteError } = useStockQuote(ticker ?? null);
  const { data: chartData, isLoading: chartLoading } = useChartData(ticker ?? null, range);
  const { data: newsData } = useStockNews(ticker ?? null);

  const chartPoints = chartData?.points ?? [];
  const articles = newsData?.articles ?? [];
  const isPositive = quote ? quote.change >= 0 : true;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Nav bar */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTicker}>{ticker}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header — price + company name */}
        {quoteLoading && (
          <View style={styles.loadingHeader}>
            <ActivityIndicator color={Colors.accent} />
          </View>
        )}

        {quoteError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Failed to load quote</Text>
          </View>
        )}

        {quote && (
          <StockHeader quote={quote} />
        )}

        {/* Chart */}
        <View style={styles.chartSection}>
          {chartLoading && chartPoints.length === 0 ? (
            <View style={styles.chartLoader}>
              <ActivityIndicator color={Colors.accent} />
            </View>
          ) : (
            <PriceChart
              data={chartPoints}
              isPositive={isPositive}
              height={220}
            />
          )}

          <RangeSelector selected={range} onChange={setRange} />
        </View>

        {/* Statistics */}
        {quote && <StockStats quote={quote} />}

        {/* News */}
        {articles.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>News</Text>
            <FlashList
              data={articles}
              keyExtractor={(item: NewsArticle) => item.id}
              renderItem={({ item }: { item: NewsArticle }) => <NewsCard article={item} />}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
            />
          </View>
        )}

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Prices may be delayed. Not financial advice.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  navTicker: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.xl,
  },
  loadingHeader: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBox: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  errorText: {
    color: Colors.loss,
    fontSize: FontSize.sm,
  },
  chartSection: {
    gap: Spacing.md,
  },
  chartLoader: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  disclaimer: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingTop: Spacing.sm,
  },
});
