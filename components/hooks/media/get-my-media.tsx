// src/components/hooks/media/get-my-media.ts
import apiClient from '@/lib/apiClient';
import { Media, PaginatedResponse } from '@/lib/types';

export const getMyMedia = async (page = 1, limit = 30): Promise<PaginatedResponse<Media>> => {
  // --- FIX: The path now matches the simplified backend route ---
  const { data } = await apiClient.get<PaginatedResponse<Media>>('/media/my-uploads', {
    params: { page, limit },
  });
  return data;
};