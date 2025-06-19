'use client';

import { useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { useAuth } from '@/components/contexts/AuthContext';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dispatch } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    hasProcessed.current = true;

    if (error) {
      toast.error(`Authentication failed: ${error}. Please try again.`);
      router.push('/sign-in');
      return;
    }

    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      apiClient.get('/auth/status')
        .then(response => {
          const user = response.data;
          dispatch({ type: 'LOGIN', payload: { token, user } });
          router.push('/home');
          toast.success('Successfully logged in!');
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