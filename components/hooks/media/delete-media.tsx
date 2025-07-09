// src/components/hooks/media/delete-media.ts
import apiClient from '@/lib/apiClient';

export const deleteMediaFile = async (mediaId: string): Promise<boolean> => {
  // --- FIX: The path now matches the simplified backend route ---
  await apiClient.delete(`/media/${mediaId}`);
  return true;
};