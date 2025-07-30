import apiClient from '@/lib/apiClient';

export const deleteMediaFile = async (mediaId: string): Promise<boolean> => {
  await apiClient.delete(`/media/${mediaId}`);
  return true;
};
