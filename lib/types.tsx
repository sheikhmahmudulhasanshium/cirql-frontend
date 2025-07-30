import { ReactNode } from "react";

export enum Role {
  User = 'user',
  Admin = 'admin',
  Owner = 'owner',
  Tester = 'tester',
}

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

export interface UserActivitySummaryDto {
  logins: number;
  profileViews: number;
  messagesSent: number;
  screenTimeMinutes: number;
}

export interface NavMenu {
    icon: ReactNode,
    href: string,
    label: string
}

export interface NotificationPreferencesDto {
  emailNotifications: boolean;
  pushNotifications: boolean;
  allowAnnouncementEmails: boolean;
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

export interface WellbeingPreferencesDto {
  isBreakReminderEnabled: boolean;
  breakReminderIntervalMinutes: 15 | 30 | 45 | 60;
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
  wellbeingPreferences: WellbeingPreferencesDto;
  dateTimePreferences: {
    shortDateFormat: string;
    longDateFormat: string;
    timeFormat: string;
  };
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
  wellbeingPreferences?: Partial<WellbeingPreferencesDto>;
  dateTimePreferences?: {
    shortDateFormat?: string;
    longDateFormat?: string;
    timeFormat?: string;
  };
};

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
    id: string;
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

export type UpdateAnnouncementDto = Partial<CreateAnnouncementDto>;

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
    blockedUsers: string[];
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

export enum UserRelationStatus {
  SELF,
  FRIENDS,
  REQUEST_SENT,
  REQUEST_RECEIVED,
  NOT_FRIENDS,
  BLOCKED,
}

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
    picture?: string;
  };
  guestName?: string;
  guestEmail?: string;
  isLocked: boolean;
}

export interface Media {
  _id: string;
  owner: string;
  googleFileId: string;
  visibility: 'public' | 'private' | 'shared';
  thumbnailLink?: string;
  contextId?: string;
  contextModel?: 'Group' | 'Conversation' | 'Ticket';
  filename?: string; // ADDED BACK
  size?: number;     // ADDED BACK
  type?: string;     // ADDED BACK
  createdAt: string;
  updatedAt: string;
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
  attachments: Media[]; // This will now correctly use the updated Media type
  createdAt: string;
  editedAt?: string;
}
export interface TicketDetails {
  _id: string;
  subject: string;
  status: TicketStatus;
  isLocked: boolean;
  messages: TicketMessage[];
  lastSeenByUserAt: string | null;
  lastSeenByAdminAt: string | null;
}


export type AnalyticsPeriod = '1m' | '12h' | '1d' | '7d' | '30d' | '365d';

export interface WeeklyGrowthDto {
  newUsers: number;
  percentageChange: number;
}

export interface ActiveUserDto {
  userId: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  activityCount: number;
}

export interface AdminAnalyticsDto {
  totalUsers: number;
  bannedUsers: number;
  weeklyGrowth: WeeklyGrowthDto;
  mostActiveUsers: ActiveUserDto[];
}

export interface GrowthChartDataDto {
  date: string;
  count: number;
}

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  isTwoFactorAuthenticationComplete: boolean;
}