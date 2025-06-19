// components/hooks/announcements/delete-announcement-by-id.ts
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { ApiErrorResponse, isApiErrorResponse } from '@/lib/types';
import { AxiosError } from 'axios';

const useDeleteAnnouncementById = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiErrorResponse | null>(null);

    const deleteAnnouncement = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            await apiClient.delete(`/announcements/${id}`);
            return true;
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
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteAnnouncement, isLoading, error };
};

export default useDeleteAnnouncementById;