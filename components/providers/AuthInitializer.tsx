'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { usePathname, useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useAuth } from '../contexts/AuthContext';

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { state, dispatch } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (state.status !== 'loading') {
      return;
    }

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

  useEffect(() => {
    if (!isMounted || state.status === 'loading') {
      return;
    }

    const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/auth/google/callback');
    // --- THIS IS THE FIX ---
    const is2faVerifyPage = pathname.startsWith('/log-in/verify-2fa');

    switch (state.status) {
      case 'unauthenticated':
        if (!isAuthPage && !is2faVerifyPage && pathname !== '/') {
          router.push('/sign-in');
        }
        break;
      case 'authenticated':
        if (isAuthPage || is2faVerifyPage) {
          router.push('/home');
        }
        break;
      case '2fa_required':
        if (!is2faVerifyPage) {
            // --- AND THIS IS THE FIX ---
          router.push('/log-in/verify-2fa');
        }
        break;
    }
  }, [state.status, pathname, router, isMounted]);

  if (!isMounted || state.status === 'loading') {
    return <main className="bg-background text-foreground"><p className="text-center p-10">Loading Application...</p></main>;
  }

  return <>{children}</>;
};