'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Flame, TrendingUp, Sparkles, Filter } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { Category, ContentType } from '@/types/content';
import { ALL_CATEGORIES } from '@/types/preferences';

export function TrendingSection() {
  const items = useAppSelector((state) => state.content.items);
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all');

  // Filter and sort items by engagement and trending rank
  const trendingItems = items
    .filter((item) => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (filterCat !== 'all' && item.category !== filterCat) return false;
      return true;
    })
    .sort((a, b) => {
      // Prioritize explicit trending rank, then likes count
      if (a.isTrending && !b.isTrending) return -1;
      if (!a.isTrending && b.isTrending) return 1;
      return b.engagement.likes - a.engagement.likes;
    });

  return (
    <div className="space-y-6">
      {/* Trending Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-orange-500/20 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Trending Spotlight
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  LIVE VIRAL
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Top rated and most engaged news, movies, tracks, and viral social posts.
              </p>
            </div>
          </div>

          {/* Quick source tabs */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-semibold backdrop-blur-md">
            {(['all', 'news', 'recommendation', 'social'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                  filterType === t
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t === 'recommendation' ? 'Media' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterCat('all')}
          className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            filterCat === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Topics
        </button>
        {ALL_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id as Category)}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filterCat === c.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid of Trending Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {trendingItems.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Rank badge */}
            <div className="absolute -top-2 -left-2 z-20 w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
              #{index + 1}
            </div>
            <ContentCard item={item} isDraggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
