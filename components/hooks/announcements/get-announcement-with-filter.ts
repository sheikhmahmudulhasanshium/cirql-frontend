import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Announcement, PaginatedResponse, AnnouncementsFilterParams, ApiErrorResponse, isApiErrorResponse } from '@/lib/types';
import { AxiosError } from 'axios';
import axios from 'axios';

const useAnnouncementsWithFilter = (filterParams: AnnouncementsFilterParams) => {
    const [data, setData] = useState<Announcement[] | null>(null);
    const [total, setTotal] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiErrorResponse | null>(null);
    
    // This state is used to manually trigger the fetch operation
    const [trigger, setTrigger] = useState(0);

    // The refetch function simply increments the trigger, causing the useEffect to run again.
    const refetch = () => {
        setTrigger(prev => prev + 1);
    };

    useEffect(() => {
        // Create a cancellation token source for this specific fetch operation.
        const cancelTokenSource = axios.CancelToken.source();

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (filterParams.type) {
                params.append('type', filterParams.type);
            }
            if (filterParams.page) {
                params.append('page', String(filterParams.page));
            }
            if (filterParams.limit) {
                params.append('limit', String(filterParams.limit));
            }
            // This is the key part for admin vs public
            if (filterParams.visible !== undefined) {
                params.append('visible', String(filterParams.visible));
            }

            try {
                const response = await apiClient.get<PaginatedResponse<Announcement>>(`/announcements?${params.toString()}`, {
                    cancelToken: cancelTokenSource.token, // Use the token for this request
                });
                setData(response.data.data);
                setTotal(response.data.total);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled:', error.message);
                    return; 
                }
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

        fetchData();

        // Cleanup function: This is called when the component unmounts or dependencies change.
        return () => {
            cancelTokenSource.cancel('Component unmounted or dependencies changed, cancelling request.');
        };
    // The effect depends on the filter parameters and our manual trigger
    }, [filterParams, trigger]);

    // Return the refetch function along with the other state
    return { data, total, isLoading, error, refetch };
};

export default useAnnouncementsWithFilter;