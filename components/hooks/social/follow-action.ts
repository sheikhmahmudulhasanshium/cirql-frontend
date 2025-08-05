import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';

/**
 * Accepts a follow request and triggers a success callback.
 * @param requestId The ID of the follow request to accept.
 * @param onSuccess A callback function to run on success (e.g., to refetch data).
 */
export const acceptFollowRequest = async (requestId: string, onSuccess: () => void) => {
  await toast.promise(
    apiClient.patch(`/social/follow-requests/${requestId}/accept`),
    {
      loading: 'Accepting request...',
      success: () => {
        onSuccess(); // Trigger the refetch
        return 'Follow request accepted!';
      },
      error: 'Failed to accept request.',
    }
  );
};

/**
 * Rejects a follow request and triggers a success callback.
 * @param requestId The ID of the follow request to reject.
 * @param onSuccess A callback function to run on success (e.g., to refetch data).
 */
export const rejectFollowRequest = async (requestId: string, onSuccess: () => void) => {
  await toast.promise(
    apiClient.patch(`/social/follow-requests/${requestId}/reject`),
    {
      loading: 'Rejecting request...',
      success: () => {
        onSuccess(); // Trigger the refetch
        return 'Follow request rejected.';
      },
      error: 'Failed to reject request.',
    }
  );
};

/**
 * Cancels a sent follow request and triggers a success callback.
 * @param requestId The ID of the follow request to cancel.
 * @param onSuccess A callback function to run on success (e.g., to refetch data).
 */
export const cancelFollowRequest = async (requestId: string, onSuccess: () => void) => {
  await toast.promise(
    apiClient.delete(`/social/follow-requests/${requestId}/cancel`),
    {
      loading: 'Cancelling request...',
      success: () => {
        onSuccess(); // Trigger the refetch
        return 'Follow request cancelled.';
      },
      error: 'Failed to cancel request.',
    }
  );
};