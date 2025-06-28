// src/components/hooks/settings/patch-settings.ts
import apiClient from '@/lib/apiClient';
import { SettingsDto, UpdateSettingDto, UpdateThemeDto } from '@/lib/types';

export const updateMySettings = async (updates: UpdateSettingDto): Promise<SettingsDto> => {
  const { data } = await apiClient.patch<SettingsDto>('/settings/me', updates);
  return data;
};

export const updateMyTheme = async (updates: UpdateThemeDto): Promise<SettingsDto> => {
    const { data } = await apiClient.patch<SettingsDto>('/settings/theme', updates);
    return data;
};