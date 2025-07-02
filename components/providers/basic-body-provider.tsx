"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
// --- THIS IS THE FIX: Import the new context hook ---
import { useGetMySettings } from "../hooks/settings/get-settings";
import { useTheme } from "next-themes";
import { authRoutes, twoFactorAuthRoute } from "@/lib/auth-routes";

interface BasicBodyProviderProps {
    children: ReactNode;
}

const BasicBodyProvider: React.FC<BasicBodyProviderProps> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { state } = useAuth();
    const { user, status: authStatus } = state;
    const authIsLoading = authStatus === 'loading';

    // --- THIS IS THE FIX: Use the global context hook instead of the old one ---
    const { settings, isLoading: settingsIsLoading, error } = useGetMySettings();
    const { setTheme } = useTheme();

    useEffect(() => {
        if (settings) {
            setTheme(settings.uiCustomizationPreferences.theme);
        }
    }, [settings, setTheme]);

    useEffect(() => {
        const isAuthPage = authRoutes.includes(pathname) || pathname === twoFactorAuthRoute;
        
        if (!authIsLoading && !user && !isAuthPage) {
            router.push('/sign-in');
        }
    }, [user, authIsLoading, router, pathname]);

    if (authIsLoading) {
        return <main className="bg-background text-foreground"><p className="text-center p-10">Authenticating...</p></main>;
    }

    // This check is important. If the user is not logged in, we shouldn't try to render styled content.
    // The AuthInitializer will handle showing the correct public page or redirecting.
    if (!user) {
        return <>{children}</>; 
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

    // Use a simpler class for default, as theme is handled by next-themes
    const colorClasses = accessibilityOptionsPreferences.highContrastMode
        ? 'bg-white text-black dark:bg-black dark:text-white'
        : 'bg-background text-foreground';

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