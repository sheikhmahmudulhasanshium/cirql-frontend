'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Adjust the import path as needed

const SignOutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Remove the JWT from client-side storage
    // This example uses localStorage, you might use cookies
    localStorage.removeItem('jwt_token');

    // Optional: Redirect after a delay
    // const timer = setTimeout(() => {
    //   router.push('/signin'); // Redirect to sign-in page
    // }, 2000); // 2 second delay

    // return () => clearTimeout(timer); // Cleanup the timer
  }, [router]); // router dependency is fine, though not strictly necessary if not used inside useEffect for redirect

  const handleSignOutConfirm = () => {
    // Additional sign-out logic if needed (e.g., API call to invalidate token on server)
    // For this example, we've already cleared the token client-side in the useEffect.
    router.push('/signin'); // Redirect to sign-in page immediately on button click
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-2xl font-bold">Signing Out</h1>
        <p className="mt-3 text-lg">You have been signed out successfully.</p>
        <div className="mt-6">
          <Button onClick={handleSignOutConfirm}>
            Go to Sign In
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SignOutPage;