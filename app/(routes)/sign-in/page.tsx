// cirql-frontend/app/(routes)/sign-in/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react"; // Or your preferred Google icon
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Link from 'next/link';
import { useAuth } from "@/components/contexts/AuthContext";

function SignInContent() {
  const backendUrlForAuth = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // To read error messages from URL

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const callbackUrlQuery = searchParams.get('callbackUrl'); // If you implement a returnTo feature
      router.push(callbackUrlQuery || '/home');
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  const handleGoogleLogin = () => {
    if (!backendUrlForAuth) {
      console.error("Frontend Error: NEXT_PUBLIC_BACKEND_URL is not configured.");
      // Optionally: show an error message to the user
      alert("Configuration error. Unable to initiate login.");
      return;
    }

    const googleAuthInitiateUrl = `${backendUrlForAuth}/auth/google`;
    // This is the URL on THIS frontend that will process the token from the backend.
    const frontendTokenCallbackUrl = `${window.location.origin}/auth/google/callback`;

    const statePayload = {
      finalRedirectUri: frontendTokenCallbackUrl,
      // Example: if you want to redirect user back to a specific page after successful login
      // returnToPath: searchParams.get('returnTo') || '/dashboard',
    };
    const encodedState = encodeURIComponent(JSON.stringify(statePayload));

    window.location.href = `${googleAuthInitiateUrl}?state=${encodedState}`;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Authenticating...</div>;
  }
  if (isAuthenticated) { // Should be handled by useEffect, but as a safeguard
     return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
  }

  const errorParam = searchParams.get('error');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <main className="flex flex-col items-center justify-center w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Sign In to Cirql</h1>
          <p className="mt-2 text-muted-foreground">Access your account or join the community.</p>
        </div>
        {errorParam && (
          <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-md">
            Login failed: {errorParam === 'authenticationFailedAfterOAuth' ? 'Authentication process failed.' : 
                            errorParam === 'tokenGenerationFailed' ? 'Could not complete sign-in.' :
                            'An unknown error occurred.'}
          </div>
        )}
        <Button onClick={handleGoogleLogin} size="lg" className="w-full">
          <Chrome className="mr-2 h-5 w-5" /> Sign in with Google
        </Button>
        <p className="text-xs text-center text-muted-foreground px-8">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
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