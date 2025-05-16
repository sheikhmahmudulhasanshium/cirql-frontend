import { footerLinks } from "@/lib/menu";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    

    return (
        <footer className="bg-accent dark:bg-accent-dark text-accent-foreground dark:text-accent-foreground-dark w-full  ">
            {/* 
                Consider if `absolute` positioning is truly needed. 
                If the page content can be shorter than the viewport, `absolute` works.
                If content always fills or exceeds viewport, `relative` (default) or `sticky` might be better.
                The h-[60vh] is quite large for a footer, ensure this is intended.
            */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col justify-between items-center min-h-[50vh] sm:min-h-[40vh] md:min-h-[30vh] lg:h-[auto] text-center">
                {/* Section 1: Logo and Tagline */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6 md:mb-8">
                    <Image
                        src="/logo-full.svg"
                        alt="Cirql Full Logo" // More descriptive alt text
                        width={200} // Intrinsic width of the SVG
                        height={100} // Intrinsic height of the SVG
                        priority // Keep if it's critical, usually not for footers
                        className="w-48 h-24 md:w-56 md:h-28" // Styled size
                    />
                    <p className="font-light text-base sm:text-lg md:text-xl text-muted-foreground dark:text-muted-foreground-dark">
                        - Stay In the Loop.
                    </p>
                </div>

                {/* Section 2: Description */}
                <p className="max-w-xl md:max-w-2xl text-sm sm:text-base text-foreground/80 dark:text-foreground-dark/80 mb-6 md:mb-8 leading-relaxed">
                    A modern take on community and messaging, Cirql helps you stay connected through voice, chat, and private group networks — all in one private space.
                </p>

                {/* Section 3: Navigation Links */}
                <nav className="flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 mb-6 md:mb-8 px-4">
                    {footerLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm sm:text-base text-primary dark:text-primary-dark hover:text-primary/80 dark:hover:text-primary-dark/80 hover:underline transition-colors duration-150"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Section 4: Copyright */}
                {/* mt-auto can be used if you want this to stick to the bottom of the flex container if space allows */}
                <small className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground-dark mt-4 md:mt-auto">
                    &copy; CIRQL {currentYear}. All rights reserved.
                </small>
            </div>
        </footer>
    );
};

export default Footer;