// app/(routes)/auth/google/callback/page.tsx
'use client';

import { useEffect, Suspense, useRef, useCallback } from 'react'; // Import useCallback
import { useSearchParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { useAuth, User } from '@/components/contexts/AuthContext';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dispatch } = useAuth();
  const hasProcessed = useRef(false);

  // --- FIX: Wrap in useCallback for a stable function reference ---
  const handleLoginSuccess = useCallback((user: User) => {
    if (user.accountStatus === 'banned') {
      router.push('/banned');
    } else {
      const redirectPath = localStorage.getItem('preLoginRedirectPath') || '/home';
      localStorage.removeItem('preLoginRedirectPath');
      router.push(redirectPath);
    }
  }, [router]); // router is a stable dependency

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
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      apiClient.get('/auth/status')
        .then(response => {
          const user = response.data as User;
          dispatch({ type: 'LOGIN', payload: { token, user } });
          toast.success('Successfully logged in!');
          handleLoginSuccess(user);
        })
        .catch(err => {
          console.error("Failed to fetch user status after callback", err);
          toast.error('Login failed. Please try again.');
          dispatch({ type: 'LOGOUT' });
          router.push('/sign-in');
        });
    } else {
      toast.error('Authentication callback was incomplete.');
      router.push('/sign-in');
    }
    // --- FIX: Add handleLoginSuccess to dependency array ---
  }, [router, searchParams, dispatch, handleLoginSuccess]);

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