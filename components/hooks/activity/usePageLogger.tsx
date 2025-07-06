'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/contexts/AuthContext';
import apiClient from '@/lib/apiClient';
import { useDebounce } from '../use-debounce'; // Assuming you have this from a previous implementation

export const usePageLogger = () => {
  const { state } = useAuth();
  const isAuthenticated = state.status === 'authenticated';
  const pathname = usePathname();

  // Use the useDebounce hook to prevent spamming the API on every path change.
  // We'll only send an update after the user has stayed on a path for 3 seconds.
  const debouncedPathname = useDebounce(pathname, 3000);
  const lastLoggedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only run this logic if the user is authenticated and the debounced path has changed.
    if (isAuthenticated && debouncedPathname !== lastLoggedPath.current) {
      // Prevent logging the same path twice in a row
      lastLoggedPath.current = debouncedPathname;

      // Don't log internal Next.js or API-like routes
      if (debouncedPathname.startsWith('/_next') || debouncedPathname.startsWith('/api')) {
        return;
      }

      console.log(`[PageLogger] Logging new page view: ${debouncedPathname}`);

      apiClient.post('/activity/page-view', { url: debouncedPathname })
        .catch(err => {
          // We can fail silently here as this is a background task.
          console.error(`[PageLogger] Failed to log page view:`, err);
        });
    }
  }, [isAuthenticated, debouncedPathname]); // Effect runs when the user's auth status or debounced path changes
};