// src/components/auth/Enable2faDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/apiClient';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface Enable2faDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const Enable2faDialog = ({ isOpen, onClose, onSuccess }: Enable2faDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      // This is the ONLY endpoint we should be calling.
      await apiClient.post('/auth/2fa/enable');
      toast.success('Two-Factor Authentication Enabled', {
        description: 'The next time you sign in, a code will be sent to your email.',
      });
      onSuccess(); // This calls refreshUser
      onClose();   // This closes the dialog
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error('Could not enable 2FA', { description: error.response?.data?.message || 'Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enable Two-Factor Authentication?</DialogTitle>
          <DialogDescription>
            This will add an extra layer of security to your account. Upon your next sign-in, a 6-digit code will be sent to your registered email address to verify your identity.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleEnable} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, Enable 2FA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};