// components/hooks/announcements/update-announcement-by-id.ts
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { UpdateAnnouncementDto, Announcement, ApiErrorResponse, isApiErrorResponse } from '@/lib/types';
import { AxiosError } from 'axios';

const useUpdateAnnouncementById = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiErrorResponse | null>(null);

    const updateAnnouncement = async (id: string, data: UpdateAnnouncementDto): Promise<Announcement | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.patch<Announcement>(`/announcements/${id}`, data);
            return response.data;
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
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { updateAnnouncement, isLoading, error };
};

export default useUpdateAnnouncementById;