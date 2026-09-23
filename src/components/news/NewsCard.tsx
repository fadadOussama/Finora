import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { openBrowserAsync } from 'expo-web-browser';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import type { NewsArticle } from '@/types/news';

function timeAgo(ts: number): string {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const handlePress = () => {
    if (article.url) openBrowserAsync(article.url);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.content}>
        <View style={styles.meta}>
          <Text style={styles.publisher}>{article.publisher}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.time}>{timeAgo(article.publishedAt)}</Text>
        </View>
        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>
      </View>

      {article.thumbnailUrl ? (
        <Image
          source={{ uri: article.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  cardPressed: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  publisher: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  dot: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceElevated,
  },
});
