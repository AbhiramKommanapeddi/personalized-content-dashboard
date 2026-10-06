'use client';

import React from 'react';
import {
  Heart,
  Share2,
  ExternalLink,
  Play,
  Pause,
  Film,
  Newspaper,
  MessageSquare,
  Clock,
  Sparkles,
  GripVertical,
  Flame,
  Check,
} from 'lucide-react';
import { ContentItem } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { setActiveModalItem, setAudioPlayerState } from '@/store/slices/contentSlice';
import { formatRelativeTime, formatCompactNumber } from '@/utils/dateUtils';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Toast';
import { useTranslation } from '@/hooks/useTranslation';

interface ContentCardProps {
  item: ContentItem;
  dragHandleProps?: Record<string, unknown>;
  isDraggable?: boolean;
}

export function ContentCard({ item, dragHandleProps, isDraggable = true }: ContentCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const audioPlayerState = useAppSelector((state) => state.content.audioPlayerState);
  const viewMode = useAppSelector((state) => state.preferences.viewMode);
  const searchQuery = useAppSelector((state) => state.search.debouncedQuery);

  const { showToast } = useToast();
  const { t } = useTranslation();

  const isFavorited = favorites.some((fav) => fav.id === item.id);
  const isPlayingThisAudio =
    audioPlayerState.isPlaying && audioPlayerState.currentTrackTitle === item.title;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
    showToast(
      isFavorited ? 'Removed from favorites' : 'Saved to your favorites',
      isFavorited ? 'info' : 'success'
    );
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined') {
      const url = item.url || window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        showToast(t('copied'), 'success');
      });
    }
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'recommendation' && item.audioPreviewUrl) {
      if (isPlayingThisAudio) {
        dispatch(setAudioPlayerState({ isPlaying: false }));
      } else {
        dispatch(
          setAudioPlayerState({
            isPlaying: true,
            currentTrackTitle: item.title,
            audioUrl: item.audioPreviewUrl,
          })
        );
        showToast(`Playing preview: ${item.title}`, 'info');
      }
    }
  };

  const handleCardClick = () => {
    dispatch(setActiveModalItem(item));
  };

  // Helper to render type badge
  const renderTypeIcon = () => {
    switch (item.type) {
      case 'news':
        return <Newspaper className="w-3 h-3 text-blue-500" />;
      case 'recommendation':
        return <Film className="w-3 h-3 text-amber-500" />;
      case 'social':
        return <MessageSquare className="w-3 h-3 text-emerald-500" />;
    }
  };

  const isListView = viewMode === 'list';

  return (
    <article
      onClick={handleCardClick}
      className={`glass-card group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex ${
        isListView ? 'flex-col sm:flex-row items-stretch' : 'flex-col'
      }`}
    >
      {/* Drag handle */}
      {isDraggable && (
        <div
          {...dragHandleProps}
          title={t('dragToReorder')}
          className="absolute top-3 left-3 z-20 p-1.5 rounded-lg bg-slate-900/70 text-slate-300 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Media Image / Thumbnail */}
      {item.imageUrl && (
        <div
          className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${
            isListView
              ? 'w-full sm:w-56 h-48 sm:h-auto shrink-0'
              : 'w-full h-48 sm:h-52'
          }`}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

          {/* Badges on image */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {item.isTrending && (
              <Badge variant="warning" size="sm" icon={<Flame className="w-3 h-3" />}>
                #{item.trendingRank || 'Trending'}
              </Badge>
            )}
            <Badge variant="neutral" size="sm" className="bg-slate-900/80 text-white backdrop-blur-md border-0">
              {item.source}
            </Badge>
          </div>

          {/* Play button overlay for music / movie recommendations */}
          {item.type === 'recommendation' && (
            <div className="absolute bottom-3 left-3 z-10">
              {item.audioPreviewUrl ? (
                <button
                  onClick={handlePlayAudio}
                  aria-label={isPlayingThisAudio ? t('pausePreview') : t('playPreview')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold backdrop-blur-md shadow-md transition-all active:scale-95"
                >
                  {isPlayingThisAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5 animate-pulse" />
                      <span>{t('pausePreview')}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>{t('playPreview')}</span>
                    </>
                  )}
                </button>
              ) : item.subType === 'movie' && item.rating ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 text-xs font-bold backdrop-blur-md">
                  ★ {item.rating}/10
                </span>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mb-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                {renderTypeIcon()}
                {item.type}
              </span>
              <span>•</span>
              <span className="capitalize">{item.category}</span>
            </div>
            <span suppressHydrationWarning className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(item.createdAt)}
            </span>
          </div>

          {/* Headline / Title */}
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
            {item.title}
          </h3>

          {/* Brief Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>

          {/* Specific Meta Attributes: Social handles, author, etc. */}
          {item.type === 'social' && (
            <div className="flex items-center gap-2 mb-3">
              <img
                src={item.authorAvatar}
                alt={item.authorHandle}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {item.authorHandle}
              </span>
              {item.authorVerified && (
                <Check className="w-3 h-3 text-blue-500 stroke-[3]" />
              )}
            </div>
          )}

          {item.type === 'news' && item.author && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <span>By {item.author}</span>
              <span>•</span>
              <span>{item.readTimeMinutes} {t('readTime')}</span>
            </div>
          )}
        </div>

        {/* Card Footer: Engagement stats & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          {/* Engagement counts */}
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
            <span>{formatCompactNumber(item.engagement.likes)} {t('likes')}</span>
            {item.engagement.views && (
              <span>{formatCompactNumber(item.engagement.views)} {t('views')}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Favorite button */}
            <button
              onClick={handleFavoriteClick}
              aria-label={isFavorited ? 'Remove favorite' : 'Add to favorites'}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isFavorited
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  isFavorited ? 'fill-current' : ''
                }`}
              />
            </button>

            {/* Share button */}
            <button
              onClick={handleShareClick}
              aria-label={t('share')}
              className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Detail modal button */}
            <button
              onClick={handleCardClick}
              aria-label={t('readMore')}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
