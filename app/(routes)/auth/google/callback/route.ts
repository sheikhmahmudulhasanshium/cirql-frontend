// app/(routes)/auth/google/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import passport from '@/app/(routes)/auth/google'; // Your Passport config
import jwt from 'jsonwebtoken';

// app/(routes)/auth/google/callback/route.ts
// ...
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables. Please add it to your .env.local file.');
}
// ...
// Define a user type based on what your GoogleStrategy returns
interface AuthenticatedUser {
  googleId: string;
  displayName: string;
  email?: string;
}

export async function GET(req: NextRequest) {
  return new Promise<NextResponse>((resolve) => {
    // Line 20: @ts-expect-error REMOVED because the following line is no longer an error
    passport.authenticate('google', { session: false, failureRedirect: '/signin?error=google_auth_failed' },
      (err: Error | null, user: AuthenticatedUser | false, info: object | string | undefined) => {
      if (err || !user) {
        console.error('Google authentication error:', err, info);
        return resolve(NextResponse.redirect(new URL('/signin?error=authentication_failed', req.url)));
      }

      const payload = {
        id: user.googleId,
        email: user.email,
        displayName: user.displayName,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      const redirectUrl = new URL('/auth/handle-token', req.url);
      redirectUrl.searchParams.set('token', token);
      
      return resolve(NextResponse.redirect(redirectUrl));

    // Line 42: @ts-expect-error REMOVED because the following line is no longer an error
    })(req, new NextResponse());
  });
}