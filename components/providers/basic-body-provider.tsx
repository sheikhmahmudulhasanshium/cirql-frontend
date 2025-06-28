// src/components/providers/basic-body-provider.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useUserSettings } from "../hooks/settings/get-settings-by-id";
import { useTheme } from "next-themes";
import { authRoutes, twoFactorAuthRoute } from "@/lib/auth-routes"; // Import auth routes

interface BasicBodyProviderProps {
    children: ReactNode;
}

const BasicBodyProvider: React.FC<BasicBodyProviderProps> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname(); // Get the current path
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

    useEffect(() => {
        // FIX: Add a check to prevent redirection if already on an auth page.
        const isAuthPage = authRoutes.includes(pathname) || pathname === twoFactorAuthRoute;
        
        if (!authIsLoading && !user && !isAuthPage) {
            router.push('/sign-in'); // Corrected path
        }
    }, [user, authIsLoading, router, pathname]);

    if (authIsLoading) {
        return <main className="bg-background text-foreground"><p className="text-center p-10">Authenticating...</p></main>;
    }

    if (!user) {
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