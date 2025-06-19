// src/components/auth/SignInButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;

interface SignInButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  children?: React.ReactNode;
  signInPageUrl?: string;
  onBeforeNavigate?: () => void;
}

export const SignInButton = ({
  children,
  signInPageUrl = "/sign-in",
  onBeforeNavigate,
  ...props
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
      {children || "Sign In"}
    </Button>
  );
};