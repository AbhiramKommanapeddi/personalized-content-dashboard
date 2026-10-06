import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '@/types/content';

interface FavoritesState {
  items: ContentItem[];
}

const initialState: FavoritesState = {
  items: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<ContentItem>) => {
      const item = action.payload;
      const index = state.items.findIndex((fav) => fav.id === item.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(item);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
    loadStoredFavorites: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { toggleFavorite, removeFavorite, clearFavorites, loadStoredFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
