// app/(routes)/components/Header.tsx
import Image from "next/image";
import Searchbar from "./searchbar"; // Import the dedicated Searchbar
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

const Header = () => {
    return (
        <header className="flex h-16 sm:h-20 px-2 md:px-4 lg:px-6 items-center w-full shadow-md dark:shadow-gray-700/50 bg-background gap-2 sm:gap-3 md:gap-4">
            {/* Logo Area - flex-shrink-0 prevents it from shrinking */}
            <div className="flex-shrink-0">
                <Link href="/" aria-label="Go to homepage" className="flex items-center">
                    <Image
                        src={'/logo.png'} // Ensure this is a small, square-ish logo
                        alt="Company Logo Short"
                        width={40}  // Adjust to your logo's aspect ratio
                        height={40} // Adjust to your logo's aspect ratio
                        className="block h-9 w-9 sm:h-10 sm:w-10 lg:hidden" // Adjust size
                        priority
                    />
                    <Image
                        src={'/logo-full.svg'} // Your horizontal SVG logo
                        alt="Company Logo Full"
                        width={132} // CRITICAL: Must match intrinsic aspect ratio of logo-full.svg
                        height={60} // CRITICAL: Must match intrinsic aspect ratio of logo-full.svg
                        // Option 1: Keep using Tailwind (preferred if aspect ratio props are correct)
                        // Ensure `h-16` and `w-auto` are active on lg. `sm:h-16` is fine.
                        className="hidden lg:block h-16 sm:h-16 w-auto"
                        // Option 2: Use style prop if warning persists despite correct aspect ratio & Tailwind
                        // style={{ height: '4rem', width: 'auto' }} // 4rem is h-16. Remove h-16 and w-auto from className if using this.
                        // className="hidden lg:block" // Use className only for visibility if using style prop for size
                        priority
                    />
                </Link>
            </div>

            {/* Searchbar Area - flex-grow allows it to take available space */}
            <div className="flex flex-grow min-w-0 justify-center px-1 sm:px-2">
                <Searchbar />
            </div>

            {/* Navigation & Actions Area - flex-shrink-0 prevents shrinking */}
            <div className="flex items-center flex-shrink-0 gap-1 sm:gap-2">
                  {/* Button for medium and larger screens */}
                    <Link href={'/sign-in'}>
                        <Button className="hidden md:inline-flex items-center">
                            <UserPlusIcon className=" h-4 w-4" />
                            Join to Community
                        </Button>

                        {/* Button for small screens (default) */}
                        <Button className="md:hidden inline-flex items-center">
                            <UserPlusIcon className=" h-4 w-4" />
                            Join
                        </Button>
                    </Link>
                  { <ModeToggle /> }
            </div>
        </header>
    );
}

export default Header;