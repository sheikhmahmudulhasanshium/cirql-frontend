// components/hooks/announcements/get-announcements.ts
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Announcement, ApiErrorResponse, isApiErrorResponse } from '@/lib/types';
import { AxiosError } from 'axios';

const useAnnouncements = () => {
    const [data, setData] = useState<Announcement[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiErrorResponse | null>(null);
    const [triggerRefetch, setTriggerRefetch] = useState(false); // Add a state to trigger refetch

    const fetchData = async () => { //fetchData inside hook
        setIsLoading(true);
        setError(null); // Clear previous errors
        try {
            const response = await apiClient.get<Announcement[]>('/announcements/simple');
            setData(response.data);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    const errorResponse = error.response.data;
                    if (isApiErrorResponse(errorResponse)) {
                        setError(errorResponse);
                    } else {
                        setError({
                            statusCode: error.response.status,
                            message: "An unexpected error occurred.",
                            error: error.response.statusText,
                        });
                    }
                } else {
                    setError({
                        statusCode: 500,
                        message: "Network error occurred.",
                        error: "Network Error",
                    });
                }
            } else {
                setError({
                    statusCode: 500,
                    message: (error as Error).message || "An unexpected error occurred.",
                    error: "Internal Server Error",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Call fetchData when the component mounts or triggerRefetch changes
    }, [triggerRefetch]); // Empty dependency array means this effect runs once on mount

    const refetch = () => { // refetch function
        setTriggerRefetch(prev => !prev);
    };

    return { data, isLoading, error, refetch }; // refetch function
};

export default useAnnouncements;