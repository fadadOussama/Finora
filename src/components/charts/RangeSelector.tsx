import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import type { ChartRange } from '@/types/stock';

const RANGES: ChartRange[] = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

interface RangeSelectorProps {
  selected: ChartRange;
  onChange: (range: ChartRange) => void;
}

export function RangeSelector({ selected, onChange }: RangeSelectorProps) {
  return (
    <View style={styles.container}>
      {RANGES.map((range) => {
        const active = range === selected;
        return (
          <Pressable
            key={range}
            onPress={() => onChange(range)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {range}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 3,
    gap: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.xs + 2,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  tabActive: {
    backgroundColor: Colors.surfaceElevated,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
});
