import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';

export default function StockDetailScreen() {
  const { ticker } = useLocalSearchParams<{ ticker: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTicker}>{ticker}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.companyName}>Loading…</Text>
          <Text style={styles.price}>—</Text>
          <Text style={[styles.change, { color: Colors.textSecondary }]}>—</Text>
        </View>

        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>
            Interactive chart coming in Phase 3
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {['Open', 'High', 'Low', 'Volume', 'Mkt Cap', 'P/E'].map((label) => (
            <View key={label} style={styles.statItem}>
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statValue}>—</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navTicker: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  headerSection: { gap: Spacing.xs },
  companyName: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  change: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholderText: {
    color: Colors.textTertiary,
    fontSize: FontSize.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statItem: {
    width: '30%',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  statValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
});
