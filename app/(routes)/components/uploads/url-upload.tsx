'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, Loader2, AlertCircle } from 'lucide-react';
import { Media } from '@/lib/types';
import { AxiosError } from 'axios';

interface UrlUploaderProps {
  onUploadComplete: (media: Media) => void;
  className?: string;
}

export function UrlUploader({ onUploadComplete, className }: UrlUploaderProps) {
  const [url, setUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchAndUpload = async () => {
    if (!url || !url.startsWith('http')) {
      toast.warning('Please enter a valid URL.');
      return;
    }

    setIsFetching(true);
    try {
      const response = await apiClient.post<Media>('/media/from-url', { url });
      toast.success(`Successfully uploaded from URL!`);
      onUploadComplete(response.data); // Pass the new media object back
      setUrl(''); // Clear input on success
    } catch (err) {
        let errorMessage = 'Failed to upload from URL.';
        if (err instanceof AxiosError && err.response?.data?.message) {
            errorMessage = Array.isArray(err.response.data.message) ? err.response.data.message.join(', ') : err.response.data.message;
        }
        toast.error('Upload Error', {
            icon: <AlertCircle className="h-4 w-4" />,
            description: errorMessage,
        });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-2 ${className}`}>
      <Input
        type="url"
        placeholder="https://example.com/image.png"
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