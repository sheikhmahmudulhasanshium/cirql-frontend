// components/providers/AuthInitializer.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { usePathname, useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useAuth, User } from '../contexts/AuthContext';
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

  const handleLoginSuccess = useCallback((user: User) => {
    if (user.accountStatus === 'banned') {
      router.push('/banned');
    } else {
      const redirectPath = localStorage.getItem('preLoginRedirectPath') || defaultRedirectPath;
      localStorage.removeItem('preLoginRedirectPath');
      router.push(redirectPath);
    }
  }, [router]);

  useEffect(() => {
    if (state.status !== 'loading') return;
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) {
        dispatch({ type: 'SET_STATUS', payload: 'unauthenticated' });
        return;
      }
      try {
        const response = await apiClient.get('/auth/status');
        const user = response.data as User;
        dispatch({ type: 'LOGIN', payload: { token: storedToken, user } });
        handleLoginSuccess(user);
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            if (payload.isTwoFactorAuthenticationComplete === false) {
              dispatch({ type: 'SET_PARTIAL_LOGIN', payload: { token: storedToken } });
              return;
            }
          } catch { /* ignore */ }
        }
        dispatch({ type: 'LOGOUT' });
      }
    };
    initializeAuth();
  }, [state.status, dispatch, handleLoginSuccess]);

  useEffect(() => {
    if (!isMounted || state.status === 'loading') {
      return;
    }

    const isAuthPage = authRoutes.includes(pathname);
    const is2FAPage = pathname === twoFactorAuthRoute;
    const isBannedPage = pathname === '/banned';

    if (state.status === 'authenticated') {
      if (state.user?.accountStatus === 'banned') {
        if (!isBannedPage) router.push('/banned');
      } else {
        if (isAuthPage || is2FAPage || isBannedPage) router.push(defaultRedirectPath);
      }
      return;
    }

    if (state.status === '2fa_required') {
      if (!is2FAPage) router.push(twoFactorAuthRoute);
      return;
    }

    if (state.status === 'unauthenticated') {
      const isExplicitlyProtected = protectedRoutes.includes(pathname);
      const isConsideredPublic = !isExplicitlyProtected && publicRoutes.some(route =>
        route === pathname || isDynamicRouteMatch(pathname, route)
      );
      if (!isConsideredPublic && !isAuthPage && !is2FAPage) {
        localStorage.setItem('preLoginRedirectPath', pathname);
        router.push('/sign-in');
      }
    }
  }, [state.status, state.user, pathname, router, isMounted]);

  if (!isMounted || state.status === 'loading') {
    return <main className="bg-background text-foreground"><p className="text-center p-10">Loading Application...</p></main>;
  }

  if (state.status === 'authenticated' && state.user?.accountStatus === 'banned' && pathname !== '/banned') {
    return null; // Prevent flicker of protected pages for a banned user during redirect
  }
  
  return <>{children}</>;
};