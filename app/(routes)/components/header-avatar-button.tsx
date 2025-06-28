'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/components/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Settings, User, Sun, Moon, Laptop, Check, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { SignInButton } from "@/components/auth/sign-in-button";
import { Button } from "@/components/ui/button";
import { updateMyTheme } from "@/components/hooks/settings/patch-settings";
import { useGetMySettings } from "@/components/hooks/settings/get-settings";
import { toast } from "sonner";

const HeaderAvatarComponent = () => {
    const { state: authState, dispatch } = useAuth();
    const { user, status } = authState;
    const { setTheme } = useTheme();
    // The setSettings function from the hook is not used here, but the hook is kept to get the initial theme value.
    const { settings } = useGetMySettings();
    
    const [optimisticTheme, setOptimisticTheme] = useState<'light' | 'dark' | 'system' | undefined>(undefined);
    const [isSavingTheme, setIsSavingTheme] = useState(false);

    useEffect(() => {
        if (settings) {
            setOptimisticTheme(settings.uiCustomizationPreferences.theme);
        }
    }, [settings]);

    const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
        if (isSavingTheme || !settings) return;

        const originalTheme = settings.uiCustomizationPreferences.theme;
        setOptimisticTheme(newTheme);
        setTheme(newTheme); // Apply theme visually before reload
        setIsSavingTheme(true);

        try {
            // Wait for the theme preference to be saved to the database.
            await updateMyTheme({ theme: newTheme });

            // As requested: Reload the current page to apply the theme change.
            window.location.reload();

        } catch (error) {
            toast.error("Failed to save theme preference.");
            // If saving fails, revert the optimistic changes.
            setOptimisticTheme(originalTheme);
            setTheme(originalTheme);
            setIsSavingTheme(false); // Reset saving state on error
        }
        // NOTE: The `finally` block is omitted as it would not be reached if the page reloads successfully.
    };

    if (status === 'loading') {
        return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    if (status === 'unauthenticated' || !user) {
        return <SignInButton />;
    }

    const currentTheme = optimisticTheme || 'system';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.picture || ''} alt={user.firstName || 'User'} />
                        <AvatarFallback>{user.firstName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/profile/me"><User className="mr-2 h-4 w-4" /><span>Profile</span></Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/settings"><Settings className="mr-2 h-4 w-4" /><span>Settings</span></Link></DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger disabled={isSavingTheme}>
                        {isSavingTheme ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            </>
                        )}
                        <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onSelect={() => handleThemeChange('light')}>
                                <Sun className="mr-2 h-4 w-4" /><span>Light</span>
                                {currentTheme === 'light' && <Check className="ml-auto h-4 w-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleThemeChange('dark')}>
                                <Moon className="mr-2 h-4 w-4" /><span>Dark</span>
                                {currentTheme === 'dark' && <Check className="ml-auto h-4 w-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleThemeChange('system')}>
                                <Laptop className="mr-2 h-4 w-4" /><span>System</span>
                                {currentTheme === 'system' && <Check className="ml-auto h-4 w-4" />}
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => dispatch({ type: 'LOGOUT' })} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default HeaderAvatarComponent;