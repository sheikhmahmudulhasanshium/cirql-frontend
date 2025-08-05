'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { PublicProfile } from '@/lib/types';

export const useFriendsList = () => {
  const [data, setData] = useState<PublicProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchFriends = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await apiClient.get<PublicProfile[]>('/social/friends/list');
      setData(response.data);
    } catch (err) {
      setIsError(true);
      console.error("Failed to fetch friends list:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return { data, isLoading, isError, refetch: fetchFriends };
};