// src/lib/types.ts
import { ReactNode } from "react";

// --- START: MODIFIED FOR V1.1.0 ---
// Core User type used throughout the app
export enum Role {
  User = 'user',
  Admin = 'admin',
  Owner = 'owner',
}

// Updated User type to include new security fields
export interface User {
  _id: string;
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  roles: Role[];
  is2FAEnabled: boolean;
  accountStatus: 'active' | 'banned';
  banReason?: string;
}

// Type for the new Admin Analytics Dashboard
export interface UserAnalyticsData {
  totalUsers: number;
  statusCounts: {
    active: number;
    banned: number;
  };
  weeklyGrowth: {
    newUsersThisWeek: number;
    newUsersLastWeek: number;
    percentage: number;
  };
  engagement: {
    recent: number;
    active: number;
    inactive: number;
  };
}
// --- END: MODIFIED FOR V1.1.0 ---


export interface NavMenu {
    icon: ReactNode,
    href: string,
    label: string
}

export interface NotificationPreferencesDto {
  emailNotifications: boolean;
  pushNotifications: boolean;
  // --- START: MODIFIED FOR V1.1.0 ---
  allowAnnouncementEmails: boolean; // For granular email control
  // --- END: MODIFIED FOR V1.1.0 ---
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

// FIX: Added the missing type definition
export interface UpdateThemeDto {
  theme: 'light' | 'dark' | 'system';
}

export enum AnnouncementType {
    UPCOMING = 'Upcoming',
    LATEST_UPDATES = 'Latest Updates',
    COMPANY_NEWS = 'Company News',
    GENERAL = 'General',
}

export interface Announcement {
    _id: string;
    id: string; // From virtual property
    title: string;
    content: string;
    type: AnnouncementType;
    visible: boolean; // Admin can see hidden ones
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

export type UpdateAnnouncementDto = Partial<CreateAnnouncementDto>;

// --- START: MODIFIED FOR V1.1.0 ---
// New types for the Notification System
export enum NotificationType {
  WELCOME = 'welcome',
  WELCOME_BACK = 'welcome_back',
  ANNOUNCEMENT = 'announcement',
  SUPPORT_REPLY = 'support_reply',
  TICKET_ADMIN_ALERT = 'ticket_admin_alert',
  ACCOUNT_STATUS_UPDATE = 'account_status_update',
  SOCIAL_FRIEND_REQUEST = 'social_friend_request',
  SOCIAL_FRIEND_ACCEPT = 'social_friend_accept',
  SOCIAL_FOLLOW = 'social_follow',
  SOCIAL = 'social',
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// New types for the Social Module
export interface PublicProfile {
    id: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
}

export interface SocialProfile {
    _id: string;
    owner: string;
    friends: PublicProfile[];
    followers: PublicProfile[];
    following: PublicProfile[];
    blockedUsers: string[]; // Just the IDs
}

export enum FriendRequestStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  DELETED = 'deleted',
}

export interface FriendRequest {
    _id: string;
    requester: PublicProfile;
    recipient: string;
    status: FriendRequestStatus;
    createdAt: string;
}

// Helper enum for UI state management of social buttons
export enum UserRelationStatus {
  SELF,
  FRIENDS,
  REQUEST_SENT,
  REQUEST_RECEIVED,
  NOT_FRIENDS,
  BLOCKED,
}
// --- END: MODIFIED FOR V1.1.0 ---

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  }
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

export interface TicketSummary {
  _id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  updatedAt: string;
  hasUnseenMessages: boolean;
  user?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  guestName?: string;
  guestEmail?: string;
}

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

export interface TicketDetails {
  _id: string;
  subject: string;
  status: TicketStatus;
  messages: TicketMessage[];
  lastSeenByUserAt: string | null;
  lastSeenByAdminAt: string | null;
}