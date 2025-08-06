// src/components/hooks/social/use-recommendations.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
// --- FIX: This hook returns the full SocialProfile object ---
import { SocialProfile } from '@/lib/types';
import { AxiosError } from 'axios';

// --- FIX: The hook is correctly typed to return SocialProfile[] ---
export const useUserRecommendations = () => {
  const [data, setData] = useState<SocialProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | AxiosError | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const response = await apiClient.get<SocialProfile[]>('/social/recommendations/users');
      setData(response.data);
    } catch (err) {
      setIsError(true);
      setError(err as Error | AxiosError);
      console.error("Failed to fetch user recommendations:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { data, isLoading, isError, error, refetch: fetchRecommendations };
};