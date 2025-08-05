import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
// --- START: IMPORT THE TYPE GUARD ---
import { isApiErrorResponse } from '@/lib/types';
// --- END: IMPORT THE TYPE GUARD ---

export interface UpdateProfilePayload {
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
}

/**
 * A helper function to extract a user-friendly error message from an API response.
 */
const getApiErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError && isApiErrorResponse(error.response?.data)) {
    // The message from the backend can be a single string or an array of strings (from class-validator)
    const apiMessage = error.response.data.message;
    return Array.isArray(apiMessage) ? apiMessage[0] : apiMessage;
  }
  return defaultMessage;
};

/**
 * Sends a friend request to a user.
 * @param recipientId The ID of the user to send the request to.
 */
export const sendFriendRequest = async (recipientId: string) => {
  toast.promise(apiClient.post('/social/friends/request', { recipientId }), {
    loading: 'Sending friend request...',
    success: 'Friend request sent successfully!',
    // --- FIX: Use the type-safe error handler ---
    error: (err) => getApiErrorMessage(err, 'Failed to send request.'),
  });
};

/**
 * Follows a user.
 * @param userIdToFollow The ID of the user to follow.
 */
export const followUser = async (userIdToFollow: string) => {
  toast.promise(apiClient.post(`/social/follow/${userIdToFollow}`), {
    loading: 'Following user...',
    success: 'You are now following this user!',
    // --- FIX: Use the type-safe error handler ---
    error: (err) => getApiErrorMessage(err, 'Failed to follow user.'),
  });
};

/**
 * Updates the current user's profile.
 * @param payload The data to update.
 */
export const editProfile = async (payload: UpdateProfilePayload) => {
  return toast.promise(apiClient.patch('/profile/me', payload), {
    loading: 'Updating profile...',
    success: 'Profile updated successfully!',
    // --- FIX: Use the type-safe error handler ---
    error: (err) => getApiErrorMessage(err, 'Failed to update profile.'),
  });
};