import { footerLinks } from "@/lib/menu";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-accent dark:bg-accent-dark text-accent-foreground dark:text-accent-foreground-dark w-full pt-20 sm:pt-24 md:pt-28">
            {/* Custom Shape Divider */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
                <svg
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block w-[calc(100%+1.3px)] h-[150px] sm:h-[120px] md:h-[100px] fill-background dark:fill-background-dark"
                >
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
                </svg>
            </div>

            {/* Footer Content */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col justify-between items-center text-center">
                {/* Section 1: Logo and Tagline */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6 md:mb-8 pt-8">
                    <Image
                        src="/logo-full.svg"
                        alt="Cirql Full Logo"
                        width={200}
                        height={100}
                        priority
                        className="w-48 h-24 md:w-56 md:h-28"
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
                    {footerLinks.map((link) =>
                        link.href === "/sitemap.xml" ? (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm sm:text-base text-primary dark:text-primary-dark hover:text-primary/80 dark:hover:text-primary-dark/80 hover:underline transition-colors duration-150"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {link.label}
                            </a>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                passHref
                                className="text-sm sm:text-base text-primary dark:text-primary-dark hover:text-primary/80 dark:hover:text-primary-dark/80 hover:underline transition-colors duration-150"
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                </nav>

                {/* Section 4: Copyright */}
                <small className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground-dark mt-4 md:mt-auto">
                    &copy; CIRQL {currentYear}. All rights reserved.
                </small>
            </div>
        </footer>
    );
};

export default Footer;