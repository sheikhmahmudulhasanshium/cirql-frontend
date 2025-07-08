// src/components/hooks/activity/use-my-activity-chart.ts
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { GrowthChartDataDto, AnalyticsPeriod } from '@/lib/types';
import { useAuth } from '@/components/contexts/AuthContext';

const useMyActivityChart = (period: AnalyticsPeriod) => {
  const { state } = useAuth(); // --- MODIFICATION: Get auth state
  const [data, setData] = useState<GrowthChartDataDto[]>([]);
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
        const response = await apiClient.get<GrowthChartDataDto[]>('/activity/me/chart', {
          signal: controller.signal,
          params: { period },
        });
        setData(response.data);
      } catch (err) {
        if (err instanceof Error && err.name === 'CanceledError') {
          // Intentional abort, do nothing.
        } else {
          console.error("Failed to fetch my activity chart data:", err);
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
  }, [period, state.status]); // --- MODIFICATION: Depend on auth status ---

  return { data, isLoading, error };
};

export default useMyActivityChart;