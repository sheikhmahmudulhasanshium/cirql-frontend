// cirql-frontend/app/auth/google/callback/page.tsx
"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/(routes)/sign-in/context';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading: authContextIsLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Prevent running if auth is already established or context is still loading initial state
    if (isAuthenticated || authContextIsLoading) {
      if (isAuthenticated && !authContextIsLoading) {
          // Already authenticated and context loaded, redirect away from callback
          console.log("Already authenticated, redirecting from callback.");
          router.push('/home');
      }
      return;
    }

    const token = searchParams.get('token');
    const error = searchParams.get('error'); // Check for errors passed from backend

    if (error) {
      console.error('Error received from backend during OAuth callback:', error);
      // Redirect to login page with error message
      router.push(`/sign-in?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token) {
      console.log('Token received on frontend callback:', token);
      login(token)
        .then(() => {
          console.log('Login successful via AuthContext, navigating to dashboard.');
          // You can also check for a 'returnTo' param from state if you implement that
          // const returnTo = searchParams.get('returnTo');
          // router.push(returnTo || '/dashboard');
          router.push('/home');
        })
        .catch((err) => {
          console.error('AuthContext login failed after receiving token:', err);
          router.push('/sign-in?error=token_processing_failed');
        });
    } else if (!authContextIsLoading) { // Only if no token and auth context isn't busy
      console.warn('No token or error found in callback URL, and auth context not loading. Redirecting to login.');
      router.push('/sign-in?error=missing_token_in_callback');
    }
  }, [searchParams, login, router, authContextIsLoading, isAuthenticated]); // Added isAuthenticated

  // Display a loading message while processing
  if (authContextIsLoading && !searchParams.get('token') && !searchParams.get('error')) {
     return <div>Verifying authentication status...</div>;
  }
  if (searchParams.get('token') || searchParams.get('error')) {
     return <div>Processing authentication... Please wait.</div>;
  }

  // Fallback if somehow landed here without token/error and not loading
  return <div>Finalizing...</div>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Callback...</div>}>
      <AuthCallbackHandler />
    </Suspense>
  );
}