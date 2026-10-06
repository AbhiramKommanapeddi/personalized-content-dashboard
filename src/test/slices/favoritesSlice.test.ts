import { describe, it, expect } from 'vitest';
import favoritesReducer, {
  toggleFavorite,
  removeFavorite,
  clearFavorites,
} from '@/store/slices/favoritesSlice';
import { INITIAL_NEWS_ITEMS } from '@/utils/apiData';

describe('favoritesSlice', () => {
  const sampleItem = INITIAL_NEWS_ITEMS[0];

  it('should initialize with empty favorites array', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' }).items).toEqual([]);
  });

  it('should add item to favorites on toggle if not present', () => {
    const state = favoritesReducer({ items: [] }, toggleFavorite(sampleItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(sampleItem.id);
  });

  it('should remove item from favorites on toggle if already present', () => {
    const state = favoritesReducer({ items: [sampleItem] }, toggleFavorite(sampleItem));
    expect(state.items).toHaveLength(0);
  });

  it('should remove favorite item by ID', () => {
    const state = favoritesReducer({ items: [sampleItem] }, removeFavorite(sampleItem.id));
    expect(state.items).toHaveLength(0);
  });

  it('should clear all favorites', () => {
    const state = favoritesReducer(
      { items: [sampleItem, INITIAL_NEWS_ITEMS[1]] },
      clearFavorites()
    );
    expect(state.items).toEqual([]);
  });
});
