import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, ContentType } from '@/types/content';
import { UserPreferences, DEFAULT_CATEGORIES, ThemeMode, ViewMode, Language } from '@/types/preferences';

const INITIAL_STATE: UserPreferences = {
  categories: DEFAULT_CATEGORIES,
  enabledTypes: ['news', 'recommendation', 'social'],
  theme: 'dark',
  viewMode: 'grid',
  autoRefresh: true,
  refreshIntervalSeconds: 60,
  language: 'en',
  apiKeys: {},
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: INITIAL_STATE,
  reducers: {
    toggleCategory: (state, action: PayloadAction<Category>) => {
      const cat = action.payload;
      if (state.categories.includes(cat)) {
        // Prevent deselecting all categories
        if (state.categories.length > 1) {
          state.categories = state.categories.filter((c) => c !== cat);
        }
      } else {
        state.categories.push(cat);
      }
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      if (action.payload.length > 0) {
        state.categories = action.payload;
      }
    },
    toggleContentType: (state, action: PayloadAction<ContentType>) => {
      const type = action.payload;
      if (state.enabledTypes.includes(type)) {
        if (state.enabledTypes.length > 1) {
          state.enabledTypes = state.enabledTypes.filter((t) => t !== type);
        }
      } else {
        state.enabledTypes.push(type);
      }
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshIntervalSeconds = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setApiKeys: (state, action: PayloadAction<{ newsApiKey?: string; tmdbApiKey?: string }>) => {
      state.apiKeys = { ...state.apiKeys, ...action.payload };
    },
    loadStoredPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      return { ...state, ...action.payload };
    },
    resetPreferences: () => INITIAL_STATE,
  },
});

export const {
  toggleCategory,
  setCategories,
  toggleContentType,
  setTheme,
  setViewMode,
  setAutoRefresh,
  setRefreshInterval,
  setLanguage,
  setApiKeys,
  loadStoredPreferences,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
