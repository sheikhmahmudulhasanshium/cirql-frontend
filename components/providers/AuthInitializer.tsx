// components/AuthInitializer.tsx (FINAL VERSION)

'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { usePathname, useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
  publicRoutes,
  protectedRoutes,
  authRoutes,
  twoFactorAuthRoute,
  defaultRedirectPath
} from '@/lib/auth-routes';

/**
 * Helper function to check if a given pathname matches a dynamic route pattern.
 * e.g., matches '/profile/123' with '/profile/[id]'
 */
function isDynamicRouteMatch(pathname: string, pattern: string): boolean {
  if (!pattern.includes('[')) return false; // Not a dynamic pattern

  const pathSegments = pathname.split('/').filter(Boolean);
  const patternSegments = pattern.split('/').filter(Boolean);

  if (pathSegments.length !== patternSegments.length) return false;

  return patternSegments.every((segment, i) => {
    return segment.startsWith('[') || segment === pathSegments[i];
  });
}

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { state, dispatch } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect to initialize auth state from token (remains unchanged)
  useEffect(() => {
    if (state.status !== 'loading') return;
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) {
        dispatch({ type: 'SET_STATUS', payload: 'unauthenticated' });
        return;
      }
      try {
        const response = await apiClient.get('/auth/status', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        dispatch({ type: 'LOGIN', payload: { token: storedToken, user: response.data } });
      } catch (error) {
        const err = error as AxiosError;
        if (err.response?.status === 401) {
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            if (payload.isTwoFactorAuthenticated === false) {
              dispatch({ type: 'SET_PARTIAL_LOGIN', payload: { token: storedToken } });
              return;
            }
          } catch { /* ignore parse error */ }
        }
        dispatch({ type: 'LOGOUT' });
      }
    };
    initializeAuth();
  }, [state.status, dispatch]);

  // Main redirection logic effect
  useEffect(() => {
    if (!isMounted || state.status === 'loading') {
      return;
    }

    const isAuthPage = authRoutes.includes(pathname);
    const is2FAPage = pathname === twoFactorAuthRoute;

    // A page is considered public IF AND ONLY IF:
    // 1. It is NOT in the explicit `protectedRoutes` list.
    // 2. It IS in the `publicRoutes` list (or matches a dynamic public route).
    const isExplicitlyProtected = protectedRoutes.includes(pathname);
    const isConsideredPublic = !isExplicitlyProtected && publicRoutes.some(route =>
      route === pathname || isDynamicRouteMatch(pathname, route)
    );

    // --- Redirection Rules ---

    // 1. For fully authenticated users
    if (state.status === 'authenticated') {
      if (isAuthPage || is2FAPage) {
        router.push(defaultRedirectPath);
      }
      return;
    }

    // 2. For users who must complete 2FA
    if (state.status === '2fa_required') {
      if (!is2FAPage) {
        router.push(twoFactorAuthRoute);
      }
      return;
    }

    // 3. For unauthenticated users
    if (state.status === 'unauthenticated') {
      // If the page is NOT public and NOT an auth-related page, it's a protected route.
      // Redirect them to sign in.
      if (!isConsideredPublic && !isAuthPage && !is2FAPage) {
        router.push('/sign-in');
      }
    }
  }, [state.status, pathname, router, isMounted]);

  if (!isMounted || state.status === 'loading') {
    return <main className="bg-background text-foreground"><p className="text-center p-10">Loading Application...</p></main>;
  }

  return <>{children}</>;
};