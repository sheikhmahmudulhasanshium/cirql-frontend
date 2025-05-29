"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

// Define ButtonProps based on React's ComponentProps for strong typing
type ButtonProps = ComponentProps<typeof Button>;

interface SignInButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  children?: React.ReactNode;
  signInPageUrl?: string;     // Optional: custom URL for the sign-in page
  onBeforeNavigate?: () => void; // Optional callback to execute before navigation
}

export const SignInButton = ({
  children,
  signInPageUrl = "/sign-in", // Default sign-in page URL
  onBeforeNavigate,
  ...props // Spread the rest of the ButtonProps (e.g., variant, size, className)
}: SignInButtonProps) => {
  const router = useRouter();

  const handleSignIn = () => {
    if (onBeforeNavigate) {
      onBeforeNavigate();
    }
    router.push(signInPageUrl);
  };

  return (
    <Button onClick={handleSignIn} {...props}>
      {children || "Sign In"} {/* Default text if no children are provided */}
    </Button>
  );
};