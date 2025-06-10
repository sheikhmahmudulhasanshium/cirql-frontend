import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { SettingsDto } from '@/lib/types';
import { useAuth } from '@/components/contexts/AuthContext'; // --- FIX: Import useAuth

export const useGetMySettings = () => {
  const { user, isLoading: authIsLoading } = useAuth(); // --- FIX: Use the auth context
  const [settings, setSettings] = useState<SettingsDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as true
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // --- FIX: This effect now reacts to changes in authentication status ---

    // 1. If the auth context is still loading, we do nothing and wait.
    if (authIsLoading) {
      setIsLoading(true);
      return;
    }

    // 2. If auth is done loading and there's no user, they are not authenticated.
    if (!user) {
      setIsLoading(false);
      setError(new Error("User is not authenticated."));
      setSettings(null); // Clear any old settings
      return;
    }

    // 3. If we get here, auth is done and we have a user. Proceed to fetch.
    const fetchSettings = async () => {
      setIsLoading(true); // Set loading specific to this fetch
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

  }, [user, authIsLoading]); // --- FIX: Depend on user and authIsLoading ---

  return { settings, setSettings, isLoading, error };
};