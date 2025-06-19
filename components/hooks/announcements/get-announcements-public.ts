// components/hooks/announcements/get-announcements-public.ts
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Announcement, ApiErrorResponse, isApiErrorResponse } from '@/lib/types';
import { AxiosError } from 'axios';

const useAnnouncementsPublic = () => {
    const [data, setData] = useState<Announcement[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiErrorResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await apiClient.get<Announcement[]>('/announcements/simple/public');
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
                        message: (error as Error).message || "An unexpected error occurred.",//error as Error
                        error: "Internal Server Error",
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, isLoading, error };
};

export default useAnnouncementsPublic;