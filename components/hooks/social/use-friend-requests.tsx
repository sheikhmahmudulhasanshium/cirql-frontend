'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { FriendRequest } from '@/lib/types';

// --- Hook to get pending friend requests received by the user ---
export const usePendingFriendRequests = () => {
  const [data, setData] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await apiClient.get<FriendRequest[]>('/social/friends/requests/pending');
      setData(response.data);
    } catch (err) {
      setIsError(true);
      console.error("Failed to fetch pending friend requests:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { data, isLoading, isError, refetch: fetchRequests };
};

// --- Hook to get friend requests sent by the user ---
export const useSentFriendRequests = () => {
  const [data, setData] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await apiClient.get<FriendRequest[]>('/social/friends/requests/sent');
      setData(response.data);
    } catch (err) {
      setIsError(true);
      console.error("Failed to fetch sent friend requests:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { data, isLoading, isError, refetch: fetchRequests };
};