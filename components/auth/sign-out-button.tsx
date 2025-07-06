"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";
import { useAuth } from "../contexts/AuthContext";

type ButtonProps = ComponentProps<typeof Button>;

interface SignOutButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  children?: React.ReactNode;
  onSignOut?: () => void;
}

export const SignOutButton = ({ children, onSignOut, ...props }: SignOutButtonProps) => {
  const { dispatch } = useAuth();

  const handleSignOut = () => {
    // First, dispatch the logout action to clear the token from localStorage
    // and update the auth context state.
    dispatch({ type: 'LOGOUT' });

    // Optional: Call any additional callback functions.
    if (onSignOut) {
      onSignOut();
    }

    // --- START OF FIX ---
    // Force a full page reload by setting the window location.
    // This wipes all application state from memory, ensuring a clean slate for the next user.
    window.location.href = '/sign-in';
    // --- END OF FIX ---
  };

  return (
    <Button onClick={handleSignOut} {...props}>
      {children || "Sign Out"}
    </Button>
  );
};