import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, ContentType } from '@/types/content';

interface SearchState {
  query: string;
  debouncedQuery: string;
  recentSearches: string[];
  filterCategory: Category | 'all';
  filterType: ContentType | 'all';
}

const initialState: SearchState = {
  query: '',
  debouncedQuery: '',
  recentSearches: ['Quantum computing', 'Synthetica', 'Chronos Paradox', '#AgenticAI'],
  filterCategory: 'all',
  filterType: 'all',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setDebouncedQuery: (state, action: PayloadAction<string>) => {
      state.debouncedQuery = action.payload;
      const trimmed = action.payload.trim();
      if (trimmed && !state.recentSearches.includes(trimmed)) {
        state.recentSearches = [trimmed, ...state.recentSearches.slice(0, 7)];
      }
    },
    setFilterCategory: (state, action: PayloadAction<Category | 'all'>) => {
      state.filterCategory = action.payload;
    },
    setFilterType: (state, action: PayloadAction<ContentType | 'all'>) => {
      state.filterType = action.payload;
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter((s) => s !== action.payload);
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    clearSearch: (state) => {
      state.query = '';
      state.debouncedQuery = '';
      state.filterCategory = 'all';
      state.filterType = 'all';
    },
  },
});

export const {
  setQuery,
  setDebouncedQuery,
  setFilterCategory,
  setFilterType,
  removeRecentSearch,
  clearRecentSearches,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
