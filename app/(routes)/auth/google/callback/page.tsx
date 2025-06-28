// app/(routes)/auth/google/callback/page.tsx
'use client';

import { useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { useAuth, User } from '@/components/contexts/AuthContext';
import { twoFactorAuthRoute } from '@/lib/auth-routes';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dispatch } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (error) {
      toast.error(`Authentication failed: ${error}. Please try again.`);
      router.push('/sign-in');
      return;
    }

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            // Check if the backend issued a partial 2FA token
            if (payload.isTwoFactorAuthenticationComplete === false) {
                toast.info("Verification Required", { description: "Please check your email for a 6-digit code." });
                dispatch({ type: 'SET_PARTIAL_LOGIN', payload: { token } });
                router.push(twoFactorAuthRoute);
                return;
            }

            // If it's a full token, proceed to fetch status and log in
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            apiClient.get('/auth/status')
                .then(response => {
                    const user = response.data as User;
                    dispatch({ type: 'LOGIN', payload: { token, user } });
                    toast.success('Successfully logged in!');
                    // The AuthInitializer will handle the final redirect
                })
                .catch(err => {
                    console.error("Failed to fetch user status after callback", err);
                    toast.error('Login failed. Please try again.');
                    dispatch({ type: 'LOGOUT' });
                    router.push('/sign-in');
                });

        // --- FIX: Removed the unused 'e' variable from the catch block ---
        } catch {
            toast.error("Invalid authentication token received.");
            dispatch({ type: 'LOGOUT' });
            router.push('/sign-in');
        }
    } else {
      toast.error('Authentication callback was incomplete.');
      router.push('/sign-in');
    }
  }, [router, searchParams, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      Finalizing authentication...
    </div>
  );
}

export default function AuthCallbackPage() {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <AuthCallbackHandler />
      </Suspense>
    );
}