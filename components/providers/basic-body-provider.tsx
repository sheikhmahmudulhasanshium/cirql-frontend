"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useUserSettings } from "../hooks/settings/get-settings-by-id"; // Assuming this exists
import { useTheme } from "next-themes";

interface BasicBodyProviderProps {
    children: ReactNode;
}

const BasicBodyProvider: React.FC<BasicBodyProviderProps> = ({ children }) => {
    const router = useRouter();
    // FIX: Destructure state from useAuth, then get the user and status.
    const { state } = useAuth();
    const { user, status: authStatus } = state;
    const authIsLoading = authStatus === 'loading';

    const { data: settings, isLoading: settingsIsLoading, error } = useUserSettings(user?._id);
    const { setTheme } = useTheme();

    useEffect(() => {
        if (settings) {
            setTheme(settings.uiCustomizationPreferences.theme);
        }
    }, [settings, setTheme]);

    // This effect is now handled more robustly by the AuthInitializer,
    // but keeping it here provides a good secondary check.
    useEffect(() => {
        if (!authIsLoading && !user) {
            router.push('/sign-in');
        }
    }, [user, authIsLoading, router]);

    if (authIsLoading) {
        return <main className="bg-background text-foreground"><p className="text-center p-10">Authenticating...</p></main>;
    }

    if (!user) {
        // This will be briefly rendered while the redirect happens.
        return null; 
    }

    if (settingsIsLoading) {
        return <main className="bg-background text-foreground"><p className="text-center p-10">Loading your settings...</p></main>;
    }

    if (error) {
        return <main className="bg-background text-foreground"><p className="text-center p-10 text-destructive">Error: Could not load user settings. {error.message}</p></main>;
    }

    if (!settings) {
        return <main className="bg-background text-foreground"><p className="text-center p-10">No settings data available for this user.</p></main>;
    }
    
    const { accessibilityOptionsPreferences } = settings;

    const fontMap: { [key: string]: string } = {
        default: 'font-sans',
        serif: 'font-serif',
        mono: 'font-mono',
        inter: 'font-sans',
    };

    const textSizeMap: { [key: string]: string } = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
        xl: 'text-xl',
    };

    const colorClasses = accessibilityOptionsPreferences.highContrastMode
        ? 'bg-white text-black dark:bg-black dark:text-white'
        : 'bg-accent text-accent-foreground';

    const fontClass = fontMap[accessibilityOptionsPreferences.font] || 'font-sans';
    const textSizeClass = textSizeMap[accessibilityOptionsPreferences.textSize] || 'text-base';
    
    const mainClassName = [
        colorClasses,
        fontClass,
        textSizeClass,
        'transition-colors duration-300'
    ].join(' ');

    return (
        <main className={mainClassName}>
            {children}
        </main>
    );
}

export default BasicBodyProvider;