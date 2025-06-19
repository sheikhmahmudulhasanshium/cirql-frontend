// components/announcements/announcement-card.tsx
"use client";

import { Announcement } from '@/lib/types'; // Assuming this type exists
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EllipsisVerticalIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import UpdateAnnouncementModal from '@/components/modals/announcements/update-announcement'; // Assuming this exists
import DeleteAnnouncementModal from '@/components/modals/announcements/delete-announcement'; // Assuming this exists
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/contexts/AuthContext';

interface AnnouncementCardProps {
    announcement: Announcement;
    onUpdateSuccess?: () => void;
    onDeleteSuccess?: () => void;
}

const AnnouncementCard = ({ announcement, onUpdateSuccess, onDeleteSuccess }: AnnouncementCardProps) => {
    const [isLoadingImage, setIsLoadingImage] = useState(true);
    // FIX: Destructure the 'state' object first, then get 'isAdmin' from it.
    const { state } = useAuth();
    const { isAdmin } = state;

    useEffect(() => {
        // This logic is fine, but you might want to reconsider if an image load
        // should truly be tied to a hardcoded timer.
        const timer = setTimeout(() => {
            if (isLoadingImage) { // Only set to false if it's still loading
                setIsLoadingImage(false);
            }
        }, 1500); // Increased timeout slightly
        return () => clearTimeout(timer);
    }, [announcement.imageUrl, isLoadingImage]); // Added isLoadingImage dependency

    const handleImageLoad = () => {
        setIsLoadingImage(false);
    };
    const handleImageError = () => {
        setIsLoadingImage(false);
    };

    // If announcement is not visible, don't render anything
    if (!announcement.visible) {
        return null;
    }

    return (
        <div className='border rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-slate-950 transition-colors duration-200'>
            <div className="relative p-2">
                <div className="absolute inset-0 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-md backdrop-blur-sm -z-10 transition-colors"></div>
                <div className="flex items-start justify-between"> {/* Flex container for content and menu */}
                    <Link href={announcement.linkUrl || "#"} className='flex items-center w-full gap-2'>
                        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative flex-shrink-0">
                            {isLoadingImage && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                                    <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                                </div>
                            )}
                            {announcement.imageUrl && (
                                <Image
                                    src={announcement.imageUrl}
                                    alt={announcement.type || 'N/A'}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 20vw, 10vw"
                                    className="rounded-full"
                                    loading="lazy"
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                />
                            )}
                            {/* Fallback only shows if there's no image or it's loading */}
                            <AvatarFallback>{announcement.type?.substring(0, 2).toUpperCase() || 'NA'}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col gap-1 text-wrap'>
                            <h1 className='font-semibold'>{announcement.title}</h1>
                            <h2 className='text-sm'>{announcement.content}</h2>
                        </div>
                    </Link>
                    {isAdmin && (
                        <div className='flex-shrink-0'> {/* Prevent menu from shrinking */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size={'icon'} variant="ghost">
                                        <EllipsisVerticalIcon className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className='flex flex-col gap-2'>
                                    <UpdateAnnouncementModal announcementId={announcement._id} onUpdateSuccess={onUpdateSuccess} />
                                    <DeleteAnnouncementModal announcementId={announcement._id} onDeleteSuccess={onDeleteSuccess} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnnouncementCard;