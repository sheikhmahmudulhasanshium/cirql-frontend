// components/hooks/announcements/create-announcement.ts
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { CreateAnnouncementDto, Announcement, ApiErrorResponse, isApiErrorResponse } from '@/lib/types';
import { AxiosError } from 'axios';

const useCreateAnnouncement = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiErrorResponse | null>(null);

    const createAnnouncement = async (data: CreateAnnouncementDto): Promise<Announcement | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post<Announcement>('/announcements', data);
            return response.data;
        } catch (error) { // Removed: e: any
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
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { createAnnouncement, isLoading, error };
};

export default useCreateAnnouncement;