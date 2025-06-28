// src/components/contexts/NotificationContext.tsx
'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useUnreadCount } from '@/components/hooks/notifications/use-unread-count';
import { toast } from 'sonner';
import { markAllNotificationsAsRead, markNotificationAsRead } from '../hooks/notifications/use-notification-action';

interface NotificationContextType {
  unreadCount: number;
  refetchUnreadCount: () => void;
  handleMarkAsRead: (notificationId: string) => Promise<void>;
  handleMarkAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { count, refetch } = useUnreadCount();

  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      refetch(); // Refetch the count after a successful action
    }
  }, [refetch]);

  const handleMarkAllAsRead = useCallback(async () => {
    const modifiedCount = await markAllNotificationsAsRead();
    if (modifiedCount !== null) {
      toast.success(`${modifiedCount} notification${modifiedCount !== 1 ? 's' : ''} marked as read.`);
      refetch(); // Refetch the count
    }
  }, [refetch]);

  const value = {
    unreadCount: count,
    refetchUnreadCount: refetch,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};