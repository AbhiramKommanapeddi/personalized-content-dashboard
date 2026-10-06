'use client';

import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { loadStoredPreferences } from '@/store/slices/preferencesSlice';
import { loadStoredFavorites } from '@/store/slices/favoritesSlice';
import { reorderFeedItems } from '@/store/slices/contentSlice';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      // Rehydrate preferences
      const savedPrefs = localStorage.getItem('dashboard_preferences');
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        store.dispatch(loadStoredPreferences(parsed));
      }

      // Rehydrate favorites
      const savedFavs = localStorage.getItem('dashboard_favorites');
      if (savedFavs) {
        const parsedFavs = JSON.parse(savedFavs);
        if (Array.isArray(parsedFavs)) {
          store.dispatch(loadStoredFavorites(parsedFavs));
        }
      }

      // Rehydrate feed custom order if any
      const savedOrder = localStorage.getItem('dashboard_feed_order');
      if (savedOrder) {
        const orderIds: string[] = JSON.parse(savedOrder);
        if (Array.isArray(orderIds) && orderIds.length > 0) {
          const currentItems = [...store.getState().content.items];
          const orderMap = new Map(orderIds.map((id, idx) => [id, idx]));
          currentItems.sort((a, b) => {
            const idxA = orderMap.get(a.id);
            const idxB = orderMap.get(b.id);
            if (idxA !== undefined && idxB !== undefined) return idxA - idxB;
            if (idxA !== undefined) return -1;
            if (idxB !== undefined) return 1;
            return 0;
          });
          store.dispatch(reorderFeedItems(currentItems));
        }
      }
    } catch (e) {
      console.warn('Could not rehydrate state from localStorage:', e);
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
