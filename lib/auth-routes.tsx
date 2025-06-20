// lib/auth-routes.ts (CORRECTED)

/**
 * An array of routes that are accessible to the public.
 * These do not require authentication.
 */
export const publicRoutes: string[] = [
  '/',
  '/about',
  '/faq',
  '/contacts',
  '/sitemap.xml',
  '/privacy-policy',
  '/terms-and-conditions',
  '/sign-out',
  '/search',
  '/profile/[id]', // Dynamic public route
];

/**
 * An array of routes that are explicitly protected.
 * These require authentication and take priority over publicRoutes.
 */
export const protectedRoutes: string[] = [
  '/home',
  '/profile/me', // The exception to the dynamic public route
  '/settings',    // <-- MOVED HERE
  // Add other pages that need auth, like '/dashboard'
];

/**
* An array of routes used for authentication.
* Logged-in users will be redirected from these routes to the defaultRedirectPath.
*/
export const authRoutes: string[] = [
  '/sign-in',
  '/auth/google/callback',
  '/log-in',
  // We will handle /log-in/verify-2fa separately using its own constant
];

/**
 * The path for the 2FA verification page.
 */
export const twoFactorAuthRoute: string = '/log-in/verify-2fa';

/**
 * The default redirect path after a user logs in.
 */
export const defaultRedirectPath: string = '/home';