'use client';

import React, { useEffect, ReactNode } from 'react';

interface BasicPageProviderProps {
    title?: string;
    description?: string;
    icon?: string;
    header?: ReactNode;
    footer?: ReactNode;
    children: ReactNode; // Explicitly define children
}

const BasicPageProvider: React.FC<BasicPageProviderProps> = ({
    title,
    description,
    icon,
    header,
    footer,
    children,
}) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }

        // Update or create meta description tag
        let metaDescription = document.querySelector('meta[name="description"]');
        if (description) {
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', description);
        } else if (metaDescription) {
            // Optional: remove if no description provided for this page,
            // or let it fall back to a global one if set in RootLayout's metadata
            // metaDescription.remove();
        }

        // Update or create link icon tag
        // This is a simplified version. Multiple icon links can exist (shortcut icon, apple-touch-icon, etc.)
        // For robust icon management, Next.js's metadata API in page.tsx or layout.tsx is preferred for static icons.
        // This client-side update is good for dynamic changes or if you prefer this pattern.
        if (icon) {
            let linkIcon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]') as HTMLLinkElement | null;
            if (linkIcon) {
                linkIcon.href = icon;
            } else {
                linkIcon = document.createElement('link');
                linkIcon.rel = 'icon';
                linkIcon.href = icon;
                document.head.appendChild(linkIcon);
            }
        }
    }, [title, description, icon]);

    return (
        <>
            {header}
            {/* 
              The main tag here acts as the primary content area.
              flex-grow ensures it takes available space if header/footer are present.
              The div inside BasicPageProvider in your Home component will be the direct child here.
            */}
            <main className="flex-grow w-full">
                {children}
            </main>
            {footer}
        </>
    );
};

export default BasicPageProvider;