// src/app/(routes)/settings/my-uploads/body.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Media, PaginatedResponse } from '@/lib/types';
import { Loader2, Trash2, File as FileIcon, ArrowLeft, Clapperboard, FileAudio, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/date-formatter';
import { toast } from 'sonner';
import Link from 'next/link';
import { deleteMediaFile } from '@/components/hooks/media/delete-media';
import { getMyMedia } from '@/components/hooks/media/get-my-media';

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

const FileCard = ({ file, onDelete }: { file: Media; onDelete: (fileId: string) => void; }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const isImage = file.type.startsWith('image/');

  const handleDeleteConfirm = async () => {
    const hasConfirmed = window.confirm(
      `Are you sure you want to permanently delete "${file.filename}"? This action cannot be undone.`
    );
    if (!hasConfirmed) return;

    setIsDeleting(true);
    try {
      await deleteMediaFile(file._id);
      toast.success(`"${file.filename}" was deleted successfully.`);
      onDelete(file._id);
    } catch (error) {
      console.error("Failed to delete file:", error);
      toast.error("Failed to delete file.", { description: "Please try again later." });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderPreview = () => {
    const commonIconClass = "h-12 w-12 text-muted-foreground";
    if (isImage) {
      return (
        <Image
          src={file.url}
          alt={file.filename}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      );
    }
    if (file.type.startsWith('video/')) return <Clapperboard className={commonIconClass} />;
    if (file.type.startsWith('audio/')) return <FileAudio className={commonIconClass} />;
    return <FileIcon className={commonIconClass} />;
  };

  return (
    <>
      <div className="relative group border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
        <button
          className="aspect-square w-full bg-muted flex items-center justify-center relative cursor-pointer"
          onClick={() => isImage && dialogRef.current?.showModal()}
          disabled={!isImage}
          aria-label={`View ${file.filename}`}
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
            aria-label={`Delete ${file.filename}`}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>

        <div className="p-2 text-sm">
          <p className="font-semibold truncate" title={file.filename}>{file.filename}</p>
          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • {formatDate(file.createdAt, 'PP')}</p>
        </div>
      </div>

      <dialog ref={dialogRef} className="p-0 rounded-lg shadow-2xl backdrop:bg-black/50" onClick={() => dialogRef.current?.close()}>
          <div className="relative max-w-[90vw] max-h-[90vh]">
              <Image
                src={file.url}
                alt={`Zoomed view of ${file.filename}`}
                width={1920}
                height={1080}
                className="w-auto h-auto max-w-full max-h-full object-contain"
              />
              <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the dialog's onClick from firing
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

export default function Body() {
  const [mediaResponse, setMediaResponse] = useState<PaginatedResponse<Media> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyMedia();
      setMediaResponse(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load your uploaded files. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileDeleted = (deletedFileId: string) => {
    setMediaResponse(prev => {
      if (!prev) return null;
      return {
        ...prev,
        data: prev.data.filter(file => file._id !== deletedFileId),
        total: prev.total - 1,
        pagination: { ...prev.pagination, totalItems: prev.pagination.totalItems - 1 }
      };
    });
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
            {isLoading ? "Loading your files..." : `You have ${mediaResponse?.total ?? 0} uploaded files.`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <MediaGridSkeleton />
      ) : error ? (
        <div className="text-center py-10 text-destructive bg-destructive/10 rounded-lg">{error}</div>
      ) : !mediaResponse || mediaResponse.data.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">You haven&apos;t uploaded any files yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mediaResponse.data.map(file => (
            <FileCard key={file._id} file={file} onDelete={handleFileDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}