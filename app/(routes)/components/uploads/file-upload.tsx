'use client';

import { useState, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Upload, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { uploadFiles } from '@/lib/uploadthing';
import apiClient from '@/lib/apiClient';

export interface UploadedFileResponse {
  url: string;
  key: string;
  name: string;
  size: number;
  type: string;
}

interface FileUploadProps {
  endpoint: "mediaUploader" | "imageUploader";
  onUploadComplete: (res: UploadedFileResponse[]) => void;
}

export function FileUpload({ endpoint, onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const headers = useMemo(() => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('authToken');
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUploadClick = async () => {
    if (selectedFiles.length === 0) return;
    if (!headers.Authorization) {
      toast.error("Authentication Error", { description: "You must be logged in to upload files." });
      return;
    }
    
    setIsUploading(true);
    try {
      const res = await uploadFiles(endpoint, {
        files: selectedFiles,
        headers: headers,
      });

      const savePromises = res.map(file => 
        // --- START OF FIX: Change 'name' to 'filename' to match the backend DTO ---
        apiClient.post('/media', {
            url: file.url,
            key: file.key,
            filename: file.name, // This was the typo causing the error
            size: file.size,
            type: file.type || 'application/octet-stream'
        })
        // --- END OF FIX ---
      );
      await Promise.all(savePromises);

      toast.success(`${res.length} file(s) uploaded successfully!`, {
        icon: <CheckCircle className="h-4 w-4" />,
      });
      onUploadComplete(res);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error("Upload Error", {
        icon: <AlertCircle className="h-4 w-4" />,
        description: message,
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const fileDisplayValue = selectedFiles.length > 0 
    ? selectedFiles.map(f => f.name).join(', ')
    : "No file selected";

  return (
    // ... JSX is unchanged ...
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          readOnly
          value={fileDisplayValue}
          className="flex-grow cursor-default"
          placeholder="Your selected files will appear here"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          Choose File(s)
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple={endpoint === 'mediaUploader'}
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      <Button
        type="button"
        onClick={handleUploadClick}
        disabled={isUploading || selectedFiles.length === 0}
        className="w-full"
      >
        {isUploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
      </Button>
    </div>
  );
}