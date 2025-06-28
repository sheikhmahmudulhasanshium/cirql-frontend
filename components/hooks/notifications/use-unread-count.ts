// src/components/hooks/notifications/use-unread-count.ts
import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/components/contexts/AuthContext';

export const useUnreadCount = () => {
  const [count, setCount] = useState(0);
  const { state: { status } } = useAuth();
  const [trigger, setTrigger] = useState(0);

  // This function allows any component to trigger a refetch
  const refetch = useCallback(() => {
    setTrigger(prev => prev + 1);
  }, []);
  
  useEffect(() => {
    // Don't fetch if the user isn't fully authenticated
    if (status !== 'authenticated') {
      setCount(0); // Ensure count is 0 when logged out
      return;
    }

    const fetchCount = async () => {
      try {
        const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
        setCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch unread notification count", error);
        setCount(0); // Reset on error
      }
    };

    fetchCount();
  }, [status, trigger]); // Reruns when auth status changes or when refetch is called

  return { count, refetch };
};