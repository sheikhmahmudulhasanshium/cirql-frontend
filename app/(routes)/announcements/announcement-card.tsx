"use client";

import { Announcement } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/components/contexts/AuthContext';

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

// Modals
import UpdateAnnouncementModal from '@/components/modals/announcements/update-announcement';
import DeleteAnnouncementModal from '@/components/modals/announcements/delete-announcement';

// Icons
import { EllipsisVertical, EyeOff } from 'lucide-react';

// --- Color map for the left border strip ---
const typeColorMap: Record<string, string> = {
    'Upcoming': 'border-sky-500 hover:border-sky-400',
    'Latest Updates': 'border-indigo-500 hover:border-indigo-400',
    'Company News': 'border-amber-500 hover:border-amber-400',
    'General': 'border-slate-400 hover:border-slate-300',
};

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

    const borderColorClass = typeColorMap[announcement.type] || 'border-zinc-300';

    return (
        <div className={`
            rounded-lg bg-card text-card-foreground shadow-sm 
            transition-all duration-200 hover:shadow-md 
            border-l-4 hover:border-l-[6px] 
            ${borderColorClass}
        `}>
            <div className="relative p-4">
                <div className="flex items-start justify-between gap-4">
                    <Link 
                        href={`/announcements/${announcement._id}` || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className='group flex flex-grow items-center gap-4'
                        title={announcement.title}
                    >
                        <Avatar className="h-16 w-16 flex-shrink-0 sm:h-20 sm:w-20">
                            <AvatarImage
                                src={announcement.imageUrl || ''}
                                alt={announcement.title || 'Announcement Image'}
                                className="object-cover"
                            />
                            <AvatarFallback className="font-semibold">
                                {announcement.type?.substring(0, 2).toUpperCase() || 'NA'}
                            </AvatarFallback>
                        </Avatar>

                        {/* --- THIS IS THE KEY CHANGE --- */}
                        {/* Added `text-start` to ensure text is always left-aligned */}
                        <div className='flex flex-col gap-1.5 text-start'>
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className='font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors'>
                                    {announcement.title}
                                </h3>
                                {!announcement.visible && isAdmin && (
                                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                        <EyeOff className="h-3 w-3" /> Hidden
                                    </Badge>
                                )}
                            </div>
                            
                            <p className='text-sm text-muted-foreground line-clamp-2'>
                                {announcement.content}
                            </p>
                        </div>
                    </Link>

                    {isAdmin && (
                        <div className='flex-shrink-0'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size={'icon'} variant="ghost">
                                        <EllipsisVertical className="h-5 w-5" />
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

// --- FIX: Corrected the export syntax ---
export default AnnouncementCard;