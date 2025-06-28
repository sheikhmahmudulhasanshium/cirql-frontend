// src/components/auth/Disable2faDialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/apiClient';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Disable2faDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const Disable2faDialog = ({ isOpen, onClose, onSuccess }: Disable2faDialogProps) => {
  const { state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');

  // --- THIS IS THE KEY LOGIC ---
  // Check if the authenticated user has a password set.
  // We need to cast the user object to include the optional password field for this check.
  const hasPassword = !!(state.user as { password?: string })?.password;

  const handleDisable = async () => {
    // If the user has a password, it must not be empty.
    if (hasPassword && !password) {
        toast.error("Password is required to disable 2FA.");
        return;
    }
    
    setIsLoading(true);
    try {
      // The DTO on the backend is flexible. We can send an empty password
      // field or a filled one. The backend will handle it correctly.
      await apiClient.post('/auth/2fa/disable', { password });
      
      toast.success('Two-Factor Authentication has been disabled.');
      setPassword('');
      onSuccess();
      onClose();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage = error.response?.data?.message || 'Could not disable 2FA. Please try again.';
      toast.error('Action Failed', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Disable Two-Factor Authentication?</DialogTitle>
          <DialogDescription>
            {hasPassword
              ? "For your security, please enter your current password to confirm this action."
              : "Are you sure you want to disable the extra security layer on your account?"}
          </DialogDescription>
        </DialogHeader>

        {/* Conditionally render the password input */}
        {hasPassword && (
          <div className="py-4 space-y-2">
              <Label htmlFor="password-confirm">Current Password</Label>
              <Input
                  id="password-confirm"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
              />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="destructive" onClick={handleDisable} disabled={isLoading || (hasPassword && !password)}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, Disable 2FA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};