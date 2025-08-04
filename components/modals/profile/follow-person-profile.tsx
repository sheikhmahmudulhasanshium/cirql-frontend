'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface FollowPersonModalProps {
  onClose: () => void;
}

export const FollowPersonModal: React.FC<FollowPersonModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Follow Person</h2>
        <p className="mb-6">This is a dummy follow person modal.</p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};
