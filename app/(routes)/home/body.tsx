"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/components/contexts/AuthContext";
import { useUserSettings } from '@/components/hooks/settings/get-settings-by-id';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, Palette, User, Shield, Accessibility, Newspaper, 
  ToggleLeft, ToggleRight, Sun, Moon, Monitor, LayoutGrid, List,
  Smartphone, Mail, Type, TextQuote, Contrast, ScreenShare
} from 'lucide-react';

// Helper component for a single setting row for better organization
const SettingRow = ({ icon, title, description, control }: { icon: React.ReactNode, title: string, description: string, control: React.ReactNode }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-b-0">
    <div className="flex items-center gap-4">
      <div className="text-blue-400">{icon}</div>
      <div>
        <h4 className="font-medium text-gray-200">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
    <div>{control}</div>
  </div>
);

// Helper for the boolean toggle switch UI
const ToggleSwitch = ({ enabled }: { enabled: boolean }) => (
  <div className={`flex items-center cursor-pointer ${enabled ? 'text-green-400' : 'text-gray-500'}`}>
    {enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
  </div>
);

// Helper for displaying a simple value with a label
const ValueDisplay = ({ value }: { value: string }) => (
  <span className="text-sm font-semibold bg-gray-700 text-gray-300 px-3 py-1 rounded-md capitalize">
    {value}
  </span>
);

const Body = () => {
  const router = useRouter();
  const { user, isLoading: authIsLoading } = useAuth();
  
  const { data: settings, isLoading: settingsIsLoading, error } = useUserSettings(user?._id);

  useEffect(() => {
    if (!authIsLoading && !user) {
      router.push('/sign-in');
    }
  }, [user, authIsLoading, router]);

  if (authIsLoading) {
    return <p className="text-center p-10">Authenticating...</p>;
  }

  if (!user) {
    return null; // Redirecting
  }

  if (settingsIsLoading) {
    return <p className="text-center p-10">Loading your settings...</p>;
  }

  if (error) {
    return <p className="text-center p-10 text-red-500">Error: Could not load user settings. {error.message}</p>;
  }
  
  if (!settings) {
    return <p className="text-center p-10">No settings data available for this user.</p>;
  }
  
  // Destructure for easier access in JSX
  const { 
    notificationPreferences, 
    accountSettingsPreferences, 
    securitySettingsPreferences, 
    accessibilityOptionsPreferences, 
    contentPreferences, 
    uiCustomizationPreferences 
  } = settings;

  const { email, firstName, lastName, picture } = user;
  const userInitials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  const ThemeIcon = uiCustomizationPreferences.theme === 'dark' ? Moon : uiCustomizationPreferences.theme === 'light' ? Sun : Monitor;

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <header className="mb-8 flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-gray-700">
            <AvatarImage src={picture} alt={`${firstName} ${lastName}`} />
            <AvatarFallback className="bg-blue-600 text-white font-bold text-2xl">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>
            <p className="text-gray-400">{firstName} {lastName} ({email})</p>
          </div>
        </header>

        {/* --- Settings Grid --- */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* UI Customization Card */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white"><Palette /> UI Customization</h3>
            <div className="space-y-2">
              <SettingRow icon={<ThemeIcon />} title="Theme" description="Choose your interface color scheme" control={<ValueDisplay value={uiCustomizationPreferences.theme} />} />
              <SettingRow icon={uiCustomizationPreferences.layout === 'grid' ? <LayoutGrid /> : <List />} title="Layout" description="Default view for content feeds" control={<ValueDisplay value={uiCustomizationPreferences.layout} />} />
              <SettingRow icon={<span>✨</span>} title="Animations" description="Enable or disable UI animations" control={<ToggleSwitch enabled={uiCustomizationPreferences.animationsEnabled} />} />
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white"><Bell /> Notifications</h3>
            <div className="space-y-2">
              <SettingRow icon={<Mail />} title="Email Notifications" description="Receive updates via email" control={<ToggleSwitch enabled={notificationPreferences.emailNotifications} />} />
              <SettingRow icon={<Smartphone />} title="Push Notifications" description="Get alerts on your device" control={<ToggleSwitch enabled={notificationPreferences.pushNotifications} />} />
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white"><Shield /> Security</h3>
            <div className="space-y-2">
              <SettingRow icon={<User />} title="Private Account" description="Your profile is hidden from public" control={<ToggleSwitch enabled={accountSettingsPreferences.isPrivate} />} />
              <SettingRow icon={<span className="font-bold">2FA</span>} title="Two-Factor Auth" description="Extra layer of security for your account" control={<ToggleSwitch enabled={securitySettingsPreferences.enable2FA} />} />
              <SettingRow icon={<Mail />} title="Recovery Method" description="How to recover your account" control={<ValueDisplay value={securitySettingsPreferences.recoveryMethod} />} />
            </div>
          </div>

          {/* Accessibility Card */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white"><Accessibility /> Accessibility</h3>
            <div className="space-y-2">
              <SettingRow icon={<Contrast />} title="High Contrast Mode" description="Improves visibility for text" control={<ToggleSwitch enabled={accessibilityOptionsPreferences.highContrastMode} />} />
              <SettingRow icon={<ScreenShare />} title="Screen Reader" description="Support for screen reader software" control={<ToggleSwitch enabled={accessibilityOptionsPreferences.screenReaderSupport} />} />
              <SettingRow icon={<Type />} title="Font Style" description="Choose a different font for reading" control={<ValueDisplay value={accessibilityOptionsPreferences.font} />} />
              <SettingRow icon={<TextQuote />} title="Text Size" description="Adjust the size of text" control={<ValueDisplay value={accessibilityOptionsPreferences.textSize} />} />
            </div>
          </div>

          {/* Content Preferences Card */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white"><Newspaper /> Content Interests</h3>
            <div className="flex flex-wrap gap-2">
              {contentPreferences.interests.length > 0 ? (
                contentPreferences.interests.map(interest => (
                  <span key={interest} className="bg-blue-600/50 text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">You haven`&apos;`t added any interests yet.</p>
              )}
            </div>
          </div>

        </main>

        {/* --- Footer --- */}
        <footer className="text-center mt-12 text-gray-500 text-xs">
          <p>Settings for User ID: {settings.userId}</p>
          <p>Last updated: {new Date(settings.updatedAt).toLocaleString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Body;