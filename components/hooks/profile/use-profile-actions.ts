import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { isApiErrorResponse } from '@/lib/types';

export interface UpdateProfilePayload {
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
}

const getApiErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError && isApiErrorResponse(error.response?.data)) {
    const apiMessage = error.response.data.message;
    return Array.isArray(apiMessage) ? apiMessage[0] : apiMessage;
  }
  return defaultMessage;
};

/**
 * Sends a friend request to a user.
 * @param recipientId The ID of the user to send the request to.
 * @param onSuccess A callback function to run on success (e.g., to refetch data).
 */
export const sendFriendRequest = async (recipientId: string, onSuccess: () => void) => {
  await toast.promise(apiClient.post('/social/friends/request', { recipientId }), {
    loading: 'Sending friend request...',
    // --- FIX: Call onSuccess and return the success message ---
    success: () => {
      onSuccess();
      return 'Friend request sent successfully!';
    },
    error: (err) => getApiErrorMessage(err, 'Failed to send request.'),
  });
};

/**
 * Follows a user and triggers a success callback.
 * @param userIdToFollow The ID of the user to follow.
 * @param onSuccess A callback function to run on success (e.g., to refetch profile data).
 */
export const followUser = async (userIdToFollow: string, onSuccess: () => void) => {
  await toast.promise(
    apiClient.post(`/social/follow/${userIdToFollow}`),
    {
      loading: 'Following user...',
      success: () => {
        onSuccess();
        return 'You are now following this user!';
      },
      error: (err) => getApiErrorMessage(err, 'Failed to follow user.'),
    }
  );
};

/**
 * Unfollows a user and triggers a success callback.
 * @param userIdToUnfollow The ID of the user to unfollow.
 * @param onSuccess A callback function to run on success (e.g., to refetch profile data).
 */
export const unfollowUser = async (userIdToUnfollow: string, onSuccess: () => void) => {
  await toast.promise(
    apiClient.delete(`/social/unfollow/${userIdToUnfollow}`),
    {
      loading: 'Unfollowing user...',
      success: () => {
        onSuccess();
        return 'You have unfollowed this user.';
      },
      error: (err) => getApiErrorMessage(err, 'Failed to unfollow user.'),
    }
  );
};

/**
 * Updates the current user's profile.
 * @param payload The data to update.
 * @param onSuccess A callback function to run on success (e.g., to refetch profile data).
 */
export const editProfile = async (payload: UpdateProfilePayload, onSuccess: () => void) => {
  await toast.promise(
    apiClient.patch('/profile/me', payload),
    {
      loading: 'Updating profile...',
      success: () => {
        onSuccess();
        return 'Profile updated successfully!';
      },
      error: (err) => getApiErrorMessage(err, 'Failed to update profile.'),
    }
  );
};