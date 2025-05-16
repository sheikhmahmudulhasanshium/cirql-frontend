// app/(routes)/components/navbar.tsx
import { Button } from "@/components/ui/button";
import { navbarMenu } from "@/lib/menu"; // Imports navbarMenu and implicitly uses NavMenu type
import Link from "next/link";
import React from "react";

const Navbar = () => {
    return (
        <nav className="flex items-center gap-0.5 sm:gap-1"> {/* Spacing between icons */}
            {navbarMenu.map((menuItem) => ( // menuItem is inferred as NavMenu from lib/menu.tsx
                <Link
                    key={menuItem.href}
                    href={menuItem.href}
                    title={menuItem.label || ''} // Add title for accessibility
                    className="flex items-center"
                >
                    <Button
                        variant={'ghost'}
                        size={'icon'}
                        className="rounded-full text-foreground/80 hover:text-foreground hover:bg-accent dark:hover:bg-slate-700"
                    >
                        {/*
                         * Check if menuItem.icon is a valid React element.
                         * This is important because icon is typed as ReactNode.
                         */}
                        {React.isValidElement(menuItem.icon) ? (
                            React.cloneElement(
                                // CRITICAL FIX:
                                // Assert that menuItem.icon is a ReactElement
                                // whose props can include 'className'.
                                // This helps TypeScript understand the shape of P in ReactElement<P>.
                                menuItem.icon as React.ReactElement<{ className?: string }>,
                                { className: "h-8 w-8 sm:h-10 sm:w-10" } // Apply new className
                            )
                        ) : (
                            // Fallback if icon is not an element (e.g., string, null)
                            // Though in your case, it's always an element from Lucide.
                            menuItem.icon
                        )}
                    </Button>
                </Link>
            ))}
        </nav>
    );
}

export default Navbar;