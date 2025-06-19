// src/components/auth/SignOutButton.tsx
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
    // You can optionally inform the backend, but it's not strictly necessary.
    // apiClient.post('/auth/logout').catch(err => console.error("Backend logout failed"));
    
    dispatch({ type: 'LOGOUT' });
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