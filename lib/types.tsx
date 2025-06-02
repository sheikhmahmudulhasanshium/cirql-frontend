import { ReactNode } from "react";

export interface NavMenu{
    icon:ReactNode,
    href:string,
    label:string
}

//@/lib/types.tsx
export interface UserPreferencesData {
  _id: string;
  userId: string;
  resourceType: "userPreferences";
  resourceId: "general";
  notification_preferences: {
    email_digests_enabled: boolean;
    push_mentions_enabled: boolean;
    push_loop_activity_enabled: boolean;
    snooze_duration_minutes: string;
  };
  well_being: {
    daily_usage_limit_enabled: boolean;
    daily_usage_limit_minutes: string;
  };
  privacy_controls: {
    profile_visibility: string;
    message_permissions: string;
  };
  account_settings: {
    show_active_status_enabled: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Payload for updating user preferences (matches backend UpdateSettingDto for userPrefs)
export type UpdateUserPreferencesPayload = Partial<{
  notification_preferences: Partial<UserPreferencesData['notification_preferences']>;
  well_being: Partial<UserPreferencesData['well_being']>;
  privacy_controls: Partial<UserPreferencesData['privacy_controls']>;
  account_settings: Partial<UserPreferencesData['account_settings']>;
}>;

// Your flat frontend state structure (used in Body.tsx)
export type UserSettingsFlatState = {
  notification_preferences: {
    email_digests_enabled: boolean;
    push_mentions_enabled: boolean;
    push_loop_activity_enabled: boolean;
    snooze_duration_minutes: string;
  };
  well_being: {
    daily_usage_limit_enabled: boolean;
    daily_usage_limit_minutes: string;
  };
  privacy_controls: {
    profile_visibility: string;
    message_permissions: string;
  };
  account_settings: {
    show_active_status_enabled: boolean;
  };
};