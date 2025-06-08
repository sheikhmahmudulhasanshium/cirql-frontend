// components/hooks/settings/delete-settings.ts
import apiClient from '@/lib/apiClient';
import { SettingsDto } from '@/lib/types';

/**
 * An async function to reset the user's settings to default.
 * It returns the new default settings data from the API.
 */
export const resetMySettings = async (): Promise<SettingsDto> => {
  const { data } = await apiClient.delete<SettingsDto>('/settings/me');
  return data;
};