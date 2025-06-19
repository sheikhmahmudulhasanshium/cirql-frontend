'use client';

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
import { LogOut, Settings, User, Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { SignInButton } from "@/components/auth/sign-in-button";
import { updateMySettings } from "@/components/hooks/settings/patch-settings";
import { Button } from "@/components/ui/button";

const HeaderAvatarComponent = () => {
    const { state, dispatch } = useAuth();
    const { theme, setTheme } = useTheme();
    const { user, status } = state;

    const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
        // Step 1: Immediately update the visual theme for a better UX,
        // even though the page will reload. This reduces the "flash" of the old theme.
        setTheme(newTheme);

        try {
            // Step 2: Save the preference to the server.
            await updateMySettings({
                uiCustomizationPreferences: { theme: newTheme },
            });

            // --- THE FIX ---
            // Step 3: Force a reload of the current page.
            // This ensures that all components, including the settings page
            // and the header itself, will re-fetch their data from the
            // server, getting the new theme preference.
            window.location.reload();
            
        } catch (error) {
            console.error("Failed to save theme preference:", error);
            // If the save fails, you might want to show a toast message
            // to the user, as the reload won't happen.
        }
    };

    if (status === 'loading') {
        return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    if (status === 'unauthenticated' || !user) {
        return <SignInButton />;
    }

    // The rest of the component's JSX remains exactly the same.
    // The `onSelect` prop on each DropdownMenuItem will trigger the handler above.
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
                        <p className="text-sm font-medium leading-none">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/profile/me">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onSelect={() => handleThemeChange('light')}>
                                <Sun className="mr-2 h-4 w-4" />
                                <span>Light</span>
                                {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleThemeChange('dark')}>
                                <Moon className="mr-2 h-4 w-4" />
                                <span>Dark</span>
                                {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleThemeChange('system')}>
                                <Laptop className="mr-2 h-4 w-4" />
                                <span>System</span>
                                {theme === 'system' && <Check className="ml-auto h-4 w-4" />}
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