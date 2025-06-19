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

interface Disable2faDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const Disable2faDialog = ({ isOpen, onClose, onSuccess }: Disable2faDialogProps) => {
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleDisable = async () => {
    if (code.length < 6) return;
    setIsLoading(true);
    setError('');

    try {
      await apiClient.post('/auth/2fa/disable', { code });
      toast.success('Two-factor authentication has been disabled.');
      onSuccess();
      onClose();
    } catch {
      setError('Invalid authentication code. Please try again.');
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
            For your security, please enter a code from your authenticator app to confirm this action.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
            <Label htmlFor="disable-code">Authentication Code</Label>
            <Input
                id="disable-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={8}
                autoComplete="one-time-code"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleDisable} disabled={isLoading || code.length < 6}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Disable 2FA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};