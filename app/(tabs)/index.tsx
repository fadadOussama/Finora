import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { supabase } from '@/services/supabase';

const MAJOR_INDICES = [
  { ticker: 'SPY', name: 'S&P 500' },
  { ticker: 'QQQ', name: 'NASDAQ 100' },
  { ticker: 'DIA', name: 'Dow Jones' },
  { ticker: 'IWM', name: 'Russell 2000' },
];

function IndexCard({ ticker, name }: { ticker: string; name: string }) {
  const router = useRouter();
  return (
    <Pressable
      style={styles.indexCard}
      onPress={() => router.push(`/stock/${ticker}`)}
    >
      <Text style={styles.indexName}>{name}</Text>
      <Text style={styles.indexTicker}>{ticker}</Text>
      <Text style={styles.indexPrice}>—</Text>
      <Text style={[styles.indexChange, { color: Colors.textTertiary }]}>Loading…</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>Markets</Text>
        <Pressable onPress={() => supabase.auth.signOut()}>
          <Text style={styles.signOut}>Sign out</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionLabel}>MAJOR INDICES</Text>
      <View style={styles.indicesGrid}>
        {MAJOR_INDICES.map((idx) => (
          <IndexCard key={idx.ticker} {...idx} />
        ))}
      </View>

      <Text style={styles.sectionLabel}>MARKET NEWS</Text>
      <Pressable style={styles.newsPlaceholder} onPress={() => router.push('/(tabs)/news')}>
        <Text style={styles.newsPlaceholderText}>News coming in Phase 6 →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.md },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  screenTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  signOut: { fontSize: FontSize.sm, color: Colors.textSecondary },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginTop: Spacing.sm,
  },
  indicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  indexCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    gap: 2,
  },
  indexName: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  indexTicker: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  indexPrice: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  indexChange: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  newsPlaceholder: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  newsPlaceholderText: { color: Colors.textSecondary, fontSize: FontSize.md },
});
