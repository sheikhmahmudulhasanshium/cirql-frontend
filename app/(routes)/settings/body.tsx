// app/(routes)/settings/body.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

// Shadcn UI Imports
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Lucide Icons
import {
    Palette, BellRing, Mail, AtSign, MessageCircle, ShieldCheck, Eye,
    MessagesSquare, UserCog, HeartHandshake, Hourglass, TimerOff, CircleDot,
    LogOut, AlertTriangle, Undo, UserX, Download as DownloadIcon, 
    History as HistoryIcon, LogIn // Added LogIn
} from 'lucide-react';

// Auth Context
import { useAuth } from '@/components/contexts/AuthContext';

// API Utility functions and types
import { UpdateUserPreferencesPayload, UserPreferencesData, UserSettingsFlatState } from '@/lib/types';
import { fetchUserPreferencesApi } from '@/components/hooks/settings/fetchUserPreferences';
import { updateUserPreferencesApi } from '@/components/hooks/settings/updateUserPeferences';

// --- START: DEFINITIONS OUTSIDE THE COMPONENT ---
const defaultFlatSettings: UserSettingsFlatState = {
  notification_preferences: { email_digests_enabled: true, push_mentions_enabled: true, push_loop_activity_enabled: false, snooze_duration_minutes: "never" },
  well_being: { daily_usage_limit_enabled: false, daily_usage_limit_minutes: "60" },
  privacy_controls: { profile_visibility: "public", message_permissions: "anyone" },
  account_settings: { show_active_status_enabled: true }
};

const snoozeOptions: Array<{ value: string; label: string }> = [
    { value: "never", label: "Don't Snooze (Receive Immediately)" },
    { value: "30", label: "Snooze for 30 minutes" },
    { value: "60", label: "Snooze for 1 hour" },
    { value: "120", label: "Snooze for 2 hours" },
];

const usageLimitOptions: Array<{ value: string; label: string }> = [
    { value: "30", label: "30 minutes per day" },
    { value: "60", label: "1 hour per day" },
    { value: "90", label: "1.5 hours per day" },
    { value: "120", label: "2 hours per day" },
    { value: "180", label: "3 hours per day" },
];

// FIX 1: Replaced 'any[]' with 'unknown[]' and 'any' with 'unknown' in the generic constraint for T
function debounce<T extends (...args: unknown[]) => unknown>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
// --- END: DEFINITIONS OUTSIDE THE COMPONENT ---

