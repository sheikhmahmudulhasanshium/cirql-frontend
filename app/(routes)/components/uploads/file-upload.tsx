'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadFiles } from '@/lib/uploadthing';
import { useAuth } from '@/components/contexts/AuthContext';

export interface UploadedFileResponse {
  mediaId: string;
  uploadedBy: string;
  key: string;
  url: string;
  name: string;
  size: number;
}

interface FileUploadProps {
  endpoint: 'mediaUploader';
  onUploadComplete: (res: UploadedFileResponse[]) => void;
  input?: {
    ticketId?: string;
    groupId?: string;
  };
}

export function FileUpload({ endpoint, onUploadComplete, input }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Access token from auth context
  const { state } = useAuth();
  const token = state.token;

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    if (!token) {
      toast.error('Please login to upload files.');
      return;
    }

    setIsUploading(true);

    try {
      const res = await uploadFiles(endpoint, {
        files,
        input: input || {},
        headers: {
          Authorization: `Bearer ${token}`,  // Pass the JWT token here
        },
      });

      const mappedFiles: UploadedFileResponse[] = res.map((file) => ({
        mediaId: file.key,
        uploadedBy: '',
        key: file.key || '',
        url: file.url || '',
        name: file.name || file.key,
        size: file.size || 0,
      }));

      toast.success("Upload complete!");
      onUploadComplete(mappedFiles);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      toast.error('Upload Error', { description: errorMsg });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-center gap-2 rounded-lg border p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) { handleUpload(Array.from(e.dataTransfer.files)); } }}
    >
      <Upload className="h-8 w-8 text-muted-foreground flex-shrink-0" />
      <div className="flex-grow text-center sm:text-left">
        <p className="font-semibold">Click to browse or drag and drop</p>
        <p className="text-xs text-muted-foreground">Supports various file types.</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={(e) => { if (e.target.files) handleUpload(Array.from(e.target.files)); }}
        disabled={isUploading}
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full sm:w-auto"
      >
        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        {isUploading ? 'Uploading...' : 'Choose File(s)'}
      </Button>
    </div>
  );
}
