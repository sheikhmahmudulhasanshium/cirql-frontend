// components/providers/basic-page-provider.tsx
'use client';

import React, { ReactNode } from 'react';

interface BasicPageProviderProps {
    // title?: string; // Removed: Handled by Next.js metadata
    // description?: string; // Removed: Handled by Next.js metadata
    // icon?: string; // Removed: Handled by Next.js metadata
    header?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
}

const BasicPageProvider: React.FC<BasicPageProviderProps> = ({
    header,
    footer,
    children,
}) => {
    // The useEffect hook that manipulated document.title, meta description, and icon has been removed.
    // Next.js metadata API in page.tsx or layout.tsx will handle this.

    return (
        <>
            {header}
            <main className="flex-grow w-full">
                {children}
            </main>
            {footer}
        </>
    );
};

export default BasicPageProvider;