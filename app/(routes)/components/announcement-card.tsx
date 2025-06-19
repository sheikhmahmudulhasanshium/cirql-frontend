"use client";

import { Announcement } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // UPDATED: Import AvatarImage
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EllipsisVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import UpdateAnnouncementModal from '@/components/modals/announcements/update-announcement';
import DeleteAnnouncementModal from '@/components/modals/announcements/delete-announcement';
import { useAuth } from '@/components/contexts/AuthContext';
// REMOVED: No longer need useState, useEffect, Loader2 (unless you want it in the fallback), or next/image

interface AnnouncementCardProps {
    announcement: Announcement;
    onUpdateSuccess?: () => void;
    onDeleteSuccess?: () => void;
}

const AnnouncementCard = ({ announcement, onUpdateSuccess, onDeleteSuccess }: AnnouncementCardProps) => {
    // REMOVED: All manual image loading state and effects are no longer necessary.
    // const [isLoadingImage, setIsLoadingImage] = useState(true);
    // const handleImageLoad = () => { ... };
    // const handleImageError = () => { ... };
    // const useEffect(() => { ... });

    const { state: { isAdmin } } = useAuth(); // Using simplified destructuring

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
                        
                        {/* --- REFACTORED AVATAR BLOCK --- */}
                        {/* This now uses the standard, recommended pattern for shadcn/ui Avatar. */}
                        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                            {/* AvatarImage handles loading and errors automatically. */}
                            {/* It remains hidden until the image is successfully loaded. */}
                            <AvatarImage
                                src={announcement.imageUrl || ''}
                                alt={announcement.title || 'Announcement Image'}
                                className="object-cover" // Ensures the image covers the avatar area without distortion
                            />
                            {/* AvatarFallback is automatically displayed during image loading or if the src fails. */}
                            <AvatarFallback>
                                {announcement.type?.substring(0, 2).toUpperCase() || 'NA'}
                            </AvatarFallback>
                        </Avatar>
                        {/* --- END OF REFACTORED BLOCK --- */}

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