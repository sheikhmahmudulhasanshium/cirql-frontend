'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/contexts/AuthContext';

const SignOutPage = () => {
  const router = useRouter();
  // FIX: Destructure 'state' and 'dispatch' from the useAuth hook.
  const { state, dispatch } = useAuth();
  const { status } = state;
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const isLoggingOut = useRef(false); // Prevent multiple logout calls

  useEffect(() => {
    if (isLoading) {
      // Wait for auth context to load before deciding
      return;
    }

    if (isAuthenticated && !isLoggingOut.current) {
      isLoggingOut.current = true;
      console.log("SignOutPage: Performing sign out...");
      // FIX: Call dispatch with the LOGOUT action instead of a logout function.
      dispatch({ type: 'LOGOUT' });
      // The AuthInitializer will handle the redirect to /sign-in
    } else if (!isAuthenticated && !isLoggingOut.current) {
      // If already signed out or never authenticated, and not in the process of logging out
      console.log("SignOutPage: User already signed out or not authenticated, redirecting to /sign-in.");
      router.push('/sign-in');
    }
  }, [isAuthenticated, dispatch, router, isLoading]); // Changed logout to dispatch

  // UI shown while AuthContext's logout is processing or if already signed out by the time this renders
  if (isLoading || isLoggingOut.current) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen  dark:bg-gradient-to-bl dark:from-teal-300 dark:to-blue-900 bg-gradient-to-tr from-25% to-teal-900 from-blue-950">
        <h1 className="text-2xl font-bold">Signing Out...</h1>
        <p className="mt-3 text-lg">Please wait.</p>
      </div>
    );
  }

  // Fallback UI if user somehow lands here already signed out and useEffect hasn't redirected yet
  return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2  dark:bg-gradient-to-bl dark:from-teal-300 dark:to-blue-900 bg-gradient-to-tr from-25% to-teal-900 from-blue-950">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-2xl font-bold">You have been signed out</h1>
          <p className="mt-3 text-lg">Redirecting to the sign-in page.</p>
          <div className="mt-6">
            <Button onClick={() => router.push('/sign-in')}>
              Go to Sign In
            </Button>
          </div>
        </main>
      </div>
  );
};

export default SignOutPage;