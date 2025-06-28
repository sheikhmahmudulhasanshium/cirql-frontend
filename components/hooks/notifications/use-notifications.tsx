// src/components/hooks/notifications/use-notifications.ts
import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
// --- FIX: Removed unused 'PaginatedResponse' from the import list ---
import { Notification, NotificationType, ApiErrorResponse, isApiErrorResponse } from '@/lib/types';
import { AxiosError } from 'axios';
import axios from 'axios';

export interface NotificationFilterParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
}

const useNotifications = (filterParams: NotificationFilterParams) => {
    const [data, setData] = useState<Notification[] | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiErrorResponse | null>(null);
    const [trigger, setTrigger] = useState(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (filterParams.page) params.append('page', String(filterParams.page));
            if (filterParams.limit) params.append('limit', String(filterParams.limit));
            if (filterParams.isRead !== undefined) params.append('isRead', String(filterParams.isRead));
            if (filterParams.type) params.append('type', filterParams.type);
            
            try {
                // The inline type here is correct for this endpoint's specific response structure.
                const response = await apiClient.get<{data: Notification[], total: number, hasMore: boolean}>(`/notifications?${params.toString()}`, {
                    signal: controller.signal,
                });
                setData(response.data.data);
                setTotal(response.data.total);
                setHasMore(response.data.hasMore);
            } catch (err) {
                if (axios.isCancel(err)) return;
                const axiosError = err as AxiosError;
                if (axiosError.response && isApiErrorResponse(axiosError.response.data)) {
                    setError(axiosError.response.data);
                } else {
                    setError({ statusCode: 500, message: "An unexpected error occurred.", error: "Error" });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    // Using a stable set of dependencies prevents unnecessary re-renders.
    }, [filterParams.page, filterParams.limit, filterParams.isRead, filterParams.type, trigger]);

    return { data, total, hasMore, isLoading, error, refetch };
};

export default useNotifications;