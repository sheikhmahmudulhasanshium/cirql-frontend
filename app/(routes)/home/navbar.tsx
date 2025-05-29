"use client";

// Removed useRouter from here as it's no longer directly used for logout navigation
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/contexts/AuthContext";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  // const router = useRouter(); // No longer needed here if SignOutButton handles it

  // handleLogout function is no longer needed as SignOutButton encapsulates the logic
  // const handleLogout = () => {
  //   router.push('/sign-out');
  // };

  if (!isAuthenticated) {
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
        <Link href="/home" className="text-lg font-semibold">
          Hello, {user?.firstName || user?.email}
        </Link>
      </div>
      {/* Use the new SignOutButton component */}
      <SignOutButton variant="outline">
        Logout
      </SignOutButton>
    </nav>
  );
};

export default Navbar;