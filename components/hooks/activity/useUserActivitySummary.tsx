// src/components/hooks/activity/use-user-activity-summary.ts
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { UserActivitySummaryDto } from '@/lib/types';
import { useAuth } from '@/components/contexts/AuthContext';

const useUserActivitySummary = () => {
  const { state } = useAuth(); // --- MODIFICATION: Get auth state
  const [summary, setSummary] = useState<UserActivitySummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // --- MODIFICATION: Only fetch if authenticated ---
    if (state.status !== 'authenticated') {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<UserActivitySummaryDto>('/activity/me', {
          signal: controller.signal,
        });
        setSummary(response.data);
      } catch (err) {
        if (err instanceof Error && err.name === 'CanceledError') {
          // Intentional abort, do nothing.
        } else {
          console.error("Failed to fetch user activity summary:", err);
          setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [state.status]); // --- MODIFICATION: Depend on auth status ---

  return { summary, isLoading, error };
};

export default useUserActivitySummary;