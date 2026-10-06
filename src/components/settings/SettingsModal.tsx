'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  toggleCategory,
  toggleContentType,
  setTheme,
  setViewMode,
  setAutoRefresh,
  setRefreshInterval,
  resetPreferences,
  setApiKeys,
} from '@/store/slices/preferencesSlice';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { ALL_CATEGORIES } from '@/types/preferences';
import { Category, ContentType } from '@/types/content';
import {
  Sparkles,
  LayoutGrid,
  List,
  Moon,
  Sun,
  Laptop,
  Radio,
  Key,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/common/Toast';
import { useTranslation } from '@/hooks/useTranslation';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [newsKey, setNewsKey] = useState(preferences.apiKeys?.newsApiKey || '');
  const [tmdbKey, setTmdbKey] = useState(preferences.apiKeys?.tmdbApiKey || '');

  const handleSaveApiKeys = () => {
    dispatch(setApiKeys({ newsApiKey: newsKey, tmdbApiKey: tmdbKey }));
    showToast('API preferences saved', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Reset all preferences to default settings?')) {
      dispatch(resetPreferences());
      showToast('Settings reset to defaults', 'info');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('settings')}
      subtitle="Configure personalized topic streams, layout, theme, and data sources"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Favorite Categories Multi-Selector */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Personalized Topics ({preferences.categories.length} selected)
            </h4>
            <span className="text-[11px] text-slate-400">
              At least 1 required
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = preferences.categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => dispatch(toggleCategory(cat.id as Category))}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate">{cat.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-blue-500" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Enabled Content Sources */}
        <section className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Content Sources
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'news', label: 'News Feed' },
                { id: 'recommendation', label: 'Movies & Music' },
                { id: 'social', label: 'Social Posts' },
              ] as const
            ).map((src) => {
              const isEnabled = preferences.enabledTypes.includes(src.id as ContentType);
              return (
                <button
                  key={src.id}
                  onClick={() => dispatch(toggleContentType(src.id as ContentType))}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    isEnabled
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {src.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* View Mode & Theme Preferences */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* View Mode */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Layout Style
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(setViewMode('grid'))}
                className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  preferences.viewMode === 'grid'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid View
              </button>

              <button
                onClick={() => dispatch(setViewMode('list'))}
                className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  preferences.viewMode === 'list'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <List className="w-4 h-4" />
                List View
              </button>
            </div>
          </div>

          {/* Theme Mode */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Appearance
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(setTheme('dark'))}
                className={`flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  preferences.theme === 'dark'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Dark
              </button>
              <button
                onClick={() => dispatch(setTheme('light'))}
                className={`flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  preferences.theme === 'light'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Light
              </button>
              <button
                onClick={() => dispatch(setTheme('system'))}
                className={`flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  preferences.theme === 'system'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                Auto
              </button>
            </div>
          </div>
        </section>

        {/* Live Stream & Auto-Refresh Settings */}
        <section className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-500" />
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                  Real-time Live Stream Simulation
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Receive simulated real-time breaking events and live feed ticks
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.autoRefresh}
              onChange={(e) => dispatch(setAutoRefresh(e.target.checked))}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>

          {preferences.autoRefresh && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                Tick Frequency:
              </span>
              <div className="flex gap-1.5">
                {[
                  { sec: 20, label: '20s (Fast)' },
                  { sec: 60, label: '1m (Normal)' },
                  { sec: 300, label: '5m' },
                ].map((opt) => (
                  <button
                    key={opt.sec}
                    onClick={() => dispatch(setRefreshInterval(opt.sec))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                      preferences.refreshIntervalSeconds === opt.sec
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Optional Live External API Keys */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Custom API Keys (Optional)
            </h4>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                NewsAPI.org API Key
              </label>
              <input
                type="password"
                value={newsKey}
                onChange={(e) => setNewsKey(e.target.value)}
                placeholder="Optional NewsAPI key (mock fallback active if empty)"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                TMDB / Movie Database API Key
              </label>
              <input
                type="password"
                value={tmdbKey}
                onChange={(e) => setTmdbKey(e.target.value)}
                placeholder="Optional TMDB key (curated recommendations active if empty)"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <Button variant="secondary" size="sm" onClick={handleSaveApiKeys}>
              Save API Keys
            </Button>
          </div>
        </section>

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Defaults
          </button>

          <Button variant="primary" size="md" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
