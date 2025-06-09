import { ReactNode } from "react";

export interface NavMenu{
    icon:ReactNode,
    href:string,
    label:string
}
// frontend/src/lib/types.ts

// These types should mirror the DTOs from your NestJS backend.

export interface NotificationPreferencesDto {
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface AccountSettingsPreferencesDto {
  isPrivate: boolean;
  // The 'theme' property was correctly moved out of here.
}

export interface SecuritySettingsPreferencesDto {
  enable2FA: boolean;
  recoveryMethod: 'email' | 'phone';
}

export interface AccessibilityOptionsPreferencesDto {
  highContrastMode: boolean;
  screenReaderSupport: boolean;
}

export interface ContentPreferencesDto {
  interests: string[];
}

export interface UiCustomizationPreferencesDto {
  layout: 'list' | 'grid';
  animationsEnabled: boolean;
  // --- FIX START: Add the missing 'theme' property ---
  theme: 'light' | 'dark' | 'system';
  // --- FIX END ---
}

// This is the main DTO for the entire settings object returned by the API
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
  createdAt: string; // or Date
  updatedAt: string; // or Date
}

// This type is used for PATCH requests to update settings.
// It makes all nested properties optional.
export type UpdateSettingDto = {
  isDefault?: boolean;
  notificationPreferences?: Partial<NotificationPreferencesDto>;
  accountSettingsPreferences?: Partial<AccountSettingsPreferencesDto>;
  securitySettingsPreferences?: Partial<SecuritySettingsPreferencesDto>;
  accessibilityOptionsPreferences?: Partial<AccessibilityOptionsPreferencesDto>;
  contentPreferences?: Partial<ContentPreferencesDto>;
  uiCustomizationPreferences?: Partial<UiCustomizationPreferencesDto>;
};