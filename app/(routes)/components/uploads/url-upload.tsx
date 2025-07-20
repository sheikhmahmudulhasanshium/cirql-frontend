'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, Loader2, AlertCircle } from 'lucide-react';
import { uploadFiles } from '@/lib/uploadthing';
import { UploadedFileResponse } from './file-upload';
import apiClient from '@/lib/apiClient';

interface UrlUploaderProps {
  onUploadComplete: (res: UploadedFileResponse) => void;
  className?: string;
}

// --- START OF IMPROVEMENT: Add a robust, universal data URL to File converter ---
function dataURLtoFile(dataurl: string, filename: string): File | undefined {
  const arr = dataurl.split(',');
  if (arr.length < 2) return undefined;

  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) return undefined;
  
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
// --- END OF IMPROVEMENT ---

export function UrlUploader({ onUploadComplete, className }: UrlUploaderProps) {
  const [url, setUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const headers = useMemo(() => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('authToken');
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, []);

  const handleFetchAndUpload = async () => {
    if (!url) return;
    if (!headers.Authorization) {
      toast.error("Authentication Error", { description: "You must be logged in to upload files." });
      return;
    }

    setIsFetching(true);
    try {
      let fileToUpload: File | undefined;
      
      // --- START OF IMPROVEMENT: Use the new universal converter ---
      if (url.startsWith('data:')) {
        fileToUpload = dataURLtoFile(url, 'pasted-file');
        if (!fileToUpload) {
            toast.error('Invalid Data URL', { description: "The pasted data could not be processed." });
            setIsFetching(false);
            return;
        }
        // Create a more descriptive filename using the MIME type
        const extension = fileToUpload.type.split('/')[1] || 'bin';
        const finalFilename = `pasted-file.${extension}`;
        fileToUpload = new File([fileToUpload], finalFilename, { type: fileToUpload.type });

      } else if (url.startsWith('http')) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);
        const blob = await response.blob();
        const filename = url.split('/').pop()?.split('#')[0].split('?')[0] || "file-from-url";
        fileToUpload = new File([blob], filename, { type: blob.type });
        
      } else {
        toast.warning('Please enter a valid URL or paste a data URL.');
        setIsFetching(false);
        return;
      }
      // --- END OF IMPROVEMENT ---
      
      if (!fileToUpload) {
        throw new Error("Could not prepare a file for upload.");
      }
      
      const res = await uploadFiles('mediaUploader', {
        files: [fileToUpload], 
        headers: headers,
      });

      if (res.length === 0) throw new Error("Upload to provider failed.");

      const uploadedFile = res[0];

      await apiClient.post('/media', {
        url: uploadedFile.url,
        key: uploadedFile.key,
        filename: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type || 'application/octet-stream'
      });
      
      toast.success(`Successfully uploaded and saved!`);
      onUploadComplete(uploadedFile); 
      setUrl('');
    } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        toast.error('Upload Error', {
            icon: <AlertCircle className="h-4 w-4" />,
            description: message,
        });
    } finally {
      setIsFetching(false);
    }
  };

  // --- JSX is unchanged ---
  return (
    <div className={`flex flex-col sm:flex-row items-center gap-2 ${className}`}>
      <Input
        type="text"
        placeholder="https://.../image.png OR paste image data"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={isFetching}
        className="flex-grow"
      />
      <Button
        type="button"
        onClick={handleFetchAndUpload}
        disabled={isFetching || !url}
        className="w-full sm:w-auto"
      >
        {isFetching ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Link className="mr-2 h-4 w-4" />
        )}
        Fetch & Upload
      </Button>
    </div>
  );
}