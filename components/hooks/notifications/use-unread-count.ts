'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/components/contexts/AuthContext';

export const useUnreadCount = () => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // --- ADDED: Loading state
  const { state: { status } } = useAuth();
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => {
    setTrigger(prev => prev + 1);
  }, []);
  
  useEffect(() => {
    if (status !== 'authenticated') {
      setCount(0);
      setIsLoading(false);
      return;
    }

    const fetchCount = async () => {
      setIsLoading(true); // --- ADDED: Set loading to true before fetching
      try {
        const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
        setCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch unread notification count", error);
        setCount(0); // Reset on error
      } finally {
        setIsLoading(false); // --- ADDED: Set loading to false after fetching
      }
    };

    fetchCount();
  }, [status, trigger]);

  // Return the new isLoading state
  return { count, isLoading, refetch };
};