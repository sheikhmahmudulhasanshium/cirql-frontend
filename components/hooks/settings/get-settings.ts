"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import apiClient from '@/lib/apiClient';
import { SettingsDto } from '@/lib/types';
import { useAuth } from '@/components/contexts/AuthContext';

// This is the hook that fetches settings for the currently authenticated user
export const useGetMySettings = () => {
  // --- FIX #1: Get the authentication status from the AuthContext ---
  const { user, isLoading: authIsLoading } = useAuth();

  const [settings, setSettings] = useState<SettingsDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as true to reflect initial check
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSettings = async () => {
      // Don't set loading to true until we are sure we will fetch
      setError(null);
      try {
        // This is now safe because the outer condition ensures `user` exists
        setIsLoading(true);
        const { data } = await apiClient.get<SettingsDto>('/settings/me', {
          signal: controller.signal,
        });
        setSettings(data);
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          console.log('useGetMySettings: Request was canceled.');
          return; // Don't set an error on cancellation
        }
        
        // This is the 401 error you were seeing
        console.error("useGetMySettings: Failed to fetch settings.", err);
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unknown error occurred while fetching settings.'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    // --- FIX #2: The core logic change ---
    // This condition prevents the API call unless authentication is resolved and successful.
    if (authIsLoading) {
      // If auth is still loading, we are also "loading" settings. Do nothing yet.
      setIsLoading(true);
      return;
    }

    if (user) {
      // If auth is done and we have a user, fetch the settings.
      fetchSettings();
    } else {
      // If auth is done and there is NO user, we are not loading and there are no settings.
      setIsLoading(false);
      setSettings(null);
    }

    return () => {
      // Cleanup function to abort the request if the component unmounts
      controller.abort();
    };
  }, [user, authIsLoading]); // Re-run this effect when auth state changes

  // Expose a setter for optimistic updates from the settings page
  const updateSettings = useCallback((newSettings: SettingsDto | null) => {
    setSettings(newSettings);
  }, []);

  return { settings, setSettings: updateSettings, isLoading, error };
};