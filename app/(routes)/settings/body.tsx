// app/(routes)/settings/body.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

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
import { SignOutButton } from '@/components/auth/sign-out-button';

// Lucide Icons
import {
    Settings as SettingsIcon,
    Palette,
    BellRing,
    Mail,
    AtSign,
    MessageCircle,
    ShieldCheck,
    Eye,
    MessagesSquare,
    History as HistoryIcon, // ALIASED
    Download,
    UserCog,
    LogOut,
    Trash2,
    HeartHandshake,
    Hourglass,
    TimerOff,
} from 'lucide-react';

// Define a type for your settings object
type UserSettings = {
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
};

// Default settings
const defaultSettings: UserSettings = {
  notification_preferences: {
    email_digests_enabled: true,
    push_mentions_enabled: true,
    push_loop_activity_enabled: false,
    snooze_duration_minutes: "never"
  },
  well_being: {
    daily_usage_limit_enabled: false,
    daily_usage_limit_minutes: "60"
  },
  privacy_controls: {
    profile_visibility: "public",
    message_permissions: "anyone"
  }
};

// Define options arrays
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

export default function Body() {
    const renderCount = useRef(0);
    renderCount.current += 1;
    // console.log(`Body component rendered: ${renderCount.current} times`); // Uncomment for debugging render counts

    const [emailDigests, setEmailDigests] = useState(defaultSettings.notification_preferences.email_digests_enabled);
    const [pushMentions, setPushMentions] = useState(defaultSettings.notification_preferences.push_mentions_enabled);
    const [newLoopActivity, setNewLoopActivity] = useState(defaultSettings.notification_preferences.push_loop_activity_enabled);
    const [snoozeDuration, setSnoozeDuration] = useState(defaultSettings.notification_preferences.snooze_duration_minutes);
    const [enableUsageLimit, setEnableUsageLimit] = useState(defaultSettings.well_being.daily_usage_limit_enabled);
    const [dailyLimitMinutes, setDailyLimitMinutes] = useState(defaultSettings.well_being.daily_usage_limit_minutes);
    const [profileVisibility, setProfileVisibility] = useState(defaultSettings.privacy_controls.profile_visibility);
    const [messagePermissions, setMessagePermissions] = useState(defaultSettings.privacy_controls.message_permissions);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // console.log("FETCH useEffect triggered"); // Uncomment for debugging
        const fetchSettings = async () => {
            // console.log("FETCH: Setting isLoading to true (if not already)");
            setIsLoading(true);
            try {
                // console.log("FETCH: Starting mock fetch...");
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
                const fetchedSettings: UserSettings = { // Mock fetched data
                    notification_preferences: { email_digests_enabled: true, push_mentions_enabled: false, push_loop_activity_enabled: true, snooze_duration_minutes: "60" },
                    well_being: { daily_usage_limit_enabled: true, daily_usage_limit_minutes: "120" },
                    privacy_controls: { profile_visibility: "followers", message_permissions: "followers" }
                };
                // console.log("FETCH: Mock fetch complete. Updating states.");

                setEmailDigests(fetchedSettings.notification_preferences.email_digests_enabled);
                setPushMentions(fetchedSettings.notification_preferences.push_mentions_enabled);
                setNewLoopActivity(fetchedSettings.notification_preferences.push_loop_activity_enabled);
                setSnoozeDuration(fetchedSettings.notification_preferences.snooze_duration_minutes);
                setEnableUsageLimit(fetchedSettings.well_being.daily_usage_limit_enabled);
                setDailyLimitMinutes(fetchedSettings.well_being.daily_usage_limit_minutes);
                setProfileVisibility(fetchedSettings.privacy_controls.profile_visibility);
                setMessagePermissions(fetchedSettings.privacy_controls.message_permissions);
                // console.log("FETCH: States updated from fetched data.");

            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                // console.log("FETCH: Setting isLoading to false.");
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []); // Empty dependency array: runs once on mount

    const getSettingsForSave = (): UserSettings => ({
        notification_preferences: {
            email_digests_enabled: emailDigests,
            push_mentions_enabled: pushMentions,
            push_loop_activity_enabled: newLoopActivity,
            snooze_duration_minutes: snoozeDuration,
        },
        well_being: {
            daily_usage_limit_enabled: enableUsageLimit,
            daily_usage_limit_minutes: dailyLimitMinutes,
        },
        privacy_controls: {
            profile_visibility: profileVisibility,
            message_permissions: messagePermissions,
        }
    });

    const handleSettingChange = <
        K extends keyof UserSettings,
        SubK extends keyof UserSettings[K]
    >(
        category: K,
        setting: SubK,
        value: UserSettings[K][SubK]
    ) => {
        // console.log(`HANDLE_CHANGE: Category: ${category}, Setting: ${String(setting)}, Value: ${value}`); // Uncomment for debugging
        if (category === "notification_preferences") {
            if (setting === "email_digests_enabled") setEmailDigests(value as boolean);
            else if (setting === "push_mentions_enabled") setPushMentions(value as boolean);
            else if (setting === "push_loop_activity_enabled") setNewLoopActivity(value as boolean);
            else if (setting === "snooze_duration_minutes") setSnoozeDuration(value as string);
        } else if (category === "well_being") {
            if (setting === "daily_usage_limit_enabled") setEnableUsageLimit(value as boolean);
            else if (setting === "daily_usage_limit_minutes") setDailyLimitMinutes(value as string);
        } else if (category === "privacy_controls") {
            if (setting === "profile_visibility") setProfileVisibility(value as string);
            else if (setting === "message_permissions") setMessagePermissions(value as string);
        }
        
        // Defer save logic to avoid direct re-render conflicts if any, and ensure state is updated
        setTimeout(() => {
            const updatedSettings = getSettingsForSave();
            console.log("Settings updated. Ready to save to backend:", updatedSettings);
            // In a real app:
            // try {
            //   const response = await fetch('/api/user/settings', {
            //     method: 'POST', // or PUT
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(updatedSettings), // or just the changed part
            //   });
            //   if (!response.ok) throw new Error('Failed to save settings');
            //   // Show success toast
            // } catch (error) {
            //   console.error("Error saving settings:", error);
            //   // Show error toast, potentially revert optimistic UI update
            // }
        }, 0);
    };

    const handlePlaceholderAction = (actionName: string) => {
        console.log(`UI Preview: ${actionName} button clicked (no backend action).`);
    };

    if (isLoading) {
        // console.log("Rendering isLoading state"); // Uncomment for debugging
        return (
            <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-muted-foreground">Loading settings...</p>
            </div>
        );
    }

    // console.log("Rendering main settings UI"); // Uncomment for debugging
    return (
        <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 space-y-10 min-w-0">
            <header className="mb-8">
                 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center">
                    <SettingsIcon className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                    Settings
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Manage your account preferences and settings for CiRQL.
                </p>
            </header>

            {/* --- General Settings --- */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center">
                    <Palette className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" /> General
                </h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center">
                            <div>
                                <h3 className="text-md font-medium">Appearance</h3>
                                <p className="text-sm text-muted-foreground">Customize the look and feel.</p>
                            </div>
                        </div>
                        <ModeToggle />
                    </div>
                </div>
            </section>
            <Separator />

            {/* --- Notification Preferences --- */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center">
                    <BellRing className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    Notifications
                </h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="email-digests" className="flex-1">
                            <div className="flex items-center mb-1">
                                <Mail className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium">Email Digests</span>
                            </div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">
                                Receive periodic summaries of activity.
                            </span>
                        </Label>
                        <Switch
                            id="email-digests"
                            checked={emailDigests}
                            onCheckedChange={(checked) =>
                                handleSettingChange("notification_preferences", "email_digests_enabled", checked)
                            }
                            className="sm:ml-4 self-end sm:self-center"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="push-mentions" className="flex-1">
                            <div className="flex items-center mb-1">
                                <AtSign className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium">Push: Mentions</span>
                            </div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">
                                Get notified when someone mentions you.
                            </span>
                        </Label>
                        <Switch
                            id="push-mentions"
                            checked={pushMentions}
                             onCheckedChange={(checked) =>
                                handleSettingChange("notification_preferences", "push_mentions_enabled", checked)
                            }
                            className="sm:ml-4 self-end sm:self-center"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="loop-activity" className="flex-1">
                            <div className="flex items-center mb-1">
                                <MessageCircle className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium">Push: Loop Activity</span>
                            </div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">
                                Alerts for new messages in your loops.
                            </span>
                        </Label>
                        <Switch
                            id="loop-activity"
                            checked={newLoopActivity}
                            onCheckedChange={(checked) =>
                                handleSettingChange("notification_preferences", "push_loop_activity_enabled", checked)
                            }
                            className="sm:ml-4 self-end sm:self-center"
                        />
                    </div>
                    <Separator />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="snooze-duration" className="flex-1">
                            <div className="flex items-center mb-1">
                                <TimerOff className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium">Snooze Notifications</span>
                            </div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">
                                Temporarily pause notifications.
                            </span>
                        </Label>
                        <Select
                            value={snoozeDuration}
                            onValueChange={(value) =>
                                handleSettingChange("notification_preferences", "snooze_duration_minutes", value)
                            }
                        >
                            <SelectTrigger id="snooze-duration" className="w-full mt-1 sm:mt-0 sm:w-[240px] sm:ml-4">
                                <SelectValue placeholder="Select snooze" />
                            </SelectTrigger>
                            <SelectContent>
                                {snoozeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            <Separator />

            {/* --- Well-being / Usage Limit --- */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center">
                    <HeartHandshake className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    Well-being
                </h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="enable-usage-limit" className="flex-1">
                            <div className="flex items-center mb-1">
                                <span className="font-medium">Daily Usage Limit</span>
                            </div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">
                                Set a daily time limit for CiRQL.
                            </span>
                        </Label>
                        <Switch
                            id="enable-usage-limit"
                            checked={enableUsageLimit}
                            onCheckedChange={(checked) =>
                                handleSettingChange("well_being", "daily_usage_limit_enabled", checked)
                            }
                            className="sm:ml-4 self-end sm:self-center"
                        />
                    </div>

                    {enableUsageLimit && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <Label htmlFor="daily-limit-duration" className="flex-1">
                                <div className="flex items-center mb-1">
                                    <Hourglass className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="font-medium">Time Limit</span>
                                </div>
                                <span className="text-sm font-normal leading-snug text-muted-foreground">
                                    Choose daily usage duration.
                                </span>
                            </Label>
                            <Select
                                value={dailyLimitMinutes}
                                onValueChange={(value) =>
                                    handleSettingChange("well_being", "daily_usage_limit_minutes", value)
                                }
                            >
                                <SelectTrigger id="daily-limit-duration" className="w-full mt-1 sm:mt-0 sm:w-[200px] sm:ml-4">
                                    <SelectValue placeholder="Select limit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {usageLimitOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </section>
            <Separator />
             {/* --- Privacy Controls --- */}
            <section className="space-y-6">
                 <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    Privacy
                </h2>
                 <div className="p-4 sm:p-6 border rounded-lg shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="profile-visibility" className="flex-1">
                            <div className="flex items-center mb-1">
                                <Eye className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium">Profile Visibility</span>
                            </div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">
                                Control who can see your profile.
                            </span>
                        </Label>
                        <Select
                            value={profileVisibility}
                            onValueChange={(value) =>
                                handleSettingChange("privacy_controls", "profile_visibility", value)
                            }
                        >
                            <SelectTrigger id="profile-visibility" className="w-full mt-1 sm:mt-0 sm:w-[180px] sm:ml-4">
                                <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="followers">Followers Only</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <Label htmlFor="message-permissions" className="flex-1">
                            <div className="flex items-center mb-1">
                                <MessagesSquare className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium">Message Permissions</span>
                            </div>
                            <span className="text-sm font-normal leading-snug text-muted-foreground">
                                Control who can message you.
                            </span>
                        </Label>
                        <Select
                            value={messagePermissions}
                            onValueChange={(value) =>
                                handleSettingChange("privacy_controls", "message_permissions", value)
                            }
                        >
                            <SelectTrigger id="message-permissions" className="w-full mt-1 sm:mt-0 sm:w-[180px] sm:ml-4">
                                <SelectValue placeholder="Select permission" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="anyone">Anyone</SelectItem>
                                <SelectItem value="followers">Followers Only</SelectItem>
                                <SelectItem value="none">No One</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

             <Separator />
            {/* --- Activity & Data Management --- */}
            <section className="space-y-6">
                 <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center">
                    <HistoryIcon className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    Activity & Data
                </h2>
                 <div className="p-4 sm:p-6 border rounded-lg shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div>
                            <h3 className="text-md font-medium">Search History</h3>
                            <p className="text-sm text-muted-foreground">Manage your past searches.</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePlaceholderAction("Clear Search History")}
                            disabled
                            className="w-full sm:w-auto mt-2 sm:mt-0"
                        >
                            <Trash2 className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="hidden sm:inline">Clear History</span>
                            <span className="sm:hidden">Clear</span>
                        </Button>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                         <div>
                            <h3 className="text-md font-medium">Export Your Data</h3>
                            <p className="text-sm text-muted-foreground">Download a copy of your data.</p>
                        </div>
                         <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePlaceholderAction("Request Data Export")}
                            disabled
                            className="w-full sm:w-auto mt-2 sm:mt-0"
                        >
                            <Download className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="hidden md:inline">Request Data Export</span>
                            <span className="md:hidden sm:inline">Request Export</span>
                            <span className="sm:hidden">Export</span>
                        </Button>
                    </div>
                 </div>
            </section>
             <Separator />
             {/* --- Account Settings --- */}
            <section className="space-y-6">
                 <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center">
                    <UserCog className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    Account
                </h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div>
                            <h3 className="text-md font-medium">Sign Out</h3>
                            <p className="text-sm text-muted-foreground">
                                End your current session.
                            </p>
                        </div>
                        <SignOutButton variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0">
                            <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                            Sign Out
                        </SignOutButton>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div>
                            <h3 className="text-md font-medium text-red-600 dark:text-red-500">Delete Account</h3>
                            <p className="text-sm text-muted-foreground">
                                Permanently remove your account.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handlePlaceholderAction("Delete Account")}
                            disabled
                            className="w-full sm:w-auto mt-2 sm:mt-0"
                        >
                            <Trash2 className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="hidden sm:inline">Delete Account</span>
                            <span className="sm:hidden">Delete</span>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}