// app/(routes)/signout/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SignOutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        await fetch('/auth/logout', { // <--- UPDATED PATH
          method: 'POST',
        });
      } catch (error) {
        console.error('Error during server-side logout:', error);
      } finally {
        localStorage.removeItem('jwt_token');
      }
    };
    performSignOut();
  }, []);

  const handleGoToSignIn = () => {
    router.push('/signin');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-2xl font-bold">Signing Out</h1>
        <p className="mt-3 text-lg">You have been signed out successfully.</p>
        <div className="mt-6">
          <Button onClick={handleGoToSignIn}>
            Go to Sign In
          </Button>
        </div>
      </main>
    </div>
  );
};
export default SignOutPage;