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
import { NotificationBell } from "./notification-bell";
import { usePageLogger } from "@/components/hooks/activity/usePageLogger"; // --- Import the new hook ---

const Header = () => {
    const { state } = useAuth();
    const { status } = state;
    const isAuthenticated = status === 'authenticated';
    
    // --- Call the hook here. It will run in the background for any authenticated user. ---
    usePageLogger();

    return (
        <header className="flex h-16 sm:h-20 px-2 md:px-4 lg:px-6 items-center w-full shadow-md dark:shadow-gray-700/50 bg-background gap-2 sm:gap-3 md:gap-4 ">
            <div className="flex-shrink-0">
                <Link href="/home" aria-label="Go to homepage" className="flex items-center">
                    <Image src={'/logo.png'} alt="Company Logo Short" width={40} height={40} className="block h-9 w-9 sm:h-10 sm:w-10 lg:hidden" priority />
                    <Image src={'/logo-full.svg'} alt="Company Logo Full" width={130} height={40} className="hidden lg:block h-9 sm:h-10 w-auto" priority />
                </Link>
            </div>

            <div className="flex flex-grow min-w-0 justify-center px-1 sm:px-2">
                <Searchbar />
            </div>

            <div className="flex items-center flex-shrink-0 gap-1 sm:gap-2">
                {isAuthenticated ? (
                    <>
                        <Navbar />
                        <NotificationBell />
                        <HeaderAvatarComponent />
                    </>
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