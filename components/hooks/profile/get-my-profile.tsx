'use client';

import { useState, useEffect, useCallback } from 'react'; // --- Import useCallback ---
import apiClient from '@/lib/apiClient';
import { Profile } from '@/lib/types';
import { useAuth } from '@/components/contexts/AuthContext';
import { AxiosError } from 'axios';

export const useMyProfile = () => {
  const { state } = useAuth();
  const isAuthenticated = state.status === 'authenticated';

  const [data, setData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | AxiosError | null>(null);

  // --- START: ADDED REFETCH LOGIC ---
  const fetchMyProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await apiClient.get<Profile>('/profile/me');
      setData(response.data);
    } catch (err) {
      setIsError(true);
      setError(err as Error | AxiosError);
      console.error("Failed to fetch current user's profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);
  // --- END: ADDED REFETCH LOGIC ---

  return { data, isLoading, isError, error, refetch: fetchMyProfile };
};