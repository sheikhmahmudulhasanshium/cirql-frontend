// src/components/providers/AuthInitializer.tsx
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
import { Loader2 } from 'lucide-react';
import { SettingsProvider } from '../hooks/settings/get-settings';
import { TakeABreakReminder } from '@/app/(routes)/components/take-a-break-reminder';

function isDynamicRouteMatch(pathname: string, pattern: string): boolean {
  if (!pattern.includes('[')) return false;
  const pathSegments = pathname.split('/').filter(Boolean);
  const patternSegments = pattern.split('/').filter(Boolean);
  if (pathSegments.length !== patternSegments.length) return false;
  return patternSegments.every((segment, i) => {
    return segment.startsWith('[') || segment === pathSegments[i];
  });
}

const FullScreenLoader = ({ message }: { message: string }) => (
    <main className="bg-background text-foreground flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">{message}</p>
    </main>
);

// THIS COMPONENT IS NO LONGER NEEDED, as we are moving the provider up.
// We can simplify and remove it.
/*
const AuthenticatedSessionManager = ({ children }: { children: ReactNode }) => {
  return (
    <SettingsProvider>
      <TakeABreakReminder />
      {children}
    </SettingsProvider>
  );
};
*/

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
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
            try {
                if (storedToken && storedToken.split('.').length === 3) {
                    const payload = JSON.parse(atob(storedToken.split('.')[1]));
                    if (payload.isTwoFactorAuthenticationComplete === false) {
                        dispatch({ type: 'SET_PARTIAL_LOGIN', payload: { token: storedToken } });
                        return;
                    }
                }
            } catch { /* ignore parsing errors, proceed to logout */ }
        }
        dispatch({ type: 'LOGOUT' });
      }
    };
    initializeAuth();
  }, [state.status, dispatch]);

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
        if (state.user && (isAuthPage || is2FAPage || isBannedPage)) {
            handleLoginSuccess(state.user);
        }
      }
      return;
    }

    if (state.status === '2fa_required') {
      if (!is2FAPage) router.push(twoFactorAuthRoute);
      return;
    }

    if (state.status === 'unauthenticated') {
      const isExplicitlyProtected = protectedRoutes.some(route =>
        pathname.startsWith(route) && (pathname.length === route.length || pathname[route.length] === '/')
      );
      
      const isPublic = publicRoutes.some(route =>
        route === pathname || isDynamicRouteMatch(pathname, route)
      );

      if (isExplicitlyProtected && !isPublic) {
        localStorage.setItem('preLoginRedirectPath', pathname);
        router.push('/sign-in');
      }
    }
  }, [state.status, state.user, pathname, router, isMounted, handleLoginSuccess]);

  if (!isMounted || state.status === 'loading') {
    return <FullScreenLoader message="Initializing Session..." />;
  }
  
  if (state.status === '2fa_required' && pathname !== twoFactorAuthRoute) {
    return <FullScreenLoader message="Redirecting to 2FA verification..." />;
  }

  if (state.status === 'authenticated' && state.user?.accountStatus === 'banned' && pathname !== '/banned') {
    return <FullScreenLoader message="Redirecting..." />;
  }
  
  // --- THIS IS THE FIX ---
  // Wrap ALL children with the SettingsProvider. The provider itself will handle
  // the logic of fetching data only when the user is authenticated.
  // The TakeABreakReminder must also be inside this provider to get the settings.
  return (
      <SettingsProvider>
        {state.status === 'authenticated' && <TakeABreakReminder />}
        {children}
      </SettingsProvider>
  );
};