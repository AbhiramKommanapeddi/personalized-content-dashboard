'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearFavorites } from '@/store/slices/favoritesSlice';
import { setActiveTab } from '@/store/slices/contentSlice';
import { ContentCard } from './ContentCard';
import { Button } from '@/components/common/Button';
import { Heart, Trash2, Compass, Layers } from 'lucide-react';
import { ContentType } from '@/types/content';
import { useTranslation } from '@/hooks/useTranslation';

export function FavoritesSection() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const { t } = useTranslation();

  const filteredFavorites = favorites.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    return true;
  });

  if (favorites.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto my-12 space-y-5 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Your Favorites Collection is Empty
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            {t('noFavorites')}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Compass className="w-4 h-4" />}
          onClick={() => dispatch(setActiveTab('feed'))}
        >
          Explore Unified Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Favorites Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10 border border-rose-500/20 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {t('favorites')}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {favorites.length} SAVED
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Curated articles, tracks, movies, and social posts you bookmarked for later.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => {
                if (window.confirm('Clear all favorites?')) {
                  dispatch(clearFavorites());
                }
              }}
              className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Filter by Type */}
      <div className="flex items-center gap-1.5">
        {(['all', 'news', 'recommendation', 'social'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              filterType === type
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {type === 'all' ? 'All Saved' : type === 'recommendation' ? 'Media & Picks' : type}
          </button>
        ))}
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredFavorites.map((item) => (
          <ContentCard key={item.id} item={item} isDraggable={false} />
        ))}
      </div>
    </div>
  );
}
