import { Middleware } from '@reduxjs/toolkit';

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (typeof window !== 'undefined') {
    try {
      const state = store.getState();

      // Persist preferences whenever relevant action happens
      if (
        (action as { type: string }).type?.startsWith('preferences/')
      ) {
        localStorage.setItem(
          'dashboard_preferences',
          JSON.stringify(state.preferences)
        );
      }

      // Persist favorites
      if ((action as { type: string }).type?.startsWith('favorites/')) {
        localStorage.setItem(
          'dashboard_favorites',
          JSON.stringify(state.favorites.items)
        );
      }

      // Persist custom reorder
      if ((action as { type: string }).type === 'content/reorderFeedItems') {
        localStorage.setItem(
          'dashboard_feed_order',
          JSON.stringify(state.content.userOrderIds)
        );
      }
    } catch {
      // Ignore localStorage write quota exceptions
    }
  }

  return result;
};
