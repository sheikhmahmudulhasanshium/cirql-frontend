// src/components/hooks/users/get-user-analytics-by-user.ts
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { UserAnalyticsData, ApiErrorResponse, isApiErrorResponse } from '@/lib/types';
import { AxiosError } from 'axios';
// FIX: Corrected import path
import { useAuth } from '@/components/contexts/AuthContext';

const useUserAnalytics = () => {
    const { state } = useAuth();
    const [data, setData] = useState<UserAnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiErrorResponse | null>(null);

    useEffect(() => {
        // Only fetch if the user is authenticated and is an admin
        if (state.status !== 'authenticated' || !state.isAdmin) {
            setIsLoading(false);
            return;
        }

        const fetchAnalytics = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.get<UserAnalyticsData>('/users/analytics');
                setData(response.data);
            } catch (err) {
                const error = err as AxiosError;
                if (error.response && isApiErrorResponse(error.response.data)) {
                    setError(error.response.data);
                } else {
                    setError({
                        statusCode: 500,
                        message: "An unexpected error occurred while fetching analytics.",
                        error: "Error"
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [state.status, state.isAdmin]);

    return { data, isLoading, error };
};

export default useUserAnalytics;