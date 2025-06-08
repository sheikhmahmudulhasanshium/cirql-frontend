import { ReactNode } from "react";

export interface NavMenu{
    icon:ReactNode,
    href:string,
    label:string
}

// lib/types.ts

// --- Sub-document DTOs ---
export interface NotificationPreferencesDto {
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface AccountSettingsPreferencesDto {
  isPrivate: boolean;
  theme: string;
}

export interface SecuritySettingsPreferencesDto {
  enable2FA: boolean;
  recoveryMethod: string;
}

export interface AccessibilityOptionsPreferencesDto {
  highContrastMode: boolean;
  screenReaderSupport: boolean;
}

export interface ContentPreferencesDto {
  theme: string;
  interests: string[];
}

export interface UiCustomizationPreferencesDto {
  layout: string;
  animationsEnabled: boolean;
}

// --- Main DTOs ---

// This is the full Settings object returned by the API
export interface SettingsDto {
  _id: string;
  userId: string;
  isDefault: boolean;
  notificationPreferences: NotificationPreferencesDto;
  accountSettingsPreferences: AccountSettingsPreferencesDto;
  securitySettingsPreferences: SecuritySettingsPreferencesDto;
  accessibilityOptionsPreferences: AccessibilityOptionsPreferencesDto;
  contentPreferences: ContentPreferencesDto;
  uiCustomizationPreferences: UiCustomizationPreferencesDto;
  createdAt?: string;
  updatedAt?: string;
}

// This is the type for the PATCH request body for updates.
// It's a partial object of the main DTO, without the read-only fields.
export type UpdateSettingDto = Partial<Omit<SettingsDto, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>;