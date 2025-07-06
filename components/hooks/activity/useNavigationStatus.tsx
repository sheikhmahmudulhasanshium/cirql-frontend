'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/components/contexts/AuthContext';

// Define the types for the data we expect from the backend
interface MostVisitedPage {
  url: string;
  count: number;
}

export interface NavigationStats {
  lastVisitedUrl: string | null;
  mostVisitedPages: MostVisitedPage[];
}

export const useNavigationStats = () => {
  const { state } = useAuth();
  const isAuthenticated = state.status === 'authenticated';

  const [stats, setStats] = useState<NavigationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only fetch if the user is authenticated
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    
    setIsLoading(true);
    setError(null);

    apiClient.get<NavigationStats>('/activity/me/navigation-stats', { signal: controller.signal })
      .then(response => {
        setStats(response.data);
      })
      .catch(err => {
        if (err.name !== 'CanceledError') {
          console.error("Failed to fetch navigation stats:", err);
          setError(err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [isAuthenticated]); // Re-fetch if auth status changes

  return { stats, isLoading, error };
};