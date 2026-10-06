'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { applyPendingLiveItems } from '@/store/slices/contentSlice';
import { Radio, ArrowUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function LiveTicker() {
  const dispatch = useAppDispatch();
  const livePendingItems = useAppSelector((state) => state.content.livePendingItems);
  const autoRefresh = useAppSelector((state) => state.preferences.autoRefresh);
  const { t } = useTranslation();

  if (livePendingItems.length === 0) {
    return (
      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 py-1">
        <span className="relative flex h-2 w-2">
          {autoRefresh && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              autoRefresh ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          />
        </span>
        <span className="font-medium">
          {autoRefresh ? 'Live Stream Active (Auto-updating)' : 'Live Stream Paused'}
        </span>
      </div>
    );
  }

  return (
    <div className="py-2 animate-in fade-in slide-in-from-top-3 duration-300">
      <button
        onClick={() => dispatch(applyPendingLiveItems())}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-medium text-xs sm:text-sm cursor-pointer transition-all transform hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <Radio className="w-4 h-4 animate-pulse" />
          <span>
            <strong>{livePendingItems.length}</strong> {t('newItemsAlert')}
          </span>
        </div>
        <div className="flex items-center gap-1 text-blue-100 font-semibold text-xs">
          <span>Show latest</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
}
