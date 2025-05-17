// app/(routes)/components/Header.tsx
import Image from "next/image";
import Navbar from "./navbar"; // This will now be the Navbar with icons only
import Searchbar from "./searchbar"; // Import the dedicated Searchbar
import Link from "next/link";
// import { ModeToggle } from "@/components/mode-toggle"; // Assuming you might add this back

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
                        width={130} // Adjust to your logo's aspect ratio
                        height={40} // Adjust to your logo's aspect ratio
                        className="hidden lg:block h-9 sm:h-10 w-auto" // Adjust size
                        priority
                    />
                </Link>
            </div>

            {/* Searchbar Area - flex-grow allows it to take available space */}
            {/* min-w-0 is important for flex items that might overflow */}
            {/* justify-center will center the searchbar if it doesn't reach its max-width */}
            <div className="flex flex-grow min-w-0 justify-center px-1 sm:px-2">
                <Searchbar />
            </div>

            {/* Navigation & Actions Area - flex-shrink-0 prevents shrinking */}
            <div className="flex items-center flex-shrink-0 gap-1 sm:gap-2">
                <Navbar /> {/* This is Navbar.tsx, now containing only icons */}
                {/* <ModeToggle /> */}
                {/* You could add other items here like a profile dropdown */}
                {/* Example:
                <Button variant="ghost" size="icon" className="rounded-full">
                    <UserCircle2 className="h-6 w-6" />
                </Button>
                */}
            </div>
        </header>
    );
}

export default Header;