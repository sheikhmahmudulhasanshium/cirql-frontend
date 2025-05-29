"use client";

import Link from "next/link";
//import { Button } from "@/components/ui/button"; // Keep if used for other buttons, or remove if only SignInButton is used
import { useAuth } from "@/components/contexts/AuthContext";
import { SignInButton } from "@/components/auth/sign-in-button";
import { SignOutButton } from "@/components/auth/sign-out-button";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Render for non-authenticated users
    return (
      <nav className="flex items-center justify-between p-4 bg-background shadow">
        <Link href="/" className="text-lg font-semibold">
          Cirql
        </Link>
        {/* Use the new SignInButton component */}
        <SignInButton variant="outline">
          Sign In
        </SignInButton>
        {/* Or if you want to use the default text "Sign In": */}
        {/* <SignInButton variant="outline" /> */}
      </nav>
    );
  }

  // Render for authenticated users
  return (
    <nav className="flex items-center justify-between p-4 bg-background shadow">
      <div>
        <Link href="/home" className="text-lg font-semibold">
          Hello, {user?.firstName || user?.email}
        </Link>
      </div>
      <SignOutButton variant="outline">
        Logout
      </SignOutButton>
    </nav>
  );
};

export default Navbar;