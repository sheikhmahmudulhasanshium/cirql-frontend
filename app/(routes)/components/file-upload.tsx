// src/components/file-upload.tsx
'use client';

import { useUploadThing } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/components/contexts/AuthContext';

interface UploadResponse {
  name: string;
  size: number;
  key: string;
  url: string;
}

interface FileUploadProps {
  endpoint: string;
  onUpload: (url: string) => void;
  currentUrl?: string | null;
}

export const FileUpload = ({ endpoint, onUpload, currentUrl }: FileUploadProps) => {
  // --- START OF FIX ---
  // 1. Get the authentication state, which includes the token.
  const { state: authState } = useAuth();

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    // 2. Pass the authorization token in the headers for the middleware to read.
    headers: {
      Authorization: `Bearer ${authState.token}`,
    },
    onClientUploadComplete: (res?: UploadResponse[]) => {
        if (res && res.length > 0 && res[0].url) {
          onUpload(res[0].url);
          toast.success(`Upload complete!`);
        }
    },
    onUploadError: (error: Error) => {
      // The error from the middleware will be caught here.
      toast.error('Upload Failed', { description: error.message });
    },
  });
  // --- END OF FIX ---

  if (currentUrl) {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={currentUrl}
          alt="Uploaded file"
          className="rounded-full object-cover"
        />
        <button
          onClick={() => onUpload('')}
          className="absolute top-0 right-0 rounded-full bg-destructive text-destructive-foreground p-1 shadow-sm"
          type="button"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center p-4 h-20 w-20 border-2 border-dashed rounded-full cursor-pointer hover:bg-muted/50 transition-colors">
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/*"
        disabled={isUploading}
        onChange={(e) => {
          // Only allow uploads if the user is authenticated (token exists).
          if (e.target.files && authState.token) {
            startUpload(Array.from(e.target.files));
          } else {
            toast.error("Authentication required", { description: "You must be signed in to upload files."});
          }
        }}
      />
      <div className="text-center">
        {isUploading ? (
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        ) : (
          <UploadCloud className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
    </div>
  );
};