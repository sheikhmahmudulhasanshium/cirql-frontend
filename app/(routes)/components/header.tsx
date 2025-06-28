// src/app/(routes)/home/components/header.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/contexts/AuthContext";
import Navbar from "./navbar";
import Searchbar from "./searchbar";
import { SignInButton } from "@/components/auth/sign-in-button";
import { ModeToggle } from "@/components/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import HeaderAvatarComponent from "./header-avatar-button";
import { SettingsProvider } from "@/components/hooks/settings/get-settings";
import { NotificationBell } from "./notification-bell";

const Header = () => {
    const { state } = useAuth();
    const { status } = state;
    const isAuthenticated = status === 'authenticated';
    
    return (
        <header className="flex h-16 sm:h-20 px-2 md:px-4 lg:px-6 items-center w-full shadow-md dark:shadow-gray-700/50 bg-background gap-2 sm:gap-3 md:gap-4 ">
            <div className="flex-shrink-0">
                <Link href="/" aria-label="Go to homepage" className="flex items-center">
                    <Image src={'/logo.png'} alt="Company Logo Short" width={40} height={40} className="block h-9 w-9 sm:h-10 sm:w-10 lg:hidden" priority />
                    <Image src={'/logo-full.svg'} alt="Company Logo Full" width={130} height={40} className="hidden lg:block h-9 sm:h-10 w-auto" priority />
                </Link>
            </div>

            <div className="flex flex-grow min-w-0 justify-center px-1 sm:px-2">
                <Searchbar />
            </div>

            <div className="flex items-center flex-shrink-0 gap-1 sm:gap-2">
                {isAuthenticated ? (
                    <SettingsProvider>
                        <Navbar />
                        <NotificationBell />
                        <HeaderAvatarComponent />
                    </SettingsProvider>
                ) : status === 'loading' ? (
                    <>
                        <Skeleton className="h-9 w-24 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-full" />
                    </>
                ) : (
                    <>
                        <SignInButton />
                        <ModeToggle />
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;