// components/hooks/settings/get-settings.ts
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { SettingsDto } from '@/lib/types';

export const useGetMySettings = () => {
  const [settings, setSettings] = useState<SettingsDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // FIX: Use the correct localStorage key 'authToken' to match apiClient.ts
    const isAuthenticated = !!localStorage.getItem('authToken');
    if (!isAuthenticated) {
      setIsLoading(false);
      // Set an explicit error message for clarity when debugging
      setError(new Error("User is not authenticated."));
      return;
    }

    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get<SettingsDto>('/settings/me');
        setSettings(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err : new Error('An unknown error occurred while fetching settings.');
        setError(errorMessage);
        setSettings(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, setSettings, isLoading, error };
};