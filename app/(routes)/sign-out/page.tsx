'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/components/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const SignOutPage = () => {
  // --- START OF FIX: Only destructure 'dispatch' as 'state' is not used. ---
  const { dispatch } = useAuth();
  // --- END OF FIX ---
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    // This effect runs only once to perform the logout and force a hard redirect.
    if (!hasLoggedOut.current) {
      hasLoggedOut.current = true;
      
      // Dispatch the logout action to clear the token from localStorage.
      dispatch({ type: 'LOGOUT' });

      // Force a full page reload to the sign-in page.
      // This wipes all application state from memory, guaranteeing a clean session.
      window.location.href = '/sign-in';
    }
  }, [dispatch]); // The dependency array ensures this runs only once.

  // Display a consistent loading state while the logout and redirect are processed.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gradient-to-bl dark:from-teal-300 dark:to-blue-900 bg-gradient-to-tr from-25% to-teal-900 from-blue-950">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <h1 className="text-2xl font-bold mt-4 text-white">Signing Out...</h1>
    </div>
  );
};

export default SignOutPage;