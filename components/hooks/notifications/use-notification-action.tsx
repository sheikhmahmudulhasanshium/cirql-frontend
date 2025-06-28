// src/components/hooks/notifications/use-notification-actions.ts
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

/**
 * Marks a single notification as read.
 * @param notificationId The ID of the notification to mark as read.
 * @returns True on success, false on failure.
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    await apiClient.patch(`/notifications/${notificationId}/read`);
    return true;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return false;
  }
};

/**
 * Marks all of the user's unread notifications as read.
 * @returns The number of notifications modified on success, or null on failure.
 */
export const markAllNotificationsAsRead = async (): Promise<number | null> => {
    try {
        const response = await apiClient.patch<{ modifiedCount: number }>('/notifications/read/all');
        return response.data.modifiedCount;
    } catch (err) {
        const error = err as AxiosError;
        toast.error("Failed to mark all as read", {
            description: (error.response?.data as { message: string })?.message || "Please try again later.",
        });
        return null;
    }
};