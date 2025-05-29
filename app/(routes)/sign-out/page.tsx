// app/(routes)/signout/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/contexts/AuthContext';

const SignOutPage = () => {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Performing sign out via /sign-out page...");
      logout(); // This will redirect via AuthContext
    } else if (!isAuthenticated && !logout /* to avoid race conditions if logout is not stable, but it is */) {
      // This condition needs care, if already signed out, AuthContext's router.push in logout won't be hit from here
      console.log("User already signed out or not authenticated when hitting /sign-out, redirecting...");
      router.push('/sign-in');
    }
    // The dependency array for this useEffect should include all reactive values used inside.
    // logout is memoized, router is stable from next/navigation.
  }, [isAuthenticated, logout, router]); // Added logout and router to dependencies

  // UI shown while AuthContext's logout (which includes redirect) is processing or if already signed out
  if (!isAuthenticated) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
            <h1 className="text-2xl font-bold">You have been signed out</h1>
            <p className="mt-3 text-lg">You will be redirected to the sign-in page.</p>
            <div className="mt-6">
              <Button onClick={() => router.push('/sign-in')}>
                Go to Sign In
              </Button>
            </div>
          </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Signing Out...</h1>
      <p className="mt-3 text-lg">Please wait.</p>
    </div>
  );
};

export default SignOutPage;