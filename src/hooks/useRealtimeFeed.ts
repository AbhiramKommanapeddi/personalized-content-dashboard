import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { receiveLiveItem } from '@/store/slices/contentSlice';
import { addNotification } from '@/store/slices/notificationsSlice';
import { generateLiveContentItem } from '@/utils/apiData';

export function useRealtimeFeed() {
  const dispatch = useAppDispatch();
  const { autoRefresh, refreshIntervalSeconds } = useAppSelector((state) => state.preferences);
  const counterRef = useRef(0);

  useEffect(() => {
    if (!autoRefresh) return;

    // Run periodic live tick
    const intervalMs = Math.max(10, refreshIntervalSeconds) * 1000;
    const timer = setInterval(() => {
      counterRef.current += 1;
      const newItem = generateLiveContentItem(counterRef.current);
      dispatch(receiveLiveItem(newItem));

      // Push real-time notification
      dispatch(
        addNotification({
          title: `Real-time: ${newItem.title.slice(0, 40)}...`,
          message: newItem.description.slice(0, 80) + '...',
          timestamp: 'Just now',
          type: newItem.type === 'news' ? 'breaking' : 'trending',
          targetId: newItem.id,
        })
      );
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoRefresh, refreshIntervalSeconds, dispatch]);
}
