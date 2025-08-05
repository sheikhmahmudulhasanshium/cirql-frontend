'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/components/contexts/AuthContext';
import { PublicProfile } from '@/lib/types';

export const useFollowersList = () => {
  const { state } = useAuth();
  const { user } = state;
  const [data, setData] = useState<PublicProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchFollowers = useCallback(async () => {
    if (!user) return; // Don't fetch if there's no user

    setIsLoading(true);
    setIsError(false);
    try {
      // This endpoint requires the user's ID
      const response = await apiClient.get(`/social/users/${user._id}/followers`);
      // The response data is a SocialProfile object, so we extract the 'followers' array
      setData(response.data.followers || []);
    } catch (err) {
      setIsError(true);
      console.error("Failed to fetch followers list:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  return { data, isLoading, isError, refetch: fetchFollowers };
};