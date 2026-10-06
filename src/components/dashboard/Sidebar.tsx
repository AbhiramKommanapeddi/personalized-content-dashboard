'use client';

import React from 'react';
import {
  LayoutDashboard,
  Flame,
  Heart,
  BarChart3,
  Settings,
  Sparkles,
  X,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveTab, setSelectedCategory, DashboardTab } from '@/store/slices/contentSlice';
import { ALL_CATEGORIES } from '@/types/preferences';
import { Category } from '@/types/content';
import { useTranslation } from '@/hooks/useTranslation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ isOpen, onClose, onOpenSettings }: SidebarProps) {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.content.activeTab);
  const selectedCategory = useAppSelector((state) => state.content.selectedCategory);
  const favoritesCount = useAppSelector((state) => state.favorites.items.length);
  const preferredCategories = useAppSelector((state) => state.preferences.categories);
  const { t } = useTranslation();

  const navItems: { id: DashboardTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'feed',
      label: t('allFeeds'),
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'trending',
      label: t('trending'),
      icon: <Flame className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'favorites',
      label: t('favorites'),
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      badge: favoritesCount,
    },
    {
      id: 'analytics',
      label: t('analytics'),
      icon: <BarChart3 className="w-4 h-4 text-emerald-500" />,
    },
  ];

  const handleSelectTab = (tab: DashboardTab) => {
    dispatch(setActiveTab(tab));
    if (window.innerWidth < 1024) onClose();
  };

  const handleSelectCategory = (cat: Category | 'all') => {
    dispatch(setSelectedCategory(cat));
    dispatch(setActiveTab('feed'));
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white block">
                Pulse<span className="text-blue-500">Hub</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block -mt-1">
                Content OS
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overview
            </span>
            <nav className="mt-2 space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Categories Quick Filter */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Topics & Streams
              </span>
              <button
                onClick={onOpenSettings}
                className="text-[11px] text-blue-500 hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleSelectCategory('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'all' && activeTab === 'feed'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <span>All Topics</span>
                {selectedCategory === 'all' && activeTab === 'feed' && (
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                )}
              </button>

              {ALL_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id && activeTab === 'feed';
                const isPreferred = preferredCategories.includes(cat.id);

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id as Category)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isPreferred ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />
                      <span>{cat.label}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-blue-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer / Settings Quick Button */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>{t('customizeFeed')}</span>
            </div>
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </aside>
    </>
  );
}
