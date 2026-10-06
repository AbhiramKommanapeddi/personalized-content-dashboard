import { Category, ContentType } from './content';

export type ViewMode = 'grid' | 'list' | 'compact';
export type ThemeMode = 'dark' | 'light' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de';

export interface UserPreferences {
  categories: Category[];
  enabledTypes: ContentType[];
  theme: ThemeMode;
  viewMode: ViewMode;
  autoRefresh: boolean;
  refreshIntervalSeconds: number;
  language: Language;
  apiKeys?: {
    newsApiKey?: string;
    tmdbApiKey?: string;
  };
}

export const DEFAULT_CATEGORIES: Category[] = [
  'technology',
  'finance',
  'entertainment',
  'ai',
  'science',
];

export const ALL_CATEGORIES: { id: Category; label: string; icon: string; color: string }[] = [
  { id: 'technology', label: 'Technology', icon: 'Cpu', color: 'from-blue-500 to-indigo-600' },
  { id: 'ai', label: 'AI & Startups', icon: 'Sparkles', color: 'from-purple-500 to-pink-500' },
  { id: 'finance', label: 'Finance & Crypto', icon: 'TrendingUp', color: 'from-emerald-500 to-teal-600' },
  { id: 'entertainment', label: 'Movies & Music', icon: 'Film', color: 'from-amber-500 to-rose-500' },
  { id: 'sports', label: 'Sports', icon: 'Trophy', color: 'from-orange-500 to-red-500' },
  { id: 'science', label: 'Science & Space', icon: 'Atom', color: 'from-cyan-500 to-blue-600' },
  { id: 'gaming', label: 'Gaming', icon: 'Gamepad2', color: 'from-violet-500 to-purple-700' },
  { id: 'lifestyle', label: 'Lifestyle & Design', icon: 'Compass', color: 'from-rose-400 to-pink-600' },
];
