import apiClient from '@/lib/apiClient';
import { SettingsDto, UpdateSettingDto } from '@/lib/types';

export const updateMySettings = async (updates: UpdateSettingDto): Promise<SettingsDto> => {
  // Simple, clean, and the token is added automatically.
  // Error handling is managed by the try/catch in the component.
  const { data } = await apiClient.patch<SettingsDto>('/settings/me', updates);
  return data;
};