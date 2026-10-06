import { describe, it, expect } from 'vitest';
import preferencesReducer, {
  toggleCategory,
  setTheme,
  setViewMode,
  setAutoRefresh,
  resetPreferences,
} from '@/store/slices/preferencesSlice';
import { DEFAULT_CATEGORIES, UserPreferences } from '@/types/preferences';
import { ContentType } from '@/types/content';

describe('preferencesSlice', () => {
  const initialState: UserPreferences = {
    categories: DEFAULT_CATEGORIES,
    enabledTypes: ['news', 'recommendation', 'social'],
    theme: 'dark',
    viewMode: 'grid',
    autoRefresh: true,
    refreshIntervalSeconds: 60,
    language: 'en',
    apiKeys: {},
  };

  it('should return initial state by default', () => {
    expect(preferencesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should toggle an existing category off when multiple are selected', () => {
    const state = preferencesReducer(initialState, toggleCategory('technology'));
    expect(state.categories).not.toContain('technology');
  });

  it('should toggle a new category on', () => {
    const state = preferencesReducer(initialState, toggleCategory('gaming'));
    expect(state.categories).toContain('gaming');
  });

  it('should prevent removing the last remaining category', () => {
    const singleCatState = { ...initialState, categories: ['technology' as const] };
    const state = preferencesReducer(singleCatState, toggleCategory('technology'));
    expect(state.categories).toEqual(['technology']);
  });

  it('should update theme mode', () => {
    const state = preferencesReducer(initialState, setTheme('light'));
    expect(state.theme).toBe('light');
  });

  it('should update view mode between grid and list', () => {
    const state = preferencesReducer(initialState, setViewMode('list'));
    expect(state.viewMode).toBe('list');
  });

  it('should toggle autoRefresh boolean', () => {
    const state = preferencesReducer(initialState, setAutoRefresh(false));
    expect(state.autoRefresh).toBe(false);
  });

  it('should reset preferences to initial values', () => {
    const modifiedState = {
      ...initialState,
      theme: 'light' as const,
      categories: ['sports' as const],
    };
    const state = preferencesReducer(modifiedState, resetPreferences());
    expect(state.theme).toBe('dark');
    expect(state.categories).toEqual(DEFAULT_CATEGORIES);
  });
});
