'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { FriendRequest } from '@/lib/types'; // We can reuse FriendRequest type

// --- Hook to get pending follow requests received by the user ---
export const usePendingFollowRequests = () => {
  const [data, setData] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await apiClient.get<FriendRequest[]>('/social/follow-requests/pending');
      setData(response.data);
    } catch (err) {
      setIsError(true);
      console.error("Failed to fetch pending follow requests:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { data, isLoading, isError, refetch: fetchRequests };
};

// --- Hook to get follow requests sent by the user ---
export const useSentFollowRequests = () => {
  const [data, setData] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await apiClient.get<FriendRequest[]>('/social/follow-requests/sent');
      setData(response.data);
    } catch (err) {
      setIsError(true);
      console.error("Failed to fetch sent follow requests:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { data, isLoading, isError, refetch: fetchRequests };
};