// components/hooks/announcements/get-announcements-with-filter.ts
import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { Announcement, PaginatedResponse, AnnouncementsFilterParams, ApiErrorResponse, isApiErrorResponse } from '@/lib/types';
import { AxiosError, Canceler } from 'axios';
// Import the axios object itself
import axios from 'axios';

const useAnnouncementsWithFilter = (filterParams: AnnouncementsFilterParams) => {
    const [data, setData] = useState<Announcement[] | null>(null);
    const [total, setTotal] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiErrorResponse | null>(null);
    const [cancelRequest, setCancelRequest] = useState<Canceler | null>(null); //  add axios cancel

    // Use useCallback to memoize fetchData
    const fetchData = useCallback(async () => {
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
        if (filterParams.visible !== undefined) {
            params.append('visible', String(filterParams.visible));
        }
        // axios cancel token
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        setCancelRequest(() => source.cancel);
        try {
            const response = await apiClient.get<PaginatedResponse<Announcement>>(`/announcements?${params.toString()}`, {
                cancelToken: source.token, // Pass the cancel token
            });
            setData(response.data.data);
            setTotal(response.data.total);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
                return; // Important: Exit the function if it's a cancellation
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
                    message: (error as Error).message || "An unexpected error occurred.", //error as Error
                    error: "Internal Server Error",
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, [filterParams]); // Only dependent on filterParams

    useEffect(() => {
        fetchData();
        // Cleanup function to cancel the request if the component unmounts or filterParams change
        return () => {
            if (cancelRequest) {
                cancelRequest('Request canceled due to component unmount or filter change');
            }
        };
    }, [filterParams, cancelRequest, fetchData]); //  Added fetchData and cancelRequest to dependencies

    return { data, total, isLoading, error };
};

export default useAnnouncementsWithFilter;