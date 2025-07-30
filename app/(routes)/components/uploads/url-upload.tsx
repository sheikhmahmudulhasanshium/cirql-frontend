'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, Loader2, AlertCircle } from 'lucide-react';
import { uploadFiles } from '@/lib/uploadthing';
import { UploadedFileResponse } from './file-upload';
import { useAuth } from '@/components/contexts/AuthContext';

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

interface UrlUploaderProps {
  onUploadComplete: (res: UploadedFileResponse[]) => void; // expects array
  className?: string;
  input?: {
    ticketId?: string;
    groupId?: string;
  };
}

export function UrlUploader({ onUploadComplete, className, input }: UrlUploaderProps) {
  const [url, setUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const { state: { token } } = useAuth();

  const handleFetchAndUpload = async () => {
    if (!url) return;
    setIsFetching(true);

    if (!token) {
      toast.error('Upload Error', {
        icon: <AlertCircle className="h-4 w-4" />,
        description: 'Authentication token not found. Please log in again.',
      });
      setIsFetching(false);
      return;
    }

    try {
      let fileToUpload: File | undefined;
      if (url.startsWith('data:')) {
        const extension = url.split(';')[0].split('/')[1] || 'png';
        const filename = `pasted-image.${extension}`;
        fileToUpload = dataURLtoFile(url, filename);
        if (!fileToUpload) throw new Error('Could not process pasted image data.');
      } else if (url.startsWith('http')) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);
        const blob = await response.blob();
        const filename = url.split('/').pop()?.split('#')[0].split('?')[0] || 'file-from-url';
        fileToUpload = new File([blob], filename, { type: blob.type });
      } else {
        toast.warning('Please enter a valid URL or paste image data.');
        setIsFetching(false);
        return;
      }

      if (!fileToUpload) throw new Error('Could not prepare a file for upload.');

      // Upload using uploadFiles with authorization header and optional input:
      const res = await uploadFiles('mediaUploader', {
        files: [fileToUpload],
        input: input || {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.length === 0) throw new Error('Upload to provider failed.');

      // Map returned files to your UploadedFileResponse type:
      const mappedFiles: UploadedFileResponse[] = res.map((file) => ({
        mediaId: file.key,
        uploadedBy: '',
        key: file.key || '',
        url: file.url || '',
        name: file.name || file.key,
        size: file.size || 0,
      }));

      toast.success('Successfully uploaded!');
      onUploadComplete(mappedFiles);
      setUrl('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast.error('Upload Error', {
        icon: <AlertCircle className="h-4 w-4" />,
        description: message,
      });
    } finally {
      setIsFetching(false);
    }
  };

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
      <Button type="button" onClick={handleFetchAndUpload} disabled={isFetching || !url} className="w-full sm:w-auto">
        {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link className="mr-2 h-4 w-4" />}
        Fetch & Upload
      </Button>
    </div>
  );
}
