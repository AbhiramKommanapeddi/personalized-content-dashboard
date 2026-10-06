'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { BarChart3, TrendingUp, Heart, BookOpen, Clock, Sparkles } from 'lucide-react';
import { ALL_CATEGORIES } from '@/types/preferences';
import { formatCompactNumber } from '@/utils/dateUtils';

export function AnalyticsSection() {
  const items = useAppSelector((state) => state.content.items);
  const favorites = useAppSelector((state) => state.favorites.items);
  const userPreferences = useAppSelector((state) => state.preferences);

  // Compute category distributions
  const categoryCounts: Record<string, number> = {};
  let totalLikes = 0;
  let totalViews = 0;
  let newsCount = 0;
  let recsCount = 0;
  let socialCount = 0;

  items.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    totalLikes += item.engagement.likes;
    totalViews += item.engagement.views || 0;
    if (item.type === 'news') newsCount += 1;
    if (item.type === 'recommendation') recsCount += 1;
    if (item.type === 'social') socialCount += 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Feed Intelligence & Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown of your active content pool, category coverage, and engagement metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Stories</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {items.length}
          </p>
          <span className="text-[11px] text-emerald-500 font-medium">
            Active in memory
          </span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Favorites</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {favorites.length}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">
            Saved items
          </span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Aggregated Likes</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCompactNumber(totalLikes)}
          </p>
          <span className="text-[11px] text-amber-500 font-medium">
            Community engagement
          </span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Live Impressions</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCompactNumber(totalViews)}
          </p>
          <span className="text-[11px] text-purple-500 font-medium">
            Total impressions
          </span>
        </div>
      </div>

      {/* Content Composition and Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Distribution */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Content Source Mix
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600 dark:text-slate-400">News Articles</span>
                <span className="text-slate-900 dark:text-white font-bold">{newsCount} items</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(newsCount / (items.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600 dark:text-slate-400">Media Recommendations (Movies/Music)</span>
                <span className="text-slate-900 dark:text-white font-bold">{recsCount} items</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(recsCount / (items.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600 dark:text-slate-400">Social Media Conversations</span>
                <span className="text-slate-900 dark:text-white font-bold">{socialCount} items</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(socialCount / (items.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Category Coverage
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {ALL_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const isFav = userPreferences.categories.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isFav ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {cat.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
