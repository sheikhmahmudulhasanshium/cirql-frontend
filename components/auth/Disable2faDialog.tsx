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
import { Loader2, MailCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface Disable2faDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const Disable2faDialog = ({ isOpen, onClose, onSuccess }: Disable2faDialogProps) => {
  const [step, setStep] = useState<'initial' | 'verify'>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setStep('initial');
    setIsLoading(false);
    setCode('');
    setError(null);
  };
  
  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleRequestCode = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/2fa/request-disable-code');
      toast.success("Verification Code Sent", {
        description: "Please check your email for a 6-digit code."
      });
      setStep('verify');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to send code. Please try again.';
      setError(errorMessage);
      toast.error('Could not send code', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/2fa/disable', { code });
      toast.success('Two-Factor Authentication has been disabled.');
      onSuccess(); // Refreshes user data
      handleClose(); // Resets and closes dialog
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred.';
      setError(errorMessage);
      toast.error('Verification Failed', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        {step === 'initial' && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm 2FA Deactivation</DialogTitle>
              <DialogDescription>
                This is a sensitive action. To continue, we need to verify it&apos;s you by sending a code to your registered email address.
              </DialogDescription>
            </DialogHeader>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter className='pt-4'>
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
              <Button variant="destructive" onClick={handleRequestCode} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
                Send Verification Code
              </Button>
            </DialogFooter>
          </>
        )}
        {step === 'verify' && (
           <>
            <DialogHeader>
              <DialogTitle>Enter Verification Code</DialogTitle>
              <DialogDescription>
                Enter the 6-digit code we sent to your email to finalize deactivation. The code will expire in 2 minutes.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                    id="verification-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    maxLength={6}
                    autoComplete="one-time-code"
                    className="text-center text-lg tracking-widest"
                    disabled={isLoading}
                />
                {error && <p className="text-sm text-destructive pl-1">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
              <Button variant="destructive" onClick={handleDisable} disabled={isLoading || code.length !== 6}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailCheck className="mr-2 h-4 w-4" />}
                Verify & Disable 2FA
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};