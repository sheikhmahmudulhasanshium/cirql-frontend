// app/(routes)/auth/handle-token/page.tsx
'use client'; // Keep this if the whole page logic is client-side

import { useEffect, Suspense } from 'react'; // Import Suspense here
import { useRouter, useSearchParams } from 'next/navigation';

// A simple loading fallback component for the Suspense boundary
function AuthProcessing() {
  const router = useRouter();
  const searchParams = useSearchParams(); // This hook causes the need for Suspense

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('jwt_token', token);
      router.replace('/dashboard'); // Or wherever your app's main page is
    } else {
      console.error('No token found in URL.');
      router.replace('/signin?error=token_missing');
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p>Processing authentication...</p>
    </div>
  );
}


export default function HandleTokenPage() {
  return (
    // Suspense boundary around the component/logic that uses useSearchParams
    <Suspense fallback={<div className="flex min-h-screen flex-col items-center justify-center"><p>Loading...</p></div>}>
      <AuthProcessing />
    </Suspense>
  );
}