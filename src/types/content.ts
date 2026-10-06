export type ContentType = 'news' | 'recommendation' | 'social';

export type Category =
  | 'technology'
  | 'finance'
  | 'sports'
  | 'entertainment'
  | 'science'
  | 'gaming'
  | 'ai'
  | 'lifestyle';

export interface BaseContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  category: Category;
  imageUrl?: string;
  createdAt: string;
  source: string;
  sourceLogo?: string;
  url?: string;
  isTrending?: boolean;
  trendingRank?: number;
  engagement: {
    likes: number;
    shares?: number;
    comments?: number;
    views?: number;
  };
}

export interface NewsContentItem extends BaseContentItem {
  type: 'news';
  author: string;
  readTimeMinutes: number;
  fullContent?: string;
}

export interface RecommendationContentItem extends BaseContentItem {
  type: 'recommendation';
  subType: 'movie' | 'music' | 'podcast' | 'series';
  rating?: number; // 0-10 or 0-5
  releaseYear?: number;
  duration?: string;
  creatorOrArtist?: string;
  trailerUrl?: string;
  audioPreviewUrl?: string;
}

export interface SocialContentItem extends BaseContentItem {
  type: 'social';
  platform: 'twitter' | 'instagram' | 'bluesky';
  authorHandle: string;
  authorAvatar: string;
  authorVerified?: boolean;
  hashtags: string[];
}

export type ContentItem = NewsContentItem | RecommendationContentItem | SocialContentItem;

export interface ContentFilterState {
  category: Category | 'all';
  type: ContentType | 'all';
  searchQuery: string;
  sortBy: 'latest' | 'popular' | 'trending';
}
