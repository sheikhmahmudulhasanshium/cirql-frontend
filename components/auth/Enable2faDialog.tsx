'use client';

import { useState } from 'react';
import Image from 'next/image';
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
import { toast } from 'sonner';
import { Loader2, CheckCircle, Copy, AlertTriangle } from 'lucide-react';

interface Enable2faDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'generate' | 'verify' | 'backupCodes' | 'error';

export const Enable2faDialog = ({ isOpen, onClose, onSuccess }: Enable2faDialogProps) => {
  const [step, setStep] = useState<Step>('generate');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/auth/2fa/generate');
      setQrCodeDataUrl(response.data.qrCodeDataUrl);
      setStep('verify');
    } catch {
      setError('Could not generate a QR code. Please try again.');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length < 6) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/auth/2fa/enable', { code: verificationCode });
      setBackupCodes(response.data.backupCodes);
      setStep('backupCodes');
    } catch {
      setError('The verification code is invalid or expired. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAndSuccess = () => {
    onSuccess();
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Backup codes copied to clipboard!');
  };

  if (isOpen && step === 'generate' && !isLoading) {
    handleGenerate();
  }

  const renderContent = () => {
    switch (step) {
      case 'generate':
        // FIX: Added DialogHeader with Title and Description for accessibility.
        return (
          <>
            <DialogHeader>
              <DialogTitle>Generating Secure Key</DialogTitle>
              <DialogDescription>
                Please wait while we create your unique two-factor authentication key.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </>
        );
      case 'verify':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Scan the QR code with your authenticator app, then enter the 6-digit code below.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6 py-4">
              {qrCodeDataUrl && <Image src={qrCodeDataUrl} alt="2FA QR Code" width={200} height={200} />}
              <div className="w-full max-w-xs space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
                 {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleVerify} disabled={isLoading || verificationCode.length !== 6}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Enable
              </Button>
            </DialogFooter>
          </>
        );
      case 'backupCodes':
        return (
           <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><CheckCircle className="text-green-500" /> 2FA Enabled Successfully!</DialogTitle>
              <DialogDescription>
                Save these backup codes in a secure place. They can be used to access your account if you lose your device.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4 font-mono text-center">
              {backupCodes.map((code) => <div key={code} className="p-2 bg-muted rounded-md">{code}</div>)}
            </div>
            <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => copyToClipboard(backupCodes.join('\n'))}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Codes
                </Button>
                <Button onClick={handleCloseAndSuccess}>I have saved my codes</Button>
            </DialogFooter>
          </>
        );
      case 'error':
        // FIX: Added DialogHeader with Title and Description for accessibility.
        return (
            <>
              <DialogHeader>
                <DialogTitle className="text-destructive">An Error Occurred</DialogTitle>
                <DialogDescription>
                  {error || 'Could not complete the request. Please close this dialog and try again.'}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center p-4 space-y-4 text-center">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                  <DialogFooter>
                      <Button variant="outline" onClick={onClose}>Close</Button>
                  </DialogFooter>
              </div>
            </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">{renderContent()}</DialogContent>
    </Dialog>
  );
};