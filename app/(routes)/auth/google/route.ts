// app/(routes)/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';
import passport from '@/app/(routes)/auth/google'; // Your Passport config

export async function GET(req: NextRequest) {
  // Line 6: @ts-expect-error REMOVED because the following line is no longer an error
  return passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, new NextResponse());
}