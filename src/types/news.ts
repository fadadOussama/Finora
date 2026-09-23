export interface NewsArticle {
  id: string;
  title: string;
  publisher: string;
  publishedAt: number;
  url: string;
  thumbnailUrl: string | null;
  relatedTickers: string[];
}
