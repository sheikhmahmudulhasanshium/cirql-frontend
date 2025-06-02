"use client";

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Link from 'next/link';
import { useAuth } from "@/components/contexts/AuthContext";
import Image from "next/image";
function SignInContent() {
  const { isAuthenticated, isLoading: authContextIsLoading } = useAuth(); // Renamed isLoading for clarity
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authContextIsLoading && isAuthenticated) {
      const callbackUrlQuery = searchParams.get('callbackUrl');
      console.log("SignInPage: Already authenticated, redirecting...");
      router.push(callbackUrlQuery || '/home');
    }
  }, [isAuthenticated, authContextIsLoading, router, searchParams]);

  const handleGoogleLogin = () => {
    const backendUrlForAuth = process.env.NEXT_PUBLIC_BACKEND_URL; // Moved inside for fresh read
    if (!backendUrlForAuth) {
      console.error("SignInPage Error: NEXT_PUBLIC_BACKEND_URL is not configured.");
      alert("Configuration error. Unable to initiate login. Please contact support.");
      return;
    }

    const googleAuthInitiateUrl = `${backendUrlForAuth}/auth/google`;
    const frontendTokenCallbackUrl = `${window.location.origin}/auth/google/callback`;

    const statePayload = {
      finalRedirectUri: frontendTokenCallbackUrl,
      // returnToPath: searchParams.get('returnTo') || '/dashboard', // Example for future
    };
    const encodedState = encodeURIComponent(JSON.stringify(statePayload));

    window.location.href = `${googleAuthInitiateUrl}?state=${encodedState}`;
  };

  if (authContextIsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Authenticating...</div>;
  }
  // If authenticated and effect hasn't redirected yet (e.g., during initial render after auth)
  if (isAuthenticated) {
     return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
  }

  const errorParam = searchParams.get('error');
  let errorMessage = 'An unknown error occurred. Please try again.';
  if (errorParam) {
    switch (errorParam) {
      case 'authenticationFailedAfterOAuth':
        errorMessage = 'Authentication process failed after connecting with Google.';
        break;
      case 'tokenGenerationFailed':
        errorMessage = 'Could not complete sign-in. Please try again.';
        break;
      case 'missing_token_in_callback':
        errorMessage = 'Authentication callback was incomplete. Please try signing in again.';
        break;
      case 'token_processing_failed':
        errorMessage = 'There was an issue processing your login. Please try again.';
        break;
      // Add more specific error cases from your backend if needed
    }
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 dark:bg-gradient-to-bl dark:from-teal-300 dark:to-blue-900 bg-gradient-to-tr from-25% to-teal-900 from-blue-950">
      <main className="flex flex-col items-center justify-center w-full max-w-md p-8 space-y-8">
        <Link href={'/'}>
                   <Image src="/banner.svg" alt="Cirql Logo" width={400} height={200} className="mb-6" /> 

        </Link>
        <div className="text-center">
          {/* Optional: Add your logo here */}
          <h1 className="text-4xl font-bold">Sign In to CiRQL</h1>
          <p className="mt-2 text-muted-foreground">Access your account or join the community.</p>
        </div>
        {errorParam && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md w-full text-center">
            {errorMessage}
          </div>
        )}
        <Button onClick={handleGoogleLogin} size="lg" className="w-full">
          <Chrome className="mr-2 h-5 w-5" /> Sign in with Google
        </Button>
        <p className="text-xs text-center text-muted-foreground px-8">
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