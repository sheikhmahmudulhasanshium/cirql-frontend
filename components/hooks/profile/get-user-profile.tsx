'use client';

import { useState, useEffect, useCallback } from 'react'; // --- Import useCallback ---
import apiClient from '@/lib/apiClient';
import { Profile } from '@/lib/types';
import { AxiosError } from 'axios';

export const useUserProfile = (userId: string | null) => {
  const [data, setData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | AxiosError | null>(null);

  // --- START: ADDED REFETCH LOGIC ---
  const fetchUserProfile = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);
    const controller = new AbortController();

    try {
      const response = await apiClient.get<Profile>(`/profile/${userId}`, {
        signal: controller.signal,
      });
      setData(response.data);
    } catch (err) {
      if (err instanceof AxiosError && err.code === 'ERR_CANCELED') {
        return;
      }
      setIsError(true);
      setError(err as Error | AxiosError);
      console.error(`Failed to fetch profile for user ${userId}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);
  // --- END: ADDED REFETCH LOGIC ---

  return { data, isLoading, isError, error, refetch: fetchUserProfile };
};