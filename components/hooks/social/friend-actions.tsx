//src/components/hooks/social/friend-actions.ts`
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';

/**
 * Accepts a friend request and triggers a success callback.
 * @param requestId The ID of the friend request to accept.
 * @param onSuccess A callback function to run on success (e.g., to refetch data).
 */
export const acceptFriendRequest = async (requestId: string, onSuccess: () => void) => {
  await toast.promise(
    apiClient.patch(`/social/friends/requests/${requestId}/accept`),
    {
      loading: 'Accepting request...',
      success: () => {
        onSuccess(); // Trigger the refetch
        return 'Friend request accepted!';
      },
      error: 'Failed to accept request.',
    }
  );
};

/**
 * Rejects a friend request and triggers a success callback.
 * @param requestId The ID of the friend request to reject.
 * @param onSuccess A callback function to run on success (e.g., to refetch data).
 */
export const rejectFriendRequest = async (requestId: string, onSuccess: () => void) => {
  await toast.promise(
    apiClient.patch(`/social/friends/requests/${requestId}/reject`),
    {
      loading: 'Rejecting request...',
      success: () => {
        onSuccess(); // Trigger the refetch
        return 'Friend request rejected.';
      },
      error: 'Failed to reject request.',
    }
  );
};

/**
 * Cancels a sent friend request and triggers a success callback.
 * @param requestId The ID of the friend request to cancel.
 * @param onSuccess A callback function to run on success (e.g., to refetch data).
 */
export const cancelFriendRequest = async (requestId: string, onSuccess: () => void) => {
  await toast.promise(
    apiClient.delete(`/social/friends/requests/${requestId}/cancel`),
    {
      loading: 'Cancelling request...',
      success: () => {
        onSuccess(); // Trigger the refetch
        return 'Friend request cancelled.';
      },
      error: 'Failed to cancel request.',
    }
  );
};// ... existing acceptFriendRequest, rejectFriendRequest, cancelFriendRequest functions ...

/**
 * Removes a friend and triggers a success callback.
 * @param friendId The ID of the friend to remove.
 * @param onSuccess A callback function to run on success (e.g., to refetch data).
 */
export const unfriendUser = async (friendId: string, onSuccess: () => void) => {
  await toast.promise(
    apiClient.delete(`/social/friends/${friendId}`),
    {
      loading: 'Removing friend...',
      success: () => {
        onSuccess(); // Trigger the refetch
        return 'Friend removed successfully.';
      },
      error: 'Failed to remove friend.',
    }
  );
};
