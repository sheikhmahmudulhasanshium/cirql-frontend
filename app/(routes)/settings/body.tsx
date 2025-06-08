'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

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
    BellRing, ShieldCheck, UserCog, Accessibility, Brush,
    LogOut, AlertTriangle, Undo, UserX, Download as DownloadIcon,
    LogIn, History
} from 'lucide-react';

// Auth Context & API Hooks
import { useAuth } from '@/components/contexts/AuthContext';
import { SettingsDto, UpdateSettingDto } from '@/lib/types';
import { useGetMySettings } from '@/components/hooks/settings/get-settings';
import { resetMySettings } from '@/components/hooks/settings/delete-settings';
import { updateMySettings } from '@/components/hooks/settings/patch-settings';
import { SignOutButton } from '@/components/auth/sign-out-button';

// FIX: Import the new custom SignOutButton component


// --- START: DEFINITIONS OUTSIDE THE COMPONENT ---

type EditableSettings = Omit<SettingsDto, '_id' | 'userId' | 'createdAt' | 'updatedAt'>;
type SettingsObjectKey = {
  [K in keyof EditableSettings]: EditableSettings[K] extends object ? K : never;
}[keyof EditableSettings];


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<F extends (...args: any[]) => any>(func: F, delay: number): (...args: Parameters<F>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<F>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
// --- END: DEFINITIONS OUTSIDE THE COMPONENT ---

export default function Body() {
    const { user, isLoading: authIsLoading, logout } = useAuth();
    const router = useRouter();

    const { settings, setSettings, isLoading: isLoadingData, error } = useGetMySettings();
    const [isSaving, setIsSaving] = useState(false);

    // Placeholder state for new, upcoming settings
    const [notificationSound, setNotificationSound] = useState(true);
    const [activeStatusVisibility, setActiveStatusVisibility] = useState('everyone');
    const [saveSearchHistory, setSaveSearchHistory] = useState(true);


    const debouncedSaveSettings = useMemo(
        () => debounce(async (payload: UpdateSettingDto) => {
            if (!user?._id) return;
            setIsSaving(true);
            try {
                const savedSettings = await updateMySettings(payload);
                setSettings(savedSettings); // Sync with confirmed server state
            } catch (err) {
                console.error("Failed to save settings:", err);
            } finally {
                setIsSaving(false);
            }
        }, 1500),
        [user?._id, setSettings]
    );

    const handleSettingChange = <K extends SettingsObjectKey>(
        category: K,
        settingKey: keyof EditableSettings[K],
        value: EditableSettings[K][keyof EditableSettings[K]]
    ) => {
        if (!settings) return;

        const newSettings = {
            ...settings,
            [category]: {
                ...settings[category],
                [settingKey]: value,
            },
        };
        setSettings(newSettings);
        debouncedSaveSettings({ [category]: newSettings[category] });
    };

    const handleReset = async () => {
        if (!user || !window.confirm("Are you sure you want to reset all settings to their default values?")) {
            return;
        }
        setIsSaving(true);
        try {
            const resetData = await resetMySettings();
            setSettings(resetData);
        } catch (err) {
            console.error("Failed to reset settings:", err);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (authIsLoading) {
        return (
            <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-muted-foreground">Loading session...</p>
            </div>
        );
    }

    if (!user) {
        return (
             <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center text-center min-h-[200px] border rounded-lg">
                <h1 className="text-2xl font-semibold mb-3">Access Your Settings</h1>
                <p className="text-muted-foreground mb-6">Please sign in to manage your account preferences.</p>
                <Button onClick={() => router.push('/sign-in')}>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                </Button>
            </div>
        );
    }

    if (isLoadingData) {
        return (
            <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-muted-foreground">Loading your preferences...</p>
            </div>
        );
    }

    if (error || !settings) {
         return (
             <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
                <p className="text-destructive mb-4">{error?.message || "Could not load settings."}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 space-y-10 min-w-0">
            {/* User Header */}
            <div className="flex items-center space-x-4 mb-6 p-4 border-b dark:border-slate-700">
                <div className="relative">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                        <AvatarImage src={user.picture || ''} alt={user.firstName || 'User'} />
                        <AvatarFallback>{user.firstName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-1 right-1 block h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {user.firstName || user.email} {user.lastName || ''}
                    </h1>
                    <p className="text-muted-foreground text-sm">Manage your account and preferences.</p>
                </div>
            </div>

            {/* Reset Button */}
            <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className='flex-1'><h3 className="text-md font-medium">Reset Preferences</h3><p className="text-sm text-muted-foreground">Revert all settings to their original defaults.</p></div>
                <Button variant="outline" onClick={handleReset} disabled={isSaving}><Undo className="mr-2 h-4 w-4" /> {isSaving ? 'Resetting...' : 'Reset to Defaults'}</Button>
            </div>
            <Separator />

            {/* Notifications Section */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center"><BellRing className="mr-2 h-5 w-5 text-muted-foreground"/> Notifications {isSaving && <span className="ml-2 text-xs text-muted-foreground animate-pulse">(Saving...)</span>}</h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700 space-y-6">
                    <div className="flex items-center justify-between"><Label htmlFor="email-notif" className="flex-1 cursor-pointer font-medium">Email Notifications</Label><Switch id="email-notif" checked={settings.notificationPreferences.emailNotifications} onCheckedChange={(c) => handleSettingChange('notificationPreferences', 'emailNotifications', c)} disabled={isSaving} /></div>
                    <div className="flex items-center justify-between"><Label htmlFor="push-notif" className="flex-1 cursor-pointer font-medium">Push Notifications</Label><Switch id="push-notif" checked={settings.notificationPreferences.pushNotifications} onCheckedChange={(c) => handleSettingChange('notificationPreferences', 'pushNotifications', c)} disabled={isSaving} /></div>
                    <div className="flex items-center justify-between"><Label htmlFor="notif-sound" className="flex-1 cursor-pointer font-medium text-muted-foreground">Notification Sounds (Upcoming)</Label><Switch id="notif-sound" checked={notificationSound} onCheckedChange={setNotificationSound} disabled /></div>
                </div>
            </section>
            <Separator />

            {/* Account Settings Section */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center"><UserCog className="mr-2 h-5 w-5 text-muted-foreground"/> Account Settings {isSaving && <span className="ml-2 text-xs text-muted-foreground animate-pulse">(Saving...)</span>}</h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700 space-y-6">
                    <div className="flex items-center justify-between"><Label htmlFor="is-private" className="flex-1 cursor-pointer font-medium">Private Account</Label><Switch id="is-private" checked={settings.accountSettingsPreferences.isPrivate} onCheckedChange={(c) => handleSettingChange('accountSettingsPreferences', 'isPrivate', c)} disabled={isSaving}/></div>
                    <div className="flex items-center justify-between"><Label htmlFor="active-status" className="flex-1 font-medium text-muted-foreground">Active Status Visibility (Upcoming)</Label>
                        <Select value={activeStatusVisibility} onValueChange={setActiveStatusVisibility} disabled>
                            <SelectTrigger id="active-status" className="w-[180px]"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="everyone">Everyone</SelectItem><SelectItem value="friends">Friends Only</SelectItem><SelectItem value="none">No One</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between"><Label className="flex-1 font-medium">Appearance</Label><ModeToggle /></div>
                </div>
            </section>
            <Separator />

            {/* New Data & Privacy Section (Placeholder) */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center text-muted-foreground"><History className="mr-2 h-5 w-5"/> Data & Privacy (Upcoming)</h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700 space-y-6">
                    <div className="flex items-center justify-between"><Label htmlFor="save-history" className="flex-1 cursor-pointer font-medium">Save search history</Label><Switch id="save-history" checked={saveSearchHistory} onCheckedChange={setSaveSearchHistory} disabled /></div>
                    <div className="flex items-center justify-between"><p className="text-sm flex-1">Clear your search history on this account.</p><Button variant="outline" onClick={() => alert('Not implemented yet')} disabled>Clear History</Button></div>
                    <div className="flex items-center justify-between"><p className="text-sm flex-1">Clear your account activity log.</p><Button variant="outline" onClick={() => alert('Not implemented yet')} disabled>Clear Log</Button></div>
                </div>
            </section>
            <Separator />
            
            {/* Security Settings Section */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-muted-foreground"/> Security {isSaving && <span className="ml-2 text-xs text-muted-foreground animate-pulse">(Saving...)</span>}</h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700 space-y-6">
                    <div className="flex items-center justify-between"><Label htmlFor="2fa" className="flex-1 cursor-pointer font-medium">Enable Two-Factor Authentication</Label><Switch id="2fa" checked={settings.securitySettingsPreferences.enable2FA} onCheckedChange={(c) => handleSettingChange('securitySettingsPreferences', 'enable2FA', c)} disabled={isSaving}/></div>
                    <div className="flex items-center justify-between"><Label htmlFor="recovery-method" className="flex-1 font-medium">Recovery Method</Label>
                        <Select value={settings.securitySettingsPreferences.recoveryMethod} onValueChange={(v) => handleSettingChange('securitySettingsPreferences', 'recoveryMethod', v as 'email' | 'phone')} disabled={isSaving}>
                            <SelectTrigger id="recovery-method" className="w-[180px]"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="email">Email</SelectItem><SelectItem value="phone" disabled>Phone (Coming Soon)</SelectItem></SelectContent>
                        </Select>
                    </div>
                </div>
            </section>
            <Separator />

            {/* Accessibility Section */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center"><Accessibility className="mr-2 h-5 w-5 text-muted-foreground"/> Accessibility {isSaving && <span className="ml-2 text-xs text-muted-foreground animate-pulse">(Saving...)</span>}</h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700 space-y-6">
                    <div className="flex items-center justify-between"><Label htmlFor="high-contrast" className="flex-1 cursor-pointer font-medium">High Contrast Mode</Label><Switch id="high-contrast" checked={settings.accessibilityOptionsPreferences.highContrastMode} onCheckedChange={(c) => handleSettingChange('accessibilityOptionsPreferences', 'highContrastMode', c)} disabled={isSaving}/></div>
                    <div className="flex items-center justify-between"><Label htmlFor="screen-reader" className="flex-1 cursor-pointer font-medium">Screen Reader Support</Label><Switch id="screen-reader" checked={settings.accessibilityOptionsPreferences.screenReaderSupport} onCheckedChange={(c) => handleSettingChange('accessibilityOptionsPreferences', 'screenReaderSupport', c)} disabled={isSaving}/></div>
                </div>
            </section>
            <Separator />
            
            {/* UI Customization Section */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center"><Brush className="mr-2 h-5 w-5 text-muted-foreground"/> UI Customization {isSaving && <span className="ml-2 text-xs text-muted-foreground animate-pulse">(Saving...)</span>}</h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700 space-y-6">
                    <div className="flex items-center justify-between"><Label htmlFor="animations" className="flex-1 cursor-pointer font-medium">Enable Animations</Label><Switch id="animations" checked={settings.uiCustomizationPreferences.animationsEnabled} onCheckedChange={(c) => handleSettingChange('uiCustomizationPreferences', 'animationsEnabled', c)} disabled={isSaving}/></div>
                    <div className="flex items-center justify-between"><Label htmlFor="layout" className="flex-1 font-medium">Default Layout</Label>
                        <Select value={settings.uiCustomizationPreferences.layout} onValueChange={(v) => handleSettingChange('uiCustomizationPreferences', 'layout', v as 'list' | 'grid')} disabled={isSaving}>
                            <SelectTrigger id="layout" className="w-[180px]"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="list">List View</SelectItem><SelectItem value="grid">Grid View</SelectItem></SelectContent>
                        </Select>
                    </div>
                </div>
            </section>
            <Separator />
            
            {/* Danger Zone Section */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center text-destructive"><AlertTriangle className="mr-2 h-5 w-5" /> Danger Zone</h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm border-destructive dark:border-red-700/70 space-y-8">
                     <div className="flex items-center justify-between">
                        <div className="flex-1"><h3 className="text-md font-medium text-destructive">Deactivate Account</h3><p className="text-sm text-red-600/90 dark:text-red-500/90 leading-snug">Temporarily deactivate your account.</p></div>
                        <Button variant="outline" onClick={() => alert("Not implemented")} className="border-destructive text-destructive hover:bg-destructive/10"><UserX className="mr-2 h-4 w-4" /> Deactivate</Button>
                    </div>
                    <Separator className="dark:bg-slate-700/50"/>
                    <div className="flex items-center justify-between">
                        <div className="flex-1"><h3 className="text-md font-medium">Download My Data</h3><p className="text-sm text-muted-foreground leading-snug">Request an archive of your account data.</p></div>
                        <Button variant="outline" onClick={() => alert("Not implemented")}><DownloadIcon className="mr-2 h-4 w-4" /> Download Data</Button>
                    </div>
                    <Separator className="dark:bg-slate-700/50"/>
                    <div className="flex items-center justify-between">
                        <div className="flex-1"><h3 className="text-md font-medium text-destructive">Delete Account</h3><p className="text-sm text-red-600/90 dark:text-red-500/90 leading-snug">Permanently delete your account and all data.</p></div>
                        <Button variant="destructive" onClick={() => alert("Not implemented")}><AlertTriangle className="mr-2 h-4 w-4" /> Delete My Account</Button>
                    </div>
                </div>
            </section>
            <Separator />

            {/* Session Section */}
            <section className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center"><LogOut className="mr-2 h-5 w-5 text-muted-foreground" /> Session</h2>
                <div className="p-4 sm:p-6 border rounded-lg shadow-sm dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="flex-1"><h3 className="text-md font-medium">Sign Out</h3><p className="text-sm text-muted-foreground">End your current session on this device.</p></div>
                        {/* Using the new custom component */}
                        <SignOutButton
                          variant="outline"
                          className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </SignOutButton>
                    </div>
                </div>
            </section>
        </div>
    );
}