export default function Body() {
    const { user, isLoading: authIsLoading, logout } = useAuth();
    const router = useRouter(); // Initialize router

    const [emailDigests, setEmailDigests] = useState(defaultFlatSettings.notification_preferences.email_digests_enabled);
    const [pushMentions, setPushMentions] = useState(defaultFlatSettings.notification_preferences.push_mentions_enabled);
    const [newLoopActivity, setNewLoopActivity] = useState(defaultFlatSettings.notification_preferences.push_loop_activity_enabled);
    const [snoozeDuration, setSnoozeDuration] = useState(defaultFlatSettings.notification_preferences.snooze_duration_minutes);
    const [enableUsageLimit, setEnableUsageLimit] = useState(defaultFlatSettings.well_being.daily_usage_limit_enabled);
    const [dailyLimitMinutes, setDailyLimitMinutes] = useState(defaultFlatSettings.well_being.daily_usage_limit_minutes);
    const [profileVisibility, setProfileVisibility] = useState(defaultFlatSettings.privacy_controls.profile_visibility);
    const [messagePermissions, setMessagePermissions] = useState(defaultFlatSettings.privacy_controls.message_permissions);
    const [showActiveStatus, setShowActiveStatus] = useState(defaultFlatSettings.account_settings.show_active_status_enabled);

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const populateStatesFromFetchedData = useCallback((
        dataToParse?: UserPreferencesData | UserSettingsFlatState
    ) => {
        const baseSettings = dataToParse || defaultFlatSettings;
        const np = baseSettings.notification_preferences || defaultFlatSettings.notification_preferences;
        setEmailDigests(np.email_digests_enabled);
        setPushMentions(np.push_mentions_enabled);
        setNewLoopActivity(np.push_loop_activity_enabled);
        setSnoozeDuration(np.snooze_duration_minutes);

        const wb = baseSettings.well_being || defaultFlatSettings.well_being;
        setEnableUsageLimit(wb.daily_usage_limit_enabled);
        setDailyLimitMinutes(wb.daily_usage_limit_minutes);

        const pc = baseSettings.privacy_controls || defaultFlatSettings.privacy_controls;
        setProfileVisibility(pc.profile_visibility);
        setMessagePermissions(pc.message_permissions);

        const as = baseSettings.account_settings || defaultFlatSettings.account_settings;
        setShowActiveStatus(as.show_active_status_enabled);
    }, []);


    useEffect(() => {
        if (authIsLoading) {
            setIsLoadingData(true); // Keep loading if auth is still resolving
            return;
        }
        // If auth is done, and user exists, fetch their preferences
        if (user && typeof user._id === 'string') {
            setIsLoadingData(true); // Set loading for data fetch
            setError(null);
            fetchUserPreferencesApi(user._id)
                .then(populateStatesFromFetchedData)
                .catch((err) => {
                    console.error("Failed to fetch user preferences:", err);
                    setError((err as Error).message || "Failed to load settings.");
                    populateStatesFromFetchedData(defaultFlatSettings); // Fallback to defaults on error
                })
                .finally(() => setIsLoadingData(false)); // Done fetching data
        } else {
            // If auth is done, and no user, use defaults and stop loading data
            populateStatesFromFetchedData(defaultFlatSettings);
            setIsLoadingData(false);
        }
    }, [user, authIsLoading, populateStatesFromFetchedData]);

    const getCurrentSettingsPayload = (): UpdateUserPreferencesPayload => ({
        notification_preferences: { email_digests_enabled: emailDigests, push_mentions_enabled: pushMentions, push_loop_activity_enabled: newLoopActivity, snooze_duration_minutes: snoozeDuration },
        well_being: { daily_usage_limit_enabled: enableUsageLimit, daily_usage_limit_minutes: dailyLimitMinutes },
        privacy_controls: { profile_visibility: profileVisibility, message_permissions: messagePermissions },
        account_settings: { show_active_status_enabled: showActiveStatus },
    });

    const debouncedSaveSettings = useRef(
        debounce(async () => {
            if (isSaving || !user?._id) return;
            setIsSaving(true);
            setError(null);
            const payload = getCurrentSettingsPayload();
            try {
                const updatedSettings = await updateUserPreferencesApi(payload);
                populateStatesFromFetchedData(updatedSettings);
            // FIX 2: Changed 'err: any' to 'err: unknown' and added type checking
            } catch (err: unknown) {
                console.error("Failed to save settings:", err);
                if (err instanceof Error) {
                    setError(err.message);
                } else if (typeof err === 'string') {
                    setError(err);
                } else {
                    setError("An unknown error occurred while saving settings");
                }
            } finally {
                setIsSaving(false);
            }
        }, 1500)
    ).current;

    const handleSettingChange = <
        K extends keyof UserSettingsFlatState,
        SubK extends keyof UserSettingsFlatState[K]
    >(
        category: K,
        settingKey: SubK,
        value: UserSettingsFlatState[K][SubK]
    ) => {
        if (category === "notification_preferences") {
            if (settingKey === "email_digests_enabled") setEmailDigests(value as boolean);
            else if (settingKey === "push_mentions_enabled") setPushMentions(value as boolean);
            else if (settingKey === "push_loop_activity_enabled") setNewLoopActivity(value as boolean);
            else if (settingKey === "snooze_duration_minutes") setSnoozeDuration(value as string);
        } else if (category === "well_being") {
            if (settingKey === "daily_usage_limit_enabled") setEnableUsageLimit(value as boolean);
            else if (settingKey === "daily_usage_limit_minutes") setDailyLimitMinutes(value as string);
        } else if (category === "privacy_controls") {
            if (settingKey === "profile_visibility") setProfileVisibility(value as string);
            else if (settingKey === "message_permissions") setMessagePermissions(value as string);
        } else if (category === "account_settings") {
            if (settingKey === "show_active_status_enabled") setShowActiveStatus(value as boolean);
        }
        debouncedSaveSettings();
    };

    const handleResetToDefaults = () => {
        if (!user) { // Should not happen if button is only shown for logged-in users
            alert("You must be signed in to reset preferences.");
            return;
        }
        if (window.confirm("Are you sure you want to reset all your preferences to their default values? This action will be saved immediately.")) {
            populateStatesFromFetchedData(defaultFlatSettings);
            if (!user?._id) return;
            setIsSaving(true);
            setError(null);
             const payload: UpdateUserPreferencesPayload = {
                notification_preferences: defaultFlatSettings.notification_preferences,
                well_being: defaultFlatSettings.well_being,
                privacy_controls: defaultFlatSettings.privacy_controls,
                account_settings: defaultFlatSettings.account_settings,
            };
            updateUserPreferencesApi(payload)
                .then(updatedSettings => {
                    populateStatesFromFetchedData(updatedSettings);
                })
                .catch(err => {
                    console.error("Failed to reset settings to default:", err);
                    setError((err as Error).message || "Failed to reset settings.");
                })
                .finally(() => setIsSaving(false));
        }
    };
    
    const handleDeactivateAccount = () => { /* ... */ 
        if (window.confirm("Are you sure you want to deactivate your account? You can reactivate it later by signing in. This action is not yet implemented.")) {
            console.warn("Deactivate account requested. TODO: Implement confirmation modal and API call.");
            alert("Deactivate Account feature is not yet implemented.");
        }
    };
    const handleDownloadData = () => { /* ... */ 
        if (window.confirm("Are you sure you want to request a download of your data? This process may take some time. This action is not yet implemented.")) {
            console.warn("Download data requested. TODO: Implement API call and data packaging.");
            alert("Download My Data feature is not yet implemented.");
        }
    };
    const handleDeleteActivityHistory = () => { /* ... */ 
        if (window.confirm("Are you sure you want to delete all your activity history? This action is irreversible and does not delete your account. This action is not yet implemented.")) {
            console.warn("Delete activity history requested. TODO: Implement confirmation modal and API call.");
            alert("Delete Activity History feature is not yet implemented.");
        }
    };
    const handleDeleteAccount = () => { /* ... */ 
        if (window.confirm("DANGER: Are you absolutely sure you want to permanently delete your account and all associated data? This action is irreversible. This action is not yet implemented.")) {
            console.warn("Account deletion requested. TODO: Implement confirmation modal and API call.");
            alert("Delete My Account feature is not yet implemented.");
        }
    };


    if (authIsLoading) { 
        return (
            <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-muted-foreground">Loading session...</p>
            </div>
        );
    }
    
    // General Settings (Mode Toggle) - Always visible
    const GeneralSettingsSection = (
        <section className="space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center">
                <Palette className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" /> General
            </h2>
            <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex-1">
                        <h3 className="text-md font-medium">Appearance</h3>
                        <p className="text-sm text-muted-foreground">Customize the look and feel.</p>
                    </div>
                    <ModeToggle />
                </div>
            </div>
        </section>
    );

    if (!user) { 
        return (
            <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 space-y-10 min-w-0">
                 <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg shadow-sm dark:border-slate-700 min-h-[200px]">
                    <h1 className="text-2xl font-semibold mb-3">Access Your Settings</h1>
                    <p className="text-muted-foreground mb-6">Please sign in to manage your account preferences and personal data.</p>
                    <Button onClick={() => router.push('/sign-in')}>
                        <LogIn className="mr-2 h-4 w-4" /> Sign In
                    </Button>
                </div>
                <Separator className="dark:bg-slate-700"/>
                {GeneralSettingsSection}
            </div>
        );
    }
    
    // If user exists, but data is still loading (should be brief after authIsLoading is false)
    if (isLoadingData) {
        return (
            <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-muted-foreground">Loading your preferences...</p>
            </div>
        );
    }

    if (error && !isLoadingData) { // Error fetching user data
         return (
            <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
                <p className="text-destructive mb-4">Error: {error}</p>
                 <Button onClick={() => {
                    if (user._id) {
                        setIsLoadingData(true);
                        setError(null);
                        fetchUserPreferencesApi(user._id)
                            .then(populateStatesFromFetchedData)
                            .catch(err => setError((err as Error).message || "Failed to reload settings"))
                            .finally(() => setIsLoadingData(false));
                    }
                 }}>Try Again</Button>
            </div>
        );
    }


    // --- Authenticated User View ---
    return (
        <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 space-y-10 min-w-0">
            {/* User Display Header */}
            <div className="flex items-center space-x-4 mb-6 p-4 border-b dark:border-slate-700">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                    <AvatarImage src={user.picture || ''} alt={`@${user.firstName || user.email || 'User'}`} />
                    <AvatarFallback>
                        {user.firstName ? user.firstName.substring(0, 2).toUpperCase() : user.email ? user.email.substring(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {user.firstName || user.email || "User Settings"}
                    </h1>
                    <p className="text-muted-foreground text-sm">Manage your account and preferences for CiRQL.</p>
                </div>
            </div>

            {/* Reset to Defaults Button */}
            <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className='flex-1'>
                    <h3 className="text-md font-medium">Reset Preferences</h3>
                    <p className="text-sm text-muted-foreground">Revert all notification, well-being, privacy, and account appearance settings to their original defaults.</p>
                </div>
                <Button variant="outline" onClick={handleResetToDefaults} className="sm:ml-4 self-end sm:self-center mt-2 sm:mt-0">
                    <Undo className="mr-2 h-4 w-4" /> Reset to Defaults
                </Button>
            </div>
            <Separator className="dark:bg-slate-700"/>

            {GeneralSettingsSection} {/* General settings also shown for logged-in users */}
            <Separator className="dark:bg-slate-700"/>

            {/* Notification Preferences */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center">
                    <BellRing className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    Notifications {isSaving && <span className="ml-2 text-xs text-muted-foreground animate-pulse">(Saving...)</span>}
                </h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="email-digests" className="flex-1 cursor-pointer">
                            <div className="flex items-center mb-1"><Mail className="mr-2 h-4 w-4 text-muted-foreground shrink-0" /><span className="font-medium">Email Digests</span></div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">Receive periodic summaries of activity.</span>
                        </Label>
                        <Switch id="email-digests" checked={emailDigests} onCheckedChange={(checked) => handleSettingChange("notification_preferences", "email_digests_enabled", checked)} className="sm:ml-4 self-end sm:self-center"/>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                         <Label htmlFor="push-mentions" className="flex-1 cursor-pointer">
                            <div className="flex items-center mb-1"><AtSign className="mr-2 h-4 w-4 text-muted-foreground shrink-0" /><span className="font-medium">Push: Mentions</span></div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">Get notified when someone mentions you.</span>
                        </Label>
                        <Switch id="push-mentions" checked={pushMentions} onCheckedChange={(checked) => handleSettingChange("notification_preferences", "push_mentions_enabled", checked)} className="sm:ml-4 self-end sm:self-center"/>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                         <Label htmlFor="loop-activity" className="flex-1 cursor-pointer">
                            <div className="flex items-center mb-1"><MessageCircle className="mr-2 h-4 w-4 text-muted-foreground shrink-0" /><span className="font-medium">Push: Loop Activity</span></div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">Alerts for new messages in your loops.</span>
                        </Label>
                        <Switch id="loop-activity" checked={newLoopActivity} onCheckedChange={(checked) => handleSettingChange("notification_preferences", "push_loop_activity_enabled", checked)} className="sm:ml-4 self-end sm:self-center"/>
                    </div>
                    <Separator className="dark:bg-slate-700"/>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="snooze-duration" className="flex-1">
                            <div className="flex items-center mb-1"><TimerOff className="mr-2 h-4 w-4 text-muted-foreground shrink-0" /><span className="font-medium">Snooze Notifications</span></div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">Temporarily pause notifications.</span>
                        </Label>
                        <Select value={snoozeDuration} onValueChange={(value) => handleSettingChange("notification_preferences", "snooze_duration_minutes", value)}>
                            <SelectTrigger id="snooze-duration" className="w-full mt-1 sm:mt-0 sm:w-[240px] sm:ml-4"><SelectValue placeholder="Select snooze" /></SelectTrigger>
                            <SelectContent>{snoozeOptions.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent>
                        </Select>
                    </div>
                </div>
            </section>
            <Separator className="dark:bg-slate-700"/>

            {/* Well-being */}
             <section className="space-y-6">
                 <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center">
                    <HeartHandshake className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    Well-being {isSaving && <span className="ml-2 text-xs text-muted-foreground animate-pulse">(Saving...)</span>}
                </h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700 space-y-6">
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="enable-usage-limit" className="flex-1 cursor-pointer">
                            <div className="flex items-center mb-1"><span className="font-medium">Daily Usage Limit</span></div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">Set a daily time limit for CiRQL.</span>
                        </Label>
                        <Switch id="enable-usage-limit" checked={enableUsageLimit} onCheckedChange={(checked) => handleSettingChange("well_being", "daily_usage_limit_enabled", checked)} className="sm:ml-4 self-end sm:self-center"/>
                    </div>
                    {enableUsageLimit && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <Label htmlFor="daily-limit-duration" className="flex-1">
                                <div className="flex items-center mb-1"><Hourglass className="mr-2 h-4 w-4 text-muted-foreground shrink-0" /><span className="font-medium">Time Limit</span></div>
                                <span className="text-sm font-normal leading-snug text-muted-foreground">Choose daily usage duration.</span>
                            </Label>
                            <Select value={dailyLimitMinutes} onValueChange={(value) => handleSettingChange("well_being", "daily_usage_limit_minutes", value)}>
                                <SelectTrigger id="daily-limit-duration" className="w-full mt-1 sm:mt-0 sm:w-[200px] sm:ml-4"><SelectValue placeholder="Select limit" /></SelectTrigger>
                                <SelectContent>{usageLimitOptions.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </section>
            <Separator className="dark:bg-slate-700"/>

            {/* Privacy Controls */}
            <section className="space-y-6">
                 <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    Privacy {isSaving && <span className="ml-2 text-xs text-muted-foreground animate-pulse">(Saving...)</span>}
                </h2>
                 <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700 space-y-6">
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="profile-visibility" className="flex-1">
                            <div className="flex items-center mb-1"><Eye className="mr-2 h-4 w-4 text-muted-foreground shrink-0" /><span className="font-medium">Profile Visibility</span></div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">Control who can see your profile.</span>
                        </Label>
                        <Select value={profileVisibility} onValueChange={(value) => handleSettingChange("privacy_controls", "profile_visibility", value)}>
                            <SelectTrigger id="profile-visibility" className="w-full mt-1 sm:mt-0 sm:w-[180px] sm:ml-4"><SelectValue placeholder="Select visibility" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="followers">Followers Only</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="message-permissions" className="flex-1">
                            <div className="flex items-center mb-1"><MessagesSquare className="mr-2 h-4 w-4 text-muted-foreground shrink-0" /><span className="font-medium">Message Permissions</span></div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">Control who can message you.</span>
                        </Label>
                        <Select value={messagePermissions} onValueChange={(value) => handleSettingChange("privacy_controls", "message_permissions", value)}>
                            <SelectTrigger id="message-permissions" className="w-full mt-1 sm:mt-0 sm:w-[180px] sm:ml-4"><SelectValue placeholder="Select permission" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="anyone">Anyone</SelectItem>
                                <SelectItem value="followers">Followers Only</SelectItem>
                                <SelectItem value="none">No One</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>
            </section>
            <Separator className="dark:bg-slate-700"/>

            {/* Account Settings */}
            <section className="space-y-6">
                 <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center">
                    <UserCog className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    Account {isSaving && <span className="ml-2 text-xs text-muted-foreground animate-pulse">(Saving...)</span>}
                </h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="show-active-status" className="flex-1 cursor-pointer">
                            <div className="flex items-center mb-1"><CircleDot className="mr-2 h-4 w-4 text-muted-foreground shrink-0" /><span className="font-medium">Show Active Status</span></div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">Allow others to see when you are active.</span>
                        </Label>
                        <Switch id="show-active-status" checked={showActiveStatus} onCheckedChange={(checked) => handleSettingChange("account_settings", "show_active_status_enabled", checked)} className="sm:ml-4 self-end sm:self-center"/>
                    </div>
                </div>
            </section>
            <Separator className="dark:bg-slate-700"/>

            {/* Sign Out Section */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center">
                    <LogOut className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    Session
                </h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1">
                            <h3 className="text-md font-medium">Sign Out</h3>
                            <p className="text-sm text-muted-foreground">End your current session on this device.</p>
                        </div>
                        <Button variant="outline" onClick={logout} className="sm:ml-4 self-end sm:self-center mt-2 sm:mt-0">
                           <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                    </div>
                </div>
            </section>
            <Separator className="dark:bg-slate-700"/>

            {/* Danger Zone */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center text-destructive">
                    <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
                    Danger Zone
                </h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm border-destructive dark:border-red-700/70 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1">
                            <h3 className="text-md font-medium text-destructive">Deactivate Account</h3>
                            <p className="text-sm text-red-600/90 dark:text-red-500/90 leading-snug">
                                Temporarily deactivate your account. Your profile and content will be hidden until you sign back in.
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleDeactivateAccount} className="border-destructive text-destructive hover:bg-destructive/10 sm:ml-4 self-end sm:self-center mt-2 sm:mt-0">
                           <UserX className="mr-2 h-4 w-4" /> Deactivate
                        </Button>
                    </div>
                    <Separator className="dark:bg-slate-700/50"/>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1">
                            <h3 className="text-md font-medium">Download My Data</h3>
                            <p className="text-sm text-muted-foreground leading-snug">
                                Request an archive of your account information, settings, and activity.
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleDownloadData} className="sm:ml-4 self-end sm:self-center mt-2 sm:mt-0">
                           <DownloadIcon className="mr-2 h-4 w-4" /> Download Data
                        </Button>
                    </div>
                    <Separator className="dark:bg-slate-700/50"/>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1">
                            <h3 className="text-md font-medium text-destructive">Delete Activity History</h3>
                            <p className="text-sm text-red-600/90 dark:text-red-500/90 leading-snug">
                                Permanently delete your activity history (e.g., messages, comments). Your account and settings will remain. This action is irreversible.
                            </p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteActivityHistory} className="sm:ml-4 self-end sm:self-center mt-2 sm:mt-0">
                           <HistoryIcon className="mr-2 h-4 w-4" /> Delete History
                        </Button>
                    </div>
                    <Separator className="dark:bg-slate-700/50"/>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1">
                            <h3 className="text-md font-medium text-destructive">Delete Account</h3>
                            <p className="text-sm text-red-600/90 dark:text-red-500/90 leading-snug">
                                Permanently delete your CiRQL account and all associated data. This action is irreversible.
                            </p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount} className="sm:ml-4 self-end sm:self-center mt-2 sm:mt-0">
                           <AlertTriangle className="mr-2 h-4 w-4" /> Delete My Account
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}