import { describe, it, expect } from 'vitest';
import searchReducer, {
  setQuery,
  setDebouncedQuery,
  removeRecentSearch,
  clearRecentSearches,
  clearSearch,
} from '@/store/slices/searchSlice';

describe('searchSlice', () => {
  it('should update query string', () => {
    const state = searchReducer(undefined, setQuery('machine learning'));
    expect(state.query).toBe('machine learning');
  });

  it('should update debounced query and prepend to recentSearches', () => {
    const state = searchReducer(undefined, setDebouncedQuery('quantum breakthrough'));
    expect(state.debouncedQuery).toBe('quantum breakthrough');
    expect(state.recentSearches[0]).toBe('quantum breakthrough');
  });

  it('should remove a search term from recentSearches', () => {
    const state = searchReducer(undefined, removeRecentSearch('Quantum computing'));
    expect(state.recentSearches).not.toContain('Quantum computing');
  });

  it('should clear all recent searches', () => {
    const state = searchReducer(undefined, clearRecentSearches());
    expect(state.recentSearches).toEqual([]);
  });

  it('should reset query, filters, and debounced query on clearSearch', () => {
    let state = searchReducer(undefined, setQuery('test'));
    state = searchReducer(state, setDebouncedQuery('test'));
    state = searchReducer(state, clearSearch());
    expect(state.query).toBe('');
    expect(state.debouncedQuery).toBe('');
    expect(state.filterCategory).toBe('all');
  });
});
