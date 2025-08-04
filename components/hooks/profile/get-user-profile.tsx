'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Profile } from '@/lib/types';
import { AxiosError } from 'axios';

/**
 * A custom hook to get a specific user's profile by their ID
 * using standard React state management.
 * @param {string | null} userId - The ID of the user to fetch.
 */
export const useUserProfile = (userId: string | null) => {
  const [data, setData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | AxiosError | null>(null);

  useEffect(() => {
    // If there's no userId, we can't fetch anything.
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      // Create a controller to handle component unmounts during fetch
      const controller = new AbortController();

      try {
        const response = await apiClient.get<Profile>(`/profile/${userId}`, {
          signal: controller.signal,
        });
        setData(response.data);
      } catch (err) {
        // Don't set state if the error is due to an aborted request
        if (err instanceof AxiosError && err.code === 'ERR_CANCELED') {
          return;
        }
        setIsError(true);
        setError(err as Error | AxiosError);
        console.error(`Failed to fetch profile for user ${userId}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();

    // Cleanup function: This will be called if the component unmounts
    // or if the userId changes, preventing state updates on an unmounted component.
    return () => {
      // controller.abort();
    };
  }, [userId]); // Re-run the effect whenever the userId changes.

  return { data, isLoading, isError, error };
};