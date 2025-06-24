// components/providers/AuthInitializer.tsx

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

function isDynamicRouteMatch(pathname: string, pattern: string): boolean {
  if (!pattern.includes('[')) return false;
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

  // Effect to initialize auth state from token
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
            if (payload.isTwoFactorAuthenticationComplete === false) {
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
    const isExplicitlyProtected = protectedRoutes.includes(pathname);
    const isConsideredPublic = !isExplicitlyProtected && publicRoutes.some(route =>
      route === pathname || isDynamicRouteMatch(pathname, route)
    );

    // --- Redirection Rules ---
    if (state.status === 'authenticated') {
      if (isAuthPage || is2FAPage) {
        router.push(defaultRedirectPath);
      }
      return;
    }

    if (state.status === '2fa_required') {
      if (!is2FAPage) {
        router.push(twoFactorAuthRoute);
      }
      return;
    }

    if (state.status === 'unauthenticated') {
      if (!isConsideredPublic && !isAuthPage && !is2FAPage) {
        // --- THIS IS THE KEY CHANGE ---
        // Before redirecting to sign-in, save the current path.
        localStorage.setItem('preLoginRedirectPath', pathname);
        router.push('/sign-in');
      }
    }
  }, [state.status, pathname, router, isMounted]);

  if (!isMounted || state.status === 'loading') {
    return <main className="bg-background text-foreground"><p className="text-center p-10">Loading Application...</p></main>;
  }

  return <>{children}</>;
};