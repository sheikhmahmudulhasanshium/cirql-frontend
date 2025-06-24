// app/(routes)/log-in/verify-2fa/page.tsx
'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/contexts/AuthContext';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { defaultRedirectPath } from '@/lib/auth-routes';

function Verify2faContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, dispatch } = useAuth();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl && state.status !== '2fa_required') {
      dispatch({ type: 'SET_PARTIAL_LOGIN', payload: { token: tokenFromUrl } });
    }
  }, [searchParams, dispatch, state.status]);

  useEffect(() => {
    if (state.status !== 'loading' && state.status !== '2fa_required') {
      router.push('/sign-in');
      toast.error('Invalid session state for 2FA verification.');
    }
  }, [state.status, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6 || isLoading) return;
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/2fa/authenticate', { code });
      const { accessToken, user } = response.data;

      // --- THIS IS THE KEY CHANGE ---
      // 1. Get the saved path from localStorage, or use the default.
      const redirectPath = localStorage.getItem('preLoginRedirectPath') || defaultRedirectPath;
      // 2. IMPORTANT: Clean up the stored path.
      localStorage.removeItem('preLoginRedirectPath');
      
      dispatch({ type: 'LOGIN', payload: { token: accessToken, user } });

      // 3. Redirect to the determined path.
      router.push(redirectPath);
      toast.success('Successfully authenticated!');
    } catch {
      toast.error('Invalid or expired authentication code. Please try again.');
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (state.status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading Session...</div>;
  }

  if (state.status !== '2fa_required') {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 dark:bg-gradient-to-bl dark:from-teal-300 dark:to-blue-900 bg-gradient-to-tr from-25% to-teal-900 from-blue-950">
      <main className="flex flex-col items-center justify-center w-full max-w-md p-8 space-y-6">
        <Link href={'/'}>
            <Image src="/banner.svg" alt="Cirql Logo" width={400} height={200} className="mb-4"/>
        </Link>
        <div className="text-center">
            <h1 className="text-2xl font-bold text-shadow-accent text-shadow-2xs">Two-Factor Authentication</h1>
            <p className="mt-2 text-muted-foreground">
              Enter the code from your authenticator app or a backup code.
            </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
                <Label htmlFor="2fa-code" className="sr-only">Authentication Code</Label>
                <Input
                    id="2fa-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.trim())}
                    placeholder="123456"
                    required
                    minLength={6}
                    maxLength={8}
                    autoComplete="one-time-code"
                    className="text-center text-lg tracking-widest"
                    disabled={isLoading}
                />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isLoading || code.length < 6}>
                {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
        </form>
        <SignOutButton variant="link" className="text-sm">
            Start Over
        </SignOutButton>
      </main>
    </div>
  );
}

export default function Verify2faPage() {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading 2FA...</div>}>
        <Verify2faContent />
      </Suspense>
    );
}