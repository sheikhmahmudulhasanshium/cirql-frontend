'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Profile } from '@/lib/types';
import { useAuth } from '@/components/contexts/AuthContext';
import { AxiosError } from 'axios';

/**
 * A custom hook to get the current user's profile data using standard
 * React state management.
 * The fetch is only triggered if the user is authenticated.
 */
export const useMyProfile = () => {
  const { state } = useAuth();
  const isAuthenticated = state.status === 'authenticated';

  const [data, setData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | AxiosError | null>(null);

  useEffect(() => {
    // Do not fetch if the user is not authenticated.
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchMyProfile = async () => {
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
    };

    fetchMyProfile();
  }, [isAuthenticated]); // Re-run the effect if the authentication status changes.

  return { data, isLoading, isError, error };
};