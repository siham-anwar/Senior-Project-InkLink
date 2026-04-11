import { api } from '@/lib/api';

export interface NotificationUpdate {
  id: string;
  type: 'chapter' | 'announcement';
  authorName: string;
  authorImage: string;
  title: string;
  description: string;
  timestamp: string;
  bookTitle?: string;
  bookImage?: string;
  isRead: boolean;
}

export interface NotificationMessage {
  id: string;
  senderName: string;
  senderImage: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isAuthor: boolean;
}

export interface UserNotifications {
  updates: NotificationUpdate[];
  messages: NotificationMessage[];
}

export const notificationsService = {
  async getNotifications(): Promise<UserNotifications> {
    const res = await api.get('/notifications');
    return res.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async getUnreadCount(): Promise<number> {
    try {
      const data = await notificationsService.getNotifications();
      const unreadUpdates = (data.updates ?? []).filter(u => !u.isRead).length;
      const unreadMessages = (data.messages ?? []).filter(m => m.unread).length;
      return unreadUpdates + unreadMessages;
    } catch {
      return 0;
    }
  },
};
