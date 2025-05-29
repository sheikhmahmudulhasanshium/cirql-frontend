"use client";

import { useEffect, Suspense, useRef } from 'react'; // Added useRef
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/contexts/AuthContext';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading: authContextIsLoading, isAuthenticated } = useAuth();
  const processingToken = useRef(false); // Flag to prevent duplicate processing

  useEffect(() => {
    // If already authenticated and context is loaded, redirect away
    if (isAuthenticated && !authContextIsLoading) {
      console.log("AuthCallbackHandler: Already authenticated, redirecting to /home.");
      router.push('/home');
      return;
    }

    // If auth context is still loading its initial state, wait.
    if (authContextIsLoading && !searchParams.get('token') && !searchParams.get('error')) {
      console.log("AuthCallbackHandler: AuthContext is loading initial state, waiting...");
      return;
    }

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      if (processingToken.current) return; // Already processing an error
      processingToken.current = true;
      console.error('AuthCallbackHandler: Error from backend OAuth:', error);
      router.push(`/sign-in?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token) {
      if (processingToken.current) return; // Already processing this token
      processingToken.current = true;

      console.log('AuthCallbackHandler: Token received:', token);
      login(token)
        .then(() => {
          console.log('AuthCallbackHandler: AuthContext login successful, navigating to /home.');
          router.push('/home');
        })
        .catch((err) => {
          console.error('AuthCallbackHandler: AuthContext login failed after token:', err);
          router.push('/sign-in?error=token_processing_failed');
        })
        .finally(() => {
          // processingToken.current = false; // Reset if needed for re-entry, but typically callback is one-shot
        });
    } else if (!authContextIsLoading && !processingToken.current) {
      // Only redirect if no token/error, auth context isn't loading, and not already processing.
      console.warn('AuthCallbackHandler: No token or error, redirecting to /sign-in.');
      router.push('/sign-in?error=missing_token_in_callback');
    }
  }, [searchParams, login, router, authContextIsLoading, isAuthenticated]);

  // Display a loading message while processing
  if (authContextIsLoading && !searchParams.get('token') && !searchParams.get('error')) {
     return <div>Verifying authentication status...</div>;
  }
  // If token or error is present, means processing is happening or about to happen via useEffect
  if (searchParams.get('token') || searchParams.get('error')) {
     return <div>Processing authentication... Please wait.</div>;
  }

  // Fallback if somehow landed here without token/error and not loading
  // and useEffect hasn't redirected yet.
  return <div>Finalizing...</div>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Callback...</div>}>
      <AuthCallbackHandler />
    </Suspense>
  );
}