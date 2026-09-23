import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { formatMarketCap, formatPrice, formatVolume } from '@/utils/format';
import type { StockQuote } from '@/types/stock';

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

interface StockStatsProps {
  quote: StockQuote;
}

export function StockStats({ quote }: StockStatsProps) {
  const stats: StatItemProps[] = [
    { label: 'Open', value: formatPrice(quote.open, quote.currency) },
    { label: 'High', value: formatPrice(quote.high, quote.currency) },
    { label: 'Low', value: formatPrice(quote.low, quote.currency) },
    { label: 'Volume', value: formatVolume(quote.volume) },
    { label: 'Mkt Cap', value: formatMarketCap(quote.marketCap) },
    { label: 'P/E Ratio', value: quote.peRatio != null ? quote.peRatio.toFixed(2) : '—' },
    { label: '52W High', value: quote.week52High != null ? formatPrice(quote.week52High, quote.currency) : '—' },
    { label: '52W Low', value: quote.week52Low != null ? formatPrice(quote.week52Low, quote.currency) : '—' },
    { label: 'Exchange', value: quote.exchangeName },
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Statistics</Text>
      <View style={styles.grid}>
        {stats.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statItem: {
    width: '31%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
});
