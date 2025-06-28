// app/(routes)/log-in/2fa/page.tsx
'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, User } from '@/components/contexts/AuthContext';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { defaultRedirectPath } from '@/lib/auth-routes';

const OTP_LIFESPAN = 120; // 2 minutes in seconds

function Verify2faContent() {
  const router = useRouter();
  const { state, dispatch } = useAuth();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(OTP_LIFESPAN);

  useEffect(() => {
    // Redirect if not in the correct state
    if (state.status !== 'loading' && state.status !== '2fa_required') {
      router.push('/sign-in');
    }
  }, [state.status, router]);

  useEffect(() => {
    // Timer countdown logic
    if (timer > 0) {
      const interval = setInterval(() => { setTimer(t => t - 1); }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6 || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      // FIX: The API endpoint now correctly identifies the user from the partial token
      // which is automatically included by the apiClient interceptor.
      const response = await apiClient.post('/auth/2fa/verify-code', { code });
      
      const { accessToken, user } = response.data as { accessToken: string, user: User };
      dispatch({ type: 'LOGIN', payload: { token: accessToken, user } });
      toast.success('Successfully authenticated!');

      // Redirect logic after successful login
      const redirectPath = localStorage.getItem('preLoginRedirectPath') || defaultRedirectPath;
      localStorage.removeItem('preLoginRedirectPath');
      router.push(redirectPath);

    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      let errorMessage = 'An unknown error occurred.';
      if (axiosError.response) {
        errorMessage = axiosError.response.data.message || 'Invalid or expired code.';
      }
      setError(errorMessage);
      toast.error('Authentication Failed', { description: errorMessage });
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (state.status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading Session...</div>;
  }

  // A safety net redirect
  if (state.status !== '2fa_required') {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>
  }

  const isExpired = timer <= 0;
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 dark:bg-gradient-to-bl dark:from-teal-300 dark:to-blue-900 bg-gradient-to-tr from-25% to-teal-900 from-blue-950">
      <main className="flex flex-col items-center justify-center w-full max-w-md p-8 space-y-6">
        <Link href={'/'}>
            <Image src="/banner.svg" alt="Cirql Logo" width={400} height={200} className="mb-4"/>
        </Link>
        <div className="text-center">
            <h1 className="text-2xl font-bold text-shadow-accent text-shadow-2xs">Two-Factor Verification</h1>
            <p className="mt-2 text-muted-foreground">
              A 6-digit code has been sent to your email.
            </p>
        </div>
        {error && (
            <div className="relative w-full rounded-lg border border-destructive p-4 text-destructive [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4">
                <AlertTriangle className="h-4 w-4" />
                <h5 className="mb-1 font-medium leading-none tracking-tight pl-6">Authentication Error</h5>
                <div className="text-sm [&_p]:leading-relaxed pl-6">{error}</div>
            </div>
        )}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
                <Label htmlFor="2fa-code" className="sr-only">Verification Code</Label>
                <Input
                    id="2fa-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    required
                    minLength={6}
                    maxLength={6}
                    autoComplete="one-time-code"
                    className="text-center text-lg tracking-widest"
                    disabled={isLoading || isExpired}
                />
            </div>
            <div className={`flex items-center justify-center gap-2 text-sm ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                <Clock className="h-4 w-4" />
                <span>
                    {isExpired ? 'Code has expired' : `Code expires in: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
                </span>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isLoading || code.length !== 6 || isExpired}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : 'Verify & Sign In'}
            </Button>
        </form>
        <SignOutButton variant="link" className="text-sm">
            {isExpired ? "Get a new code (Sign in again)" : "Start Over"}
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