import apiClient from '@/lib/apiClient';
import { Media } from '@/lib/types';

export const getMyMedia = async (): Promise<Media[]> => {
  // --- FIX: The backend returns a direct array of Media, not a paginated object ---
  const { data } = await apiClient.get<Media[]>('/media/mine');
  return data;
};
