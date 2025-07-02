"use client";

import { Announcement } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EllipsisVerticalIcon, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import UpdateAnnouncementModal from '@/components/modals/announcements/update-announcement';
import DeleteAnnouncementModal from '@/components/modals/announcements/delete-announcement';
import { RelativeTime } from '@/lib/RelativeTime';
// --- ADDED: Import the RelativeTime component ---

interface AnnouncementCardProps {
    announcement: Announcement;
    onUpdateSuccess?: () => void;
    onDeleteSuccess?: () => void;
}

const AnnouncementCard = ({ announcement, onUpdateSuccess, onDeleteSuccess }: AnnouncementCardProps) => {
    const { state: { isAdmin } } = useAuth();

    if (!announcement.visible && !isAdmin) {
        return null;
    }

    return (
        <div className='rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent/50 dark:hover:bg-accent/50 transition-colors duration-200'>
            <div className="relative p-3">
                <div className="flex items-start justify-between gap-4">
                    <Link href={announcement.linkUrl || "#"} target="_blank" rel="noopener noreferrer" className='flex items-center w-full gap-4'>
                        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                            <AvatarImage
                                src={announcement.imageUrl || ''}
                                alt={announcement.title || 'Announcement Image'}
                                className="object-cover"
                            />
                            <AvatarFallback>
                                {announcement.type?.substring(0, 2).toUpperCase() || 'NA'}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col gap-1 text-wrap'>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className='font-semibold'>{announcement.title}</h1>
                                {!announcement.visible && isAdmin && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <EyeOff className="h-3 w-3" /> Hidden
                                    </Badge>
                                )}
                            </div>
                            <h2 className='text-sm text-muted-foreground'>{announcement.content}</h2>
                            {/* --- THIS IS THE FIX --- */}
                            {/* Added the RelativeTime component to show "2h ago", etc. */}
                            <p className="text-xs text-muted-foreground pt-1">
                                <RelativeTime date={announcement.createdAt} />
                            </p>
                            {/* --- END OF FIX --- */}
                        </div>
                    </Link>
                    {isAdmin && (
                        <div className='flex-shrink-0'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size={'icon'} variant="ghost">
                                        <EllipsisVerticalIcon className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className='w-48'>
                                    <UpdateAnnouncementModal announcement={announcement} onUpdateSuccess={onUpdateSuccess} />
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