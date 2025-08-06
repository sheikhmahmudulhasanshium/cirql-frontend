"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import apiClient from '@/lib/apiClient';
import { SettingsDto } from '@/lib/types';
import { useAuth } from '@/components/contexts/AuthContext';

interface SettingsContextType {
  settings: SettingsDto | null;
  isLoading: boolean;
  error: Error | null;
  setSettings: Dispatch<SetStateAction<SettingsDto | null>>;
  // --- START: FIX ---
  // 1. Add the refetch function to the context type definition.
  refetch: () => Promise<void>;
  // --- END: FIX ---
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const { state } = useAuth();
    const { user, status: authStatus } = state;

    const [settings, setSettings] = useState<SettingsDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // --- FIX: The function no longer needs a signal parameter to be easily callable ---
    const fetchSettings = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            setSettings(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.get<SettingsDto>('/settings/me');
            setSettings(data);
        } catch (err: unknown) {
            // This check is important because a component unmounting can trigger an abort error
            if (axios.isCancel(err)) return;
            
            console.error("useGetMySettings: Failed to fetch settings.", err);
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (authStatus === 'loading') {
            setIsLoading(true);
            return;
        }
        fetchSettings();
    }, [authStatus, fetchSettings]);

    // --- START: FIX ---
    // 3. Add the `refetch` function (which is `fetchSettings`) to the context value.
    const value = { settings, setSettings, isLoading, error, refetch: fetchSettings };
    // --- END: FIX ---

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useGetMySettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useGetMySettings must be used within a SettingsProvider');
    }
    return context;
};