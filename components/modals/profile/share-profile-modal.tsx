'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClipboardCopy, X } from 'lucide-react';
import { toast } from 'sonner';

interface ShareProfileModalProps {
  userId: string;
  onClose: () => void;
}

export const ShareProfileModal = ({ userId, onClose }: ShareProfileModalProps) => {
  const profileUrl = `https://cirql.vercel.app/profile/${userId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(profileUrl);
    toast.success('Profile link copied to clipboard!');
    onClose(); // Close modal after copying
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative z-50 w-full max-w-md m-4 p-6 rounded-xl border bg-popover shadow-2xl animate-in fade-in-90 slide-in-from-top-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-popover-foreground">Share Profile</p>
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
        <p className="text-sm text-muted-foreground mb-3">Copy the link to share this profile.</p>
        <div className="flex gap-2 items-center mt-4">
          <Input
            readOnly
            value={profileUrl}
            className="text-sm flex-1 bg-muted border-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
          <Button
            variant="default"
            className="flex items-center gap-2 px-4"
            onClick={handleCopy}
            aria-label="Copy profile link"
          >
            <ClipboardCopy className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};
