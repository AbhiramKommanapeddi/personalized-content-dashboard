'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedCategory, setSelectedType } from '@/store/slices/contentSlice';
import { ALL_CATEGORIES } from '@/types/preferences';
import { Category, ContentType } from '@/types/content';
import { Newspaper, Film, MessageSquare, Layers } from 'lucide-react';

export function CategoryPills() {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((state) => state.content.selectedCategory);
  const selectedType = useAppSelector((state) => state.content.selectedType);
  const userPreferredCategories = useAppSelector((state) => state.preferences.categories);

  const typeOptions: { id: ContentType | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Sources', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'news', label: 'News', icon: <Newspaper className="w-3.5 h-3.5" /> },
    { id: 'recommendation', label: 'Picks & Media', icon: <Film className="w-3.5 h-3.5" /> },
    { id: 'social', label: 'Social Pulse', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col gap-3 py-2">
      {/* Content Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {typeOptions.map((type) => {
          const isActive = selectedType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => dispatch(setSelectedType(type.id))}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {type.icon}
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Category Pills with personalized preference indicator */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => dispatch(setSelectedCategory('all'))}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
          }`}
        >
          All Topics
        </button>

        {ALL_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const isPreferred = userPreferredCategories.includes(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => dispatch(setSelectedCategory(cat.id as Category))}
              className={`relative inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              {cat.label}
              {isPreferred && (
                <span
                  title="In your preferences"
                  className="w-1.5 h-1.5 rounded-full bg-blue-500"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
