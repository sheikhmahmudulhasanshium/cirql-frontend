import Image from "next/image";
// Assuming logo.png is a more compact/square version, e.g., 48x48px or similar
// Assuming logo-full.svg is your horizontal logo, e.g., 185x90px

import Navbar from "./navbar"
import { ModeToggle } from "@/components/mode-toggle"

const Header = () => {
    return (
        <div className="flex h-20 px-4 items-center justify-between w-full shadow-lg bg-primary-foreground dark:bg-primary-foreground">
            <a href="/" aria-label="Go to homepage">
                {/** Small Logo - Visible by default, hidden on lg screens and up */}
                <Image
                    src={'/logo.png'}
                    alt="Company Logo Short"
                    // Example: if logo.png is 48x48px
                    width={52}
                    height={52}
                    className="block h-16 w-16 lg:hidden" // Displayed at 40x40px
                    priority
                />

                {/** Full Logo - Hidden by default, visible on lg screens and up */}
                <Image
                    src={'/logo-full.svg'} // Your SVG logo
                    alt="Company Logo Full"
                    // Example: if your SVG is designed at 185x90
                    width={200}
                    height={100}
                    // Tailwind classes for display:
                    // - `hidden`: hides this image by default.
                    // - `lg:block`: makes it visible as a block element on `lg` screens and wider.
                    // - `h-16`: **INCREASED HEIGHT** (e.g., 4rem or 64px). Adjust as needed.
                    // - `w-auto`: allows the width to scale automatically.
                    className="hidden h-20 w-auto lg:block" // <--- CHANGED h-12 to h-16
                    priority
                />
            </a>

            <Navbar/>
            <ModeToggle/>
            
        </div>
    );
}

export default Header;