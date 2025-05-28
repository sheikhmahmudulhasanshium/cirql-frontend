// app/(routes)/signout/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Assuming this is your shadcn/ui button
import { useAuth } from '@/components/contexts/AuthContext';

const SignOutPage = () => {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth(); // Get logout function and auth status

  useEffect(() => {
    if (isAuthenticated) { // Only perform logout actions if the user is currently authenticated
      console.log("Performing sign out...");
      logout(); // This will clear localStorage, token, user state, and redirect via AuthContext
    } else {
      // If user is already signed out (e.g., manually navigated here), just redirect
      console.log("User already signed out or not authenticated, redirecting...");
      router.push('/sign-in'); // Or your desired page for already signed-out users
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Depend on isAuthenticated to re-run if it changes

  // The AuthContext's logout function will handle the redirect.
  // This page essentially becomes a "processing logout..." page.
  // If the user lands here and is already logged out, the effect will redirect them.

  // It might be better to not show UI if the redirect is quick,
  // or show a more generic "You have been signed out" if needed.
  // For now, let's assume the redirect in AuthContext is fast enough.

  if (!isAuthenticated) { // If after the effect, user is no longer authenticated
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
            <h1 className="text-2xl font-bold">You have been signed out</h1>
            <p className="mt-3 text-lg">You will be redirected shortly.</p>
            <div className="mt-6">
              <Button onClick={() => router.push('/sign-in')}>
                Go to Sign In
              </Button>
            </div>
          </main>
        </div>
    );
  }

  // If still authenticated for some reason (shouldn't happen if logout works)
  // or while the effect is processing initially
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Signing Out...</h1>
      <p className="mt-3 text-lg">Please wait.</p>
    </div>
  );
};

export default SignOutPage;