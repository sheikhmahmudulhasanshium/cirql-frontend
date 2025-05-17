// app/(routes)/auth/logout/route.ts
import { type NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_req: NextRequest) {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  return response;
}