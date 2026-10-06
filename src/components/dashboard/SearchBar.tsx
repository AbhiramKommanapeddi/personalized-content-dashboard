'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setQuery, setDebouncedQuery, removeRecentSearch, clearSearch } from '@/store/slices/searchSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { useTranslation } from '@/hooks/useTranslation';

export function SearchBar() {
  const dispatch = useAppDispatch();
  const { query, recentSearches } = useAppSelector((state) => state.search);
  const [localInput, setLocalInput] = useState(query);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const debouncedVal = useDebounce(localInput, 350);

  // Sync debounced query to Redux
  useEffect(() => {
    dispatch(setDebouncedQuery(debouncedVal));
  }, [debouncedVal, dispatch]);

  // Sync external clear
  useEffect(() => {
    setLocalInput(query);
  }, [query]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalInput(val);
    dispatch(setQuery(val));
  };

  const handleClear = () => {
    setLocalInput('');
    dispatch(clearSearch());
    inputRef.current?.focus();
  };

  const handleSelectRecent = (term: string) => {
    setLocalInput(term);
    dispatch(setQuery(term));
    dispatch(setDebouncedQuery(term));
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          ref={inputRef}
          type="text"
          value={localInput}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          placeholder={t('searchPlaceholder')}
          aria-label="Search content feed"
          className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-transparent focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all duration-200 shadow-sm"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {localInput ? (
            <button
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-200/80 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Autocomplete / Recent searches dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-150">
          {recentSearches.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {t('recentSearches')}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 px-2">
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer transition-colors"
                  >
                    <span onClick={() => handleSelectRecent(term)}>{term}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeRecentSearch(term));
                      }}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Instant debounced search across News, Movies, Music & Social
            </span>
            <span className="flex items-center gap-1">
              Press Esc to dismiss
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
