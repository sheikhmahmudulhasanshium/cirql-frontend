// src/components/hooks/support/use-ticket-actions.ts
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const getApiErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as { message?: string | string[] };
      if (apiError && apiError.message) {
        return Array.isArray(apiError.message) ? apiError.message.join(', ') : apiError.message;
      }
    }
    return 'An unexpected error occurred.';
};

export const lockTicket = async (ticketId: string): Promise<void> => {
    try {
        await apiClient.patch(`/support/tickets/${ticketId}/lock`);
        toast.success("Ticket Locked", { description: "Replies are now disabled." });
    } catch (error) {
        toast.error("Failed to lock ticket", { description: getApiErrorMessage(error) });
        throw error;
    }
};

export const unlockTicket = async (ticketId: string): Promise<void> => {
    try {
        await apiClient.patch(`/support/tickets/${ticketId}/unlock`);
        toast.success("Ticket Unlocked", { description: "Replies are now enabled." });
    } catch (error) {
        toast.error("Failed to unlock ticket", { description: getApiErrorMessage(error) });
        throw error;
    }
};

export const editMessage = async (messageId: string, content: string): Promise<void> => {
    try {
        await apiClient.patch(`/support/tickets/messages/${messageId}`, { content });
        toast.success("Message updated successfully.");
    } catch (error) {
        toast.error("Failed to edit message", { description: getApiErrorMessage(error) });
        throw error;
    }
};