// src/components/hooks/activity/useAdminGrowthChart.ts
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { GrowthChartDataDto, AnalyticsPeriod } from '@/lib/types';
import { useAuth } from '@/components/contexts/AuthContext';

const useAdminGrowthChart = (period: AnalyticsPeriod) => {
  const { state } = useAuth(); // --- MODIFICATION: Get auth state
  const [data, setData] = useState<GrowthChartDataDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // --- MODIFICATION: Only fetch if authenticated AND user is an admin ---
    if (state.status !== 'authenticated' || !state.isAdmin) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<GrowthChartDataDto[]>('/activity/admin/growth-chart', {
          signal: controller.signal,
          params: { period },
        });
        setData(response.data);
      } catch (err) {
        if (err instanceof Error && err.name === 'CanceledError') {
          // Intentional abort, do nothing.
        } else {
          console.error("Failed to fetch growth chart data:", err);
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
  }, [period, state.status, state.isAdmin]); // --- MODIFICATION: Depend on auth and admin status ---

  return { data, isLoading, error };
};

export default useAdminGrowthChart;