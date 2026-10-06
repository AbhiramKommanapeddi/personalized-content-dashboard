import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from '@/types/user';

interface NotificationsState {
  items: NotificationItem[];
  unreadCount: number;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Milestone Breakthrough in Tech',
    message: 'Next-Gen Quantum Processors achieved 99.98% fidelity. High relevance to your preferences.',
    timestamp: '10m ago',
    read: false,
    type: 'breaking',
    targetId: 'news-1',
  },
  {
    id: 'notif-2',
    title: 'Trending Entertainment Pick',
    message: 'Chronos: The Paradox of Horizon is trending #2 today.',
    timestamp: '35m ago',
    read: false,
    type: 'trending',
    targetId: 'rec-1',
  },
];

const initialState: NotificationsState = {
  items: INITIAL_NOTIFICATIONS,
  unreadCount: INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'read'>>) => {
      const newNotif: NotificationItem = {
        ...action.payload,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        read: false,
      };
      state.items.unshift(newNotif);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
