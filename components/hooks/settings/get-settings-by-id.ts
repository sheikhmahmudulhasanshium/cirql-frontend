// frontend/src/components/hooks/settings/get-settings-by-id.ts

import { useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '@/lib/apiClient';
import { SettingsDto } from '@/lib/types';

export const useUserSettings = (userId: string | null | undefined) => {
  const [data, setData] = useState<SettingsDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      // No need to fetch, ensure state is clean
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await apiClient.get<SettingsDto>(
          `/settings/user/${userId}`,
          { signal: controller.signal }
        );
        setData(response.data);
      } catch (err: unknown) { // --- FIX: Catch error as `unknown` instead of `any` ---
        if (axios.isCancel(err)) {
          console.log('Request canceled');
          return;
        }
        
        // --- FIX: Type-safe error handling ---
        // Check if the error is an instance of Error to safely access .message
        if (err instanceof Error) {
          setError(err);
        } else {
          // If it's something else (e.g., `throw "string"`), create a new Error.
          setError(new Error('An unknown error occurred'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [userId]);

  return { data, isLoading, error };
};