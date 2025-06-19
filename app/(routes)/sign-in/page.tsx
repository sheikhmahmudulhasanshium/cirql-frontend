'use client';

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense, useCallback } from "react";
import Link from 'next/link';
import Image from "next/image";
import { useAuth } from "@/components/contexts/AuthContext";

const generateGoogleAuthUrl = (backendUrl: string, state?: object): string => {
  const googleAuthInitiateUrl = `${backendUrl}/auth/google`;
  const encodedState = state ? encodeURIComponent(JSON.stringify(state)) : '';
  return `${googleAuthInitiateUrl}?state=${encodedState}`;
};

function SignInContent() {
  const { state } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (state.status === 'authenticated') {
      router.push('/home');
    }
  }, [state.status, router]);

  const handleGoogleLogin = useCallback(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("SignInPage Error: NEXT_PUBLIC_BACKEND_URL is not configured.");
      alert("Configuration error. Please contact support.");
      return;
    }

    const frontendFinalCallbackUrl = `${window.location.origin}/auth/google/callback`;
    const statePayload = {
      finalRedirectUri: frontendFinalCallbackUrl,
    };
    
    const authUrl = generateGoogleAuthUrl(backendUrl, statePayload);
    window.location.href = authUrl;
  }, []);

  if (state.status === 'loading' || state.status === 'authenticated') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const errorParam = searchParams.get('error');
  // --- THIS IS THE FIX ---
  const errorMessage: string | null = errorParam === 'authenticationFailed'
    ? 'Authentication failed. Please try again.'
    : errorParam === 'tokenGenerationFailed'
    ? 'Could not sign you in. Please try again later.'
    : null;
  // --- END OF FIX ---

  return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 dark:bg-gradient-to-bl dark:from-teal-300 dark:to-blue-900 bg-gradient-to-tr from-25% to-teal-900 from-blue-950">
        <main className="flex flex-col items-center justify-center w-full max-w-md p-8 space-y-8">
          <Link href={'/'}>
            <Image src="/banner.svg" alt="Cirql Logo" width={400} height={200} className="mb-6"/>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-shadow-accent text-shadow-2xs">Sign in to CiRQL</h1>
            <p className="mt-2 text-muted-foreground">Access your account or join the community.</p>
          </div>
          {errorMessage && (
              <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md w-full text-center">
                {errorMessage}
              </div>
          )}
          <Button onClick={handleGoogleLogin} size="lg" className="w-full">
            <Chrome className="mr-2 h-5 w-5"/> Sign in with Google
          </Button>
          <p className="text-xs text-center text-blue-950 px-8 text-shadow-accent text-shadow-2xs">
            By signing in, you agree to our{' '}
            <Link href="/terms-and-conditions" className="underline hover:text-primary">Terms of Service</Link> and{' '}
            <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
          </p>
        </main>
      </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Sign-In...</div>}>
      <SignInContent />
    </Suspense>
  );
}