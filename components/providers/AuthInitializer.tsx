'use client';

import { useEffect, useState, useCallback, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useAuth, User } from '../contexts/AuthContext';
import apiClient from '@/lib/apiClient';
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
import { NotificationProvider } from '../contexts/NotificationContext';
import { NavigationStats } from '../hooks/activity/useNavigationStatus';
// --- START OF FIX: Import the NavigationStats type ---
// --- END OF FIX ---

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
    <div className="bg-background text-foreground flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
);

const AuthenticatedAppManager = ({ children }: { children: ReactNode }) => {
  return (
    <SettingsProvider>
      <NotificationProvider>
        <TakeABreakReminder />
        {children}
      </NotificationProvider>
    </SettingsProvider>
  );
};

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { state, dispatch } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- START OF FIX: This function now handles the complete post-login flow ---
  const handleLoginSuccess = useCallback(async (user: User) => {
    if (user.accountStatus === 'banned') {
      router.push('/banned');
      return;
    }

    try {
      // Fetch the latest navigation stats right after login
      const { data: navStats } = await apiClient.get<NavigationStats>('/activity/me/navigation-stats');
      
      // Prioritize the last visited URL from the stats.
      // Fallback to preLoginRedirectPath, then to the default.
      const lastVisited = navStats?.lastVisitedUrl;
      const preLoginRedirect = localStorage.getItem('preLoginRedirectPath');

      let redirectPath = defaultRedirectPath;

      // Logic: If there's a specific page they were trying to access before login, that takes highest priority.
      // Otherwise, use their last known location.
      if (preLoginRedirect) {
        redirectPath = preLoginRedirect;
      } else if (lastVisited) {
        redirectPath = lastVisited;
      }

      localStorage.removeItem('preLoginRedirectPath');
      window.location.assign(redirectPath);

    } catch (error) {
      console.error("Failed to get navigation stats on login, redirecting to default.", error);
      // If fetching stats fails for any reason, gracefully fall back to the default path.
      localStorage.removeItem('preLoginRedirectPath');
      window.location.assign(defaultRedirectPath);
    }
  }, [router]);
  // --- END OF FIX ---

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
  if (state.status === 'authenticated' && state.user?.accountStatus === 'banned' && pathname !== '/banned') {
    return <FullScreenLoader message="Redirecting..." />;
  }
  if (state.status === 'authenticated' && authRoutes.includes(pathname)) {
    return <FullScreenLoader message="Login successful, redirecting..." />;
  }
  if (state.status === '2fa_required' && pathname !== twoFactorAuthRoute) {
    return <FullScreenLoader message="Redirecting to 2FA verification..." />;
  }
  
  if (state.status === 'authenticated') {
    return <AuthenticatedAppManager>{children}</AuthenticatedAppManager>;
  }

  return <>{children}</>;
};