'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { sendFriendRequest } from './use-profile-action';

interface AddFriendModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

export const AddFriendModal: React.FC<AddFriendModalProps> = ({
  userId,
  userName,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await sendFriendRequest(userId);
      onClose();
    } catch {
      // FIX: Removed the unused 'error' variable.
      // The error is already handled by the toast in the action hook.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative bg-popover p-6 rounded-lg max-w-md w-full border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Send Friend Request</h2>
           <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="mb-6 text-muted-foreground">
          Do you want to send a friend request to{' '}
          <span className="font-semibold text-foreground">{userName}</span>?
        </p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};