'use client';

import { useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth, User, Role } from '@/components/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { defaultRedirectPath } from '@/lib/auth-routes';

// --- START OF FIX: Define a specific type for the decoded JWT payload ---
interface DecodedJwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  isTwoFactorAuthenticationComplete: boolean;
  firstName?: string;
  lastName?: string;
  picture?: string;
  is2FAEnabled?: boolean;
  accountStatus?: 'active' | 'banned';
  banReason?: string;
  iat: number;
  exp: number;
}
// --- END OF FIX ---

// A simple function to decode the JWT payload without external libraries
// --- START OF FIX: Update the function's return type ---
function decodeJwtPayload(token: string): DecodedJwtPayload | null {
// --- END OF FIX ---
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}


function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dispatch } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (error) {
      toast.error(`Authentication failed: ${error}. Please try again.`);
      router.push('/sign-in');
      return;
    }

    if (!token) {
      toast.error('Authentication callback was incomplete.');
      router.push('/sign-in');
      return;
    }

    // The 'payload' variable is now strongly typed as DecodedJwtPayload | null
    const payload = decodeJwtPayload(token);

    if (!payload) {
      toast.error("Invalid authentication token received.");
      dispatch({ type: 'LOGOUT' });
      router.push('/sign-in');
      return;
    }

    if (payload.isTwoFactorAuthenticationComplete === false) {
      toast.info("Verification Required", { description: "Please check your email for a 6-digit code." });
      dispatch({ type: 'SET_PARTIAL_LOGIN', payload: { token } });
      return;
    }

    const user: User = {
      _id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      firstName: payload.firstName || '', 
      lastName: payload.lastName || '',
      picture: payload.picture || '',
      is2FAEnabled: payload.is2FAEnabled || false,
      accountStatus: payload.accountStatus || 'active',
      banReason: payload.banReason || undefined,
    };
    
    dispatch({ type: 'LOGIN', payload: { token, user } });
    toast.success('Successfully logged in!');
    
    const redirectPath = localStorage.getItem('preLoginRedirectPath') || defaultRedirectPath;
    localStorage.removeItem('preLoginRedirectPath');
    router.push(redirectPath);

  }, [router, searchParams, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="mt-4">Finalizing authentication...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
    return (
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-4">Loading callback...</p>
        </div>
      }>
        <AuthCallbackHandler />
      </Suspense>
    );
}