'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUnifiedContent } from '@/store/slices/contentSlice';
import { Header } from '@/components/dashboard/Header';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { CategoryPills } from '@/components/dashboard/CategoryPills';
import { LiveTicker } from '@/components/dashboard/LiveTicker';
import { UnifiedFeed } from '@/components/feed/UnifiedFeed';
import { TrendingSection } from '@/components/feed/TrendingSection';
import { FavoritesSection } from '@/components/feed/FavoritesSection';
import { AnalyticsSection } from '@/components/feed/AnalyticsSection';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { ProfileModal } from '@/components/settings/ProfileModal';
import { MediaDetailModal } from '@/components/feed/MediaDetailModal';
import { useRealtimeFeed } from '@/hooks/useRealtimeFeed';
import { useTranslation } from '@/hooks/useTranslation';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.content.activeTab);
  const selectedCategory = useAppSelector((state) => state.content.selectedCategory);
  const { t } = useTranslation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Activate background real-time ticker
  useRealtimeFeed();

  // Initial content fetch
  useEffect(() => {
    dispatch(fetchUnifiedContent({ category: selectedCategory }));
  }, [dispatch, selectedCategory]);

  return (
    <div className="min-h-screen flex bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Navigation Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        {/* Sticky Header */}
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Dashboard Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Control Bar & Live Ticker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {activeTab === 'feed'
                    ? t('allFeeds')
                    : activeTab === 'trending'
                    ? t('trending')
                    : activeTab === 'favorites'
                    ? t('favorites')
                    : t('analytics')}
                </h1>
                {activeTab === 'feed' && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Sparkles className="w-3 h-3" />
                    Personalized For You
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('tagline')}
              </p>
            </div>

            {/* Live Ticker Status Pill */}
            <div className="flex items-center gap-3">
              <LiveTicker />
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('customizeFeed')}</span>
              </button>
            </div>
          </div>

          {/* Quick Filters (Shown primarily in Feed view) */}
          {activeTab === 'feed' && <CategoryPills />}

          {/* Dynamic Tab Views */}
          {activeTab === 'feed' && <UnifiedFeed />}
          {activeTab === 'trending' && <TrendingSection />}
          {activeTab === 'favorites' && <FavoritesSection />}
          {activeTab === 'analytics' && <AnalyticsSection />}
        </main>
      </div>

      {/* Global Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <MediaDetailModal />
    </div>
  );
}
