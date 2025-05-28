// cirql-frontend/app/(routes)/home/navbar.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/contexts/AuthContext"; // Assuming @/components/ is correct
import Link from "next/link"; // Import Link for navigation

const Navbar = () => {
  const { isAuthenticated, user, logout: contextLogout } = useAuth();
  const router = useRouter();

  // Corrected arrow function syntax
  const handleLogout = () => {
    // Option 1: Directly call context logout
    // contextLogout(); // This will redirect via AuthContext

    // Option 2: Navigate to the /signout page (current implementation)
    // This is good if the /signout page itself needs to do something more or show a specific UI.
    // The /signout page then calls contextLogout().
    router.push('/sign-out');
  };

  if (!isAuthenticated) {
    // Render something for non-authenticated users, e.g., a sign-in link
    return (
      <nav className="flex items-center justify-between p-4 bg-background shadow">
        <Link href="/" className="text-lg font-semibold">
          Cirql
        </Link>
        <Link href="/sign-in">
          <Button variant="outline">Sign In</Button>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-background shadow">
      <div>
        {/* You can add a link to the home page or user profile here */}
        <Link href="/home" className="text-lg font-semibold">
          Hello, {user?.firstName || user?.email}
        </Link>
      </div>
      <Button onClick={handleLogout} variant="outline">
        Logout
      </Button>
    </nav>
  );
};

export default Navbar;