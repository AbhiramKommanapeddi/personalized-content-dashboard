'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveModalItem } from '@/store/slices/contentSlice';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { formatRelativeTime } from '@/utils/dateUtils';
import {
  Heart,
  Share2,
  ExternalLink,
  Play,
  Pause,
  Clock,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function MediaDetailModal() {
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => state.content.activeModalItem);
  const favorites = useAppSelector((state) => state.favorites.items);
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isFavorited = item ? favorites.some((fav) => fav.id === item.id) : false;

  useEffect(() => {
    // Reset audio state when modal opens/changes
    setIsPlayingAudio(false);
    setAudioProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [item]);

  if (!item) return null;

  const handleToggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(() => {
        showToast('Audio playback could not be started', 'error');
      });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 1;
      setAudioProgress((current / duration) * 100);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast(t('copied'), 'success');
    }
  };

  return (
    <Modal
      isOpen={!!item}
      onClose={() => dispatch(setActiveModalItem(null))}
      title={item.title}
      subtitle={`${item.source} • ${formatRelativeTime(item.createdAt)}`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Header Cover Image */}
        {item.imageUrl && (
          <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden bg-slate-900 shadow-md">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

            <div className="absolute top-3 right-3 flex items-center gap-2">
              {item.isTrending && (
                <Badge variant="warning" size="md" icon={<Flame className="w-3.5 h-3.5" />}>
                  Trending #{item.trendingRank || 1}
                </Badge>
              )}
              <Badge variant="gradient" size="md">
                {item.type.toUpperCase()}
              </Badge>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="font-semibold bg-slate-950/60 px-3 py-1 rounded-lg backdrop-blur-md">
                Category: {item.category}
              </span>
              {item.type === 'recommendation' && item.rating && (
                <span className="font-bold bg-amber-500 text-slate-950 px-3 py-1 rounded-lg">
                  Score: {item.rating} / 10
                </span>
              )}
            </div>
          </div>
        )}

        {/* Audio Player if Audio Preview is available */}
        {item.type === 'recommendation' && item.audioPreviewUrl && (
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col gap-2">
            <audio
              ref={audioRef}
              src={item.audioPreviewUrl}
              onTimeUpdate={handleAudioTimeUpdate}
              onEnded={() => setIsPlayingAudio(false)}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleAudio}
                  aria-label={isPlayingAudio ? 'Pause' : 'Play'}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  {isPlayingAudio ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Listen to Preview
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.creatorOrArtist || 'Audio Preview'}
                  </p>
                </div>
              </div>
              <Volume2 className="w-4 h-4 text-blue-500 animate-pulse" />
            </div>

            {/* Audio scrubber bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-blue-600 h-full transition-all duration-150"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Full Content / Article Body */}
        <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
          <p className="font-semibold text-base text-slate-900 dark:text-white leading-normal">
            {item.description}
          </p>

          {item.type === 'news' && item.fullContent && (
            <p className="text-slate-600 dark:text-slate-400">
              {item.fullContent}
            </p>
          )}

          {item.type === 'social' && item.hashtags && (
            <div className="flex flex-wrap gap-2 pt-2">
              {item.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {item.type === 'recommendation' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Format</span>
                <span className="font-semibold capitalize">{item.subType}</span>
              </div>
              {item.releaseYear && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Release Year</span>
                  <span className="font-semibold">{item.releaseYear}</span>
                </div>
              )}
              {item.duration && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Duration</span>
                  <span className="font-semibold">{item.duration}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              variant={isFavorited ? 'secondary' : 'outline'}
              size="sm"
              leftIcon={
                <Heart
                  className={`w-4 h-4 ${
                    isFavorited ? 'text-rose-500 fill-current' : ''
                  }`}
                />
              }
              onClick={() => dispatch(toggleFavorite(item))}
            >
              {isFavorited ? 'Favorited' : 'Add to Favorites'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Share2 className="w-4 h-4" />}
              onClick={handleShare}
            >
              {t('share')}
            </Button>
          </div>

          <Button
            variant="primary"
            size="sm"
            rightIcon={<ExternalLink className="w-4 h-4" />}
            onClick={() => {
              if (item.url) window.open(item.url, '_blank');
              else showToast('Opening simulated source article', 'info');
            }}
          >
            Visit Source
          </Button>
        </div>
      </div>
    </Modal>
  );
}
