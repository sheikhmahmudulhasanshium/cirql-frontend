'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, Plus, X } from 'lucide-react';
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

interface UniversalUploaderProps {
  onUploadComplete: (uploadedFiles: UploadedFileResponse[]) => void;
  className?: string;
  input?: Record<string, unknown>; // Optional contextual metadata for backend
}

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

export function UniversalUploader({ onUploadComplete, className, input }: UniversalUploaderProps) {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [externalLinks, setExternalLinks] = useState<string[]>(['']); // start with one empty URL field
  const [isUploading, setIsUploading] = useState(false);
  const { state } = useAuth();
  const token = state.token;

  // Add local files to state
  const onLocalFileChange = (files: FileList | null) => {
    if (files) {
      setLocalFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  // Add an empty URL input
  const addExternalLinkInput = () => {
    setExternalLinks((prev) => [...prev, '']);
  };

  // Remove a URL input by index
  const removeExternalLinkInput = (index: number) => {
    setExternalLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Update value of a URL input
  const updateExternalLink = (index: number, value: string) => {
    setExternalLinks((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  // Convert data URL or external URL to a File object
  const convertUrlToFile = async (url: string): Promise<File | undefined> => {
    try {
      if (url.startsWith('data:')) {
        // Base64 data URI
        const extension = url.split(';')[0].split('/')[1] || 'png';
        const file = dataURLtoFile(url, `pasted-image.${extension}`);
        if (!file) throw new Error('Invalid base64 image data');
        return file;
      } else if (url.startsWith('http')) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch file at ${url}`);
        const blob = await response.blob();
        const filename = url.split('/').pop()?.split('#')[0].split('?')[0] || 'file-from-url';
        return new File([blob], filename, { type: blob.type });
      } else {
        throw new Error('Not a valid URL or data URI');
      }
    } catch (error) {
      toast.error(`File convert error: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  };

  // Upload all files (local + external) in one batch
  const handleUploadAll = async () => {
    if (isUploading) return;
    if (!token) {
      toast.error('Authentication token not found. Please log in.');
      return;
    }

    setIsUploading(true);

    try {
      // Convert all external links to File objects
      const externalFiles = (
        await Promise.all(
          externalLinks.map(async (link) => convertUrlToFile(link.trim()))
        )
      ).filter((f): f is File => Boolean(f));

      const allFiles = [...localFiles, ...externalFiles];

      if (allFiles.length === 0) {
        toast.warning('Please add at least one file or external link to upload.');
        setIsUploading(false);
        return;
      }

      // Upload all files via UploadThing, passing optional input/context
      const uploadResult = await uploadFiles('mediaUploader', {
        files: allFiles,
        input: input || {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mappedFiles: UploadedFileResponse[] = uploadResult.map((file) => ({
        mediaId: file.key,
        uploadedBy: '',
        key: file.key || '',
        url: file.url || '',
        name: file.name || file.key,
        size: file.size || 0,
      }));

      toast.success(`Successfully uploaded ${mappedFiles.length} file(s).`);

      // Clear inputs on success
      setLocalFiles([]);
      setExternalLinks(['']);

      onUploadComplete(mappedFiles);
    } catch (error) {
      toast.error(`Upload failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove a local file from selection
  const removeLocalFile = (index: number) => {
    setLocalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      {/* Local Files Section */}
      <div className="mb-4">
        <label htmlFor="local-upload" className="block mb-2 font-semibold">
          Upload from your device (multiple files allowed)
        </label>
        <div className="flex gap-2 flex-wrap">
          {localFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-1 rounded bg-gray-100 px-3 py-1 text-sm"
              title={file.name}
            >
              <span className="truncate max-w-xs">{file.name}</span>
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => removeLocalFile(idx)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <input
          id="local-upload"
          type="file"
          multiple
          onChange={(e) => onLocalFileChange(e.target.files)}
          disabled={isUploading}
          className="mt-2 block w-full cursor-pointer rounded border border-gray-300 p-2 text-sm file:mr-4 file:rounded file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-primary-dark"
        />
      </div>

      {/* External URLs Section */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Upload from URL or paste base64 data URLs</label>
        {externalLinks.map((url, idx) => (
          <div key={idx} className="flex items-center space-x-2 mb-2">
            <Input
              placeholder="https://example.com/image.png or paste base64 data"
              value={url}
              onChange={(e) => updateExternalLink(idx, e.target.value)}
              disabled={isUploading}
            />
            <button
              type="button"
              aria-label="Remove URL"
              onClick={() => removeExternalLinkInput(idx)}
              className="text-red-500 hover:text-red-700"
              disabled={externalLinks.length === 1}
            >
              <X size={20} />
            </button>
            {idx === externalLinks.length - 1 && (
              <button
                type="button"
                aria-label="Add new URL"
                onClick={addExternalLinkInput}
                className="text-primary hover:text-primary-dark"
                disabled={isUploading}
              >
                <Plus size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <Button
        onClick={handleUploadAll}
        disabled={
          isUploading ||
          (localFiles.length === 0 && externalLinks.every((url) => !url.trim()))
        }
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files / URLs
          </>
        )}
      </Button>
    </div>
  );
}
