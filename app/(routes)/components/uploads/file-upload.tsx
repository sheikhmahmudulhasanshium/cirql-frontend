'use client';

import { useState, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Upload, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { uploadFiles } from '@/lib/uploadthing'; // --- Use the 'uploadFiles' helper ---

// This is the expected data structure for a successfully uploaded file.
export interface UploadedFileResponse {
  url: string;
  key: string;
  name: string;
  size: number;
}

// The component now expects an 'onUploadComplete' prop that receives an array of the above objects.
interface FileUploadProps {
  endpoint: "mediaUploader" | "imageUploader";
  onUploadComplete: (res: UploadedFileResponse[]) => void;
}

export function FileUpload({ endpoint, onUploadComplete }: FileUploadProps) {
  // We now manage the 'isUploading' state manually
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoized headers to securely send the auth token
  const headers = useMemo(() => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('authToken');
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, []);

  // Handler for when the user selects files from the dialog
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // --- START OF FIX: This function now uses the 'uploadFiles' helper ---
  const handleUploadClick = async () => {
    if (selectedFiles.length === 0) return;
    if (!headers.Authorization) {
      toast.error("Authentication Error", { description: "You must be logged in to upload files." });
      return;
    }
    
    setIsUploading(true);
    try {
      // Use the helper function, passing the endpoint, files, and headers
      const res = await uploadFiles(endpoint, {
        files: selectedFiles,
        headers: headers, // This is the correct way to pass headers
      });

      // Manually handle the success case
      toast.success(`${res.length} file(s) uploaded successfully!`, {
        icon: <CheckCircle className="h-4 w-4" />,
      });
      onUploadComplete(res);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: unknown) {
      // Manually handle the error case
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error("Upload Error", {
        icon: <AlertCircle className="h-4 w-4" />,
        description: message,
      });
    } finally {
      setIsUploading(false);
    }
  };
  // --- END OF FIX ---
  
  const fileDisplayValue = selectedFiles.length > 0 
    ? selectedFiles.map(f => f.name).join(', ')
    : "No file selected";

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* The visible ShadCN Input, used only for display */}
        <Input
          readOnly
          value={fileDisplayValue}
          className="flex-grow cursor-default"
          placeholder="Your selected files will appear here"
        />
        {/* The visible ShadCN Button that triggers the file dialog */}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          Choose File(s)
        </Button>
      </div>
      
      {/* The actual file input, hidden from the user */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple={endpoint === 'mediaUploader'}
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      {/* The upload button, which is only active when files are selected */}
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