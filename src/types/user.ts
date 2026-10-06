export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  bio: string;
  location?: string;
  joinedDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'breaking' | 'trending' | 'recommendation' | 'system';
  targetId?: string;
}
