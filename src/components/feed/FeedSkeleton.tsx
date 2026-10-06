'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';

export function FeedSkeleton({ count = 6 }: { count?: number }) {
  const viewMode = useAppSelector((state) => state.preferences.viewMode);
  const isListView = viewMode === 'list';

  return (
    <div
      className={
        isListView
          ? 'space-y-4'
          : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
      }
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`glass-card rounded-2xl overflow-hidden p-0 flex ${
            isListView ? 'flex-col sm:flex-row' : 'flex-col'
          }`}
        >
          {/* Image skeleton */}
          <div
            className={`skeleton-shimmer ${
              isListView ? 'w-full sm:w-56 h-48 sm:h-auto' : 'w-full h-48'
            }`}
          />

          {/* Details skeleton */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-20 h-4 rounded-md skeleton-shimmer" />
                <div className="w-16 h-3 rounded-md skeleton-shimmer" />
              </div>
              <div className="w-full h-5 rounded-md skeleton-shimmer" />
              <div className="w-4/5 h-5 rounded-md skeleton-shimmer" />
              <div className="w-full h-3 rounded-md skeleton-shimmer mt-2" />
              <div className="w-3/4 h-3 rounded-md skeleton-shimmer" />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="w-24 h-3 rounded-md skeleton-shimmer" />
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-lg skeleton-shimmer" />
                <div className="w-7 h-7 rounded-lg skeleton-shimmer" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
