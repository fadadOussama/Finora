import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { formatChange, formatPercent, formatPrice } from '@/utils/format';
import type { StockQuote } from '@/types/stock';

interface StockHeaderProps {
  quote: StockQuote;
}

export function StockHeader({ quote }: StockHeaderProps) {
  const isPositive = quote.change >= 0;
  const changeColor = isPositive ? Colors.gain : Colors.loss;

  return (
    <View style={styles.container}>
      <Text style={styles.companyName} numberOfLines={1}>
        {quote.companyName}
      </Text>

      <Text style={styles.price}>
        {formatPrice(quote.price, quote.currency)}
      </Text>

      <View style={styles.changeRow}>
        <View style={[styles.changeBadge, { backgroundColor: isPositive ? Colors.gainMuted : Colors.lossMuted }]}>
          <Text style={[styles.changeText, { color: changeColor }]}>
            {formatChange(quote.change)}{'  '}{formatPercent(quote.changePercent)}
          </Text>
        </View>
        <Text style={styles.marketState}>
          {quote.marketState === 'REGULAR' ? 'Market open' : 'Market closed'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  companyName: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.regular,
  },
  price: {
    fontSize: FontSize.xxxl + 4,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  changeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  changeText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  marketState: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
});
