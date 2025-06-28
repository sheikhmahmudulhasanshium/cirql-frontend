// src/lib/auth-routes.ts
/**
 * An array of routes that are accessible to the public.
 * These do not require authentication.
 */
export const publicRoutes: string[] = [
  '/',
  '/about',
  '/faq',
  '/contacts',
  '/banned',
  '/sitemap.xml',
  '/privacy-policy',
  '/terms-and-conditions',
  '/sign-out',
  '/search',
  '/profile/[id]',
  '/announcements',
  '/announcements/[id]',
  '/users/directory',
];

/**
 * An array of routes that are explicitly protected.
 * These require authentication and take priority over publicRoutes.
 */
export const protectedRoutes: string[] = [
  '/home',
  '/profile/me',
  '/settings',
  '/admin/analytics',
  '/notifications',
];

/**
* An array of routes used for authentication.
* Logged-in users will be redirected from these routes to the defaultRedirectPath.
*/
export const authRoutes: string[] = [
  '/sign-in',
  '/auth/google/callback',
  '/log-in',
  '/reset-password',
];

/**
 * The path for the 2FA verification page.
 */
export const twoFactorAuthRoute: string = '/log-in/2fa';

/**
 * The default redirect path after a user logs in.
 */
export const defaultRedirectPath: string = '/home';
