'use client';

import React, { useState, useMemo } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { reorderFeedItems, resetCustomOrder, fetchUnifiedContent } from '@/store/slices/contentSlice';
import { ContentCard } from './ContentCard';
import { FeedSkeleton } from './FeedSkeleton';
import { Button } from '@/components/common/Button';
import { RotateCcw, AlertTriangle, RefreshCw, Sparkles, FilterX } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { ContentItem } from '@/types/content';

export function UnifiedFeed() {
  const dispatch = useAppDispatch();
  const { items, status, error, selectedCategory, selectedType, userOrderIds } = useAppSelector(
    (state) => state.content
  );
  const { categories: userPreferredCategories, enabledTypes, viewMode } = useAppSelector(
    (state) => state.preferences
  );
  const searchQuery = useAppSelector((state) => state.search.debouncedQuery);
  const { t } = useTranslation();

  const [visibleCount, setVisibleCount] = useState(9);
  const [isDndEnabled, setIsDndEnabled] = useState(true);

  // Filter items based on:
  // 1. User preferences (categories & types)
  // 2. Active filter pills
  // 3. Search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Preference filter: type must be enabled in preferences
      if (!enabledTypes.includes(item.type)) return false;

      // Filter by active type pill
      if (selectedType !== 'all' && item.type !== selectedType) return false;

      // Filter by active category pill
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // If no specific category is selected, prefer user's configured favorite categories
      if (selectedCategory === 'all' && !userPreferredCategories.includes(item.category)) {
        // We still show others if items list would be too sparse, but prioritize preferred
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesSource = item.source.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesSource || matchesCategory;
      }

      return true;
    });
  }, [items, enabledTypes, selectedType, selectedCategory, userPreferredCategories, searchQuery]);

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleReorder = (newOrder: ContentItem[]) => {
    // Merge new order into global items
    const reorderedIds = new Set(newOrder.map((i) => i.id));
    const unaffectedItems = items.filter((i) => !reorderedIds.has(i.id));
    dispatch(reorderFeedItems([...newOrder, ...unaffectedItems]));
  };

  const handleResetOrder = () => {
    dispatch(resetCustomOrder());
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  if (status === 'loading' && items.length === 0) {
    return <FeedSkeleton count={6} />;
  }

  if (status === 'failed' && items.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center max-w-md mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Failed to Load Stream
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {error || 'An error occurred while connecting to feed services.'}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={() => dispatch(fetchUnifiedContent({}))}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center max-w-md mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
          <FilterX className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Matching Content Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('noResults')}
          </p>
        </div>
      </div>
    );
  }

  const isListView = viewMode === 'list';

  return (
    <div className="space-y-4">
      {/* Feed Controls Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong>{displayedItems.length}</strong> of <strong>{filteredItems.length}</strong> stories
          </span>
          {userOrderIds.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full font-medium">
              <Sparkles className="w-3 h-3" />
              Custom Reordered
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {userOrderIds.length > 0 && (
            <button
              onClick={handleResetOrder}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Reset to default chronological order"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('resetOrder')}</span>
            </button>
          )}

          <button
            onClick={() => setIsDndEnabled(!isDndEnabled)}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              isDndEnabled
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {isDndEnabled ? 'DnD Reorder On' : 'DnD Off'}
          </button>
        </div>
      </div>

      {/* Drag and Drop Feed using Framer Motion Reorder */}
      {isDndEnabled ? (
        <Reorder.Group
          axis={isListView ? 'y' : 'y'}
          values={displayedItems}
          onReorder={handleReorder}
          className={
            isListView
              ? 'space-y-4 list-none p-0'
              : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 list-none p-0'
          }
        >
          {displayedItems.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className="list-none"
              whileDrag={{ scale: 1.02, zIndex: 30 }}
            >
              <ContentCard item={item} isDraggable={true} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div
          className={
            isListView
              ? 'space-y-4'
              : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
          }
        >
          {displayedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ContentCard item={item} isDraggable={false} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Infinite scrolling / Pagination Load More Button */}
      {hasMore && (
        <div className="pt-8 pb-4 text-center">
          <Button
            variant="secondary"
            size="md"
            onClick={handleLoadMore}
            className="w-full sm:w-auto px-8"
          >
            Load More Stories ({filteredItems.length - displayedItems.length} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
