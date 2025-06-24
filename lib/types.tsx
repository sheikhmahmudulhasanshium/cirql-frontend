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
}

export interface SecuritySettingsPreferencesDto {
  recoveryMethod: 'email' | 'phone';
}

export interface AccessibilityOptionsPreferencesDto {
  highContrastMode: boolean;
  screenReaderSupport: boolean;
  font: 'default' | 'serif' | 'mono' | 'inter';
  textSize: 'small' | 'medium' | 'large' | 'xl';
}

export interface ContentPreferencesDto {
  interests: string[];
}

export interface UiCustomizationPreferencesDto {
  layout: 'list' | 'grid';
  animationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

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
  createdAt: string;
  updatedAt: string;
}

export type UpdateSettingDto = {
  isDefault?: boolean;
  notificationPreferences?: Partial<NotificationPreferencesDto>;
  accountSettingsPreferences?: Partial<AccountSettingsPreferencesDto>;
  securitySettingsPreferences?: Partial<SecuritySettingsPreferencesDto>;
  accessibilityOptionsPreferences?: Partial<AccessibilityOptionsPreferencesDto>;
  contentPreferences?: Partial<ContentPreferencesDto>;
  uiCustomizationPreferences?: Partial<UiCustomizationPreferencesDto>;
};

export enum AnnouncementType {
    UPCOMING = 'Upcoming',
    LATEST_UPDATES = 'Latest Updates',
    COMPANY_NEWS = 'Company News',
    GENERAL = 'General',
}

export interface Announcement {
    _id: string;
    title: string;
    content: string;
    type: AnnouncementType;
    visible: boolean;
    expirationDate?: string | null;
    imageUrl?: string;
    linkUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAnnouncementDto {
    title: string;
    content: string;
    type: AnnouncementType;
    visible?: boolean;
    expirationDate?: string | null;
    imageUrl?: string;
    linkUrl?: string;
}

export interface UpdateAnnouncementDto {
    title?: string;
    content?: string;
    type?: AnnouncementType;
    visible?: boolean;
    expirationDate?: string | null;
    imageUrl?: string;
    linkUrl?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
}

export interface AnnouncementsFilterParams {
    type?: AnnouncementType;
    page?: number;
    limit?: number;
    visible?: boolean;
}

export interface ApiErrorResponse {
    statusCode: number;
    message: string | string[];
    error: string;
}

export function isApiErrorResponse(obj: unknown): obj is ApiErrorResponse {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof (obj as ApiErrorResponse).statusCode === 'number' &&
        (typeof (obj as ApiErrorResponse).message === 'string' || Array.isArray((obj as ApiErrorResponse).message)) &&
        typeof (obj as ApiErrorResponse).error === 'string'
    );
}

// src/lib/types.ts

export enum Role {
  User = 'user',
  Admin = 'admin',
  Owner = 'owner',
}

export enum TicketCategory {
  COMPLAINT = 'Complaint',
  REVIEW = 'Review',
  SUGGESTION = 'Suggestion',
  FEEDBACK = 'Feedback',
  TECHNICAL_SUPPORT = 'Technical Support',
  INVESTMENT_OFFER = 'Investment Offer',
  OTHER = 'Other',
}

export enum TicketStatus {
  OPEN = 'Open',
  PENDING_USER_REPLY = 'Pending User Reply',
  CLOSED = 'Closed',
}

// Type for the list view (both user and admin)
export interface TicketSummary {
  _id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  updatedAt: string;
  hasUnseenMessages: boolean; // For the notification dot
  // The following are for the admin list view specifically
  user?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  guestName?: string;
  guestEmail?: string;
}

// Type for individual messages within a conversation
export interface TicketMessage {
  _id: string;
  sender: {
    _id:string;
    firstName?: string;
    picture?: string;
    roles: Role[];
  };
  content: string;
  createdAt: string;
}

// Type for the detailed conversation view
export interface TicketDetails {
  _id: string;
  subject: string;
  status: TicketStatus;
  messages: TicketMessage[];
  // Timestamps to help the client calculate unseen messages
  lastSeenByUserAt: string | null;
  lastSeenByAdminAt: string | null;
}