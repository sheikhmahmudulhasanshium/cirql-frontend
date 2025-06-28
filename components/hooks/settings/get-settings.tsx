// src/components/hooks/settings/get-settings.tsx
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
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const { state } = useAuth();
    const { user, status: authStatus } = state;

    const [settings, setSettings] = useState<SettingsDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSettings = useCallback(async (signal: AbortSignal) => {
        if (!user) {
            setIsLoading(false);
            setSettings(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.get<SettingsDto>('/settings/me', { signal });
            setSettings(data);
        } catch (err: unknown) {
            if (axios.isCancel(err)) return;
            
            console.error("useGetMySettings: Failed to fetch settings.", err);
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const controller = new AbortController();
        if (authStatus === 'loading') {
            setIsLoading(true);
            return;
        }
        fetchSettings(controller.signal);
        return () => controller.abort();
    }, [authStatus, fetchSettings]);

    const value = { settings, setSettings, isLoading, error };

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