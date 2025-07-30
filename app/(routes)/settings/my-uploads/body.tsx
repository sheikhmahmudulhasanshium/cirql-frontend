// app/(routes)/media/page.tsx

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Media } from '@/lib/types';
import { Loader2, Trash2, File as FileIcon, ArrowLeft, Clapperboard, FileAudio, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/date-formatter';
import { toast } from 'sonner';
import Link from 'next/link';
import { deleteMediaFile } from '@/components/hooks/media/delete-media';
import { getMyMedia } from '@/components/hooks/media/get-my-media';

// ... MediaGridSkeleton remains the same ...

// --- MODIFICATION: Update FileCard to handle the new Media type ---
interface FileCardProps {
  file: Media & { name?: string; size?: number, type?: string }; // Allow optional frontend-only properties
  onDelete: (fileId: string) => void;
}

const FileCard = ({ file, onDelete }: FileCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const isImage = file.thumbnailLink?.includes('googleusercontent.com'); // More reliable check
  const isVideo = !isImage && file.thumbnailLink; // Google provides thumbnails for videos too
  const isAudio = false; // We can't determine this reliably from the backend data
  const displayName = file.name || 'Untitled File';
  const displaySize = typeof file.size === 'number' ? `${(file.size / 1024).toFixed(1)} KB` : null;
  
  const previewSrc = file.thumbnailLink || `${process.env.NEXT_PUBLIC_BACKEND_URL}/media/download/${file._id}`;
  const fullsizeSrc = `${process.env.NEXT_PUBLIC_BACKEND_URL}/media/download/${file._id}`;

  const handleDeleteConfirm = async () => {
    const hasConfirmed = window.confirm(`Are you sure you want to delete this file reference? This action cannot be undone.`);
    if (!hasConfirmed) return;

    setIsDeleting(true);
    try {
      await deleteMediaFile(file._id);
      toast.success(`"${displayName}" reference was deleted.`);
      onDelete(file._id);
    } catch (err) {
      const deleteError = err as Error;
      toast.error('Failed to delete file reference.', {
        description: deleteError.message || 'The delete feature may not be fully implemented.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderPreview = () => {
    const commonIconClass = 'h-12 w-12 text-muted-foreground';
    if (isImage) {
      return (
        <Image
          src={previewSrc}
          alt={displayName}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      );
    }
    if (isVideo) return <Clapperboard className={commonIconClass} />;
    if (isAudio) return <FileAudio className={commonIconClass} />;
    return <FileIcon className={commonIconClass} />;
  };

  return (
    <>
      <div className="relative group border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
        <button
          className="aspect-square w-full bg-muted flex items-center justify-center relative cursor-pointer"
          onClick={() => isImage && dialogRef.current?.showModal()}
          disabled={!isImage}
          aria-label={`View ${displayName}`}
          type="button"
        >
          {renderPreview()}
          {isImage && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Expand className="h-8 w-8 text-white" />
            </div>
          )}
        </button>

        <div className="absolute top-1 right-1 z-10">
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            aria-label={`Delete ${displayName}`}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>

        <div className="p-2 text-sm">
          <p className="font-semibold truncate" title={displayName}>
            {displayName}
          </p>
          <p className="text-xs text-muted-foreground">
             {displaySize ? `${displaySize} • ` : ''}
            {formatDate(file.createdAt, 'PP')}
          </p>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="p-0 rounded-lg shadow-2xl backdrop:bg-black/50"
        onClick={() => dialogRef.current?.close()}
      >
        <div className="relative max-w-[90vw] max-h-[90vh]">
          {/* Using a standard img tag for the full-size view for simplicity */}
          <img
            src={fullsizeSrc}
            alt={`Zoomed view of ${displayName}`}
            className="w-auto h-auto max-w-full max-h-full object-contain"
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2"
            onClick={(e) => {
              e.stopPropagation();
              dialogRef.current?.close();
            }}
          >
            Close
          </Button>
        </div>
      </dialog>
    </>
  );
};


// The main Body component remains the same as you provided
export default function Body() {
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyMedia();
      setMedia(data ?? []);
    } catch (err) {
      const fetchError = err as Error;
      console.error(fetchError);
      setError(`Failed to load files: ${fetchError.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileDeleted = (deletedFileId: string) => {
    setMedia((prev) => prev.filter((file) => file._id !== deletedFileId));
  };

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/settings" passHref>
          <Button variant="outline" size="icon" aria-label="Back to settings">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Uploads</h1>
          <p className="text-muted-foreground">
            {isLoading ? 'Loading your files...' : `You have ${media.length} uploaded files.`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <MediaGridSkeleton />
      ) : error ? (
        <div className="text-center py-10 text-destructive bg-destructive/10 rounded-lg">{error}</div>
      ) : media.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">You haven&apos;t uploaded any files yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {media.map((file) => (
            <FileCard key={file._id} file={file} onDelete={handleFileDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}

// Dummy MediaGridSkeleton to make the file complete
const MediaGridSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );