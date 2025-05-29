"use client";

import React from "react";
import { useAuth } from "@/components/contexts/AuthContext";
import { Button } from "@/components/ui/button";
// Corrected: Import ButtonProps from the same location as Button
import type { ComponentProps } from "react"; // Or import ButtonProps directly if available and preferred

// Define ButtonProps based on React's ComponentProps if not directly exported,
// or use the exported type if available.
// For shadcn/ui, ButtonProps might not be explicitly exported, so using ComponentProps<'button'> is a robust way.
// However, if your ui/button.tsx *does* export ButtonProps, use that.
type ButtonProps = ComponentProps<typeof Button>;


interface SignOutButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> { // Omit onClick and children
  children?: React.ReactNode;
  onSignOut?: () => void;
}

export const SignOutButton = ({ children, onSignOut, ...props }: SignOutButtonProps) => {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <Button onClick={handleSignOut} {...props}>
      {children || "Sign Out"}
    </Button>
  );
};