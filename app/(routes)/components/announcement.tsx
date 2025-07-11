'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/components/contexts/AuthContext';
import useAnnouncementsWithFilter from '@/components/hooks/announcements/get-announcement-with-filter';
// --- MODIFICATION: Removed PaginationLink as it's no longer needed ---
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from '@/components/ui/skeleton';
import AnnouncementCard from './announcement-card';

const AnnouncementFeed = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { state: { isAdmin } } = useAuth();

    const filterParams = useMemo(() => ({
        page: currentPage,
        limit: 8,
        visible: isAdmin ? undefined : true,
    }), [isAdmin, currentPage]);

    const { data: announcements, total, isLoading, error, refetch } = useAnnouncementsWithFilter(filterParams);
    
    const handleDataChange = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            refetch();
        }
    };

    const handlePageChange = (page: number) => {
        // Ensure page number is within valid bounds
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const totalPages = total ? Math.ceil(total / 8) : 0;

    if (isLoading) {
        return (
             <div className='flex-grow flex flex-col gap-3'>
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
             </div>
        );
    }

    if (error) {
        return <div className='p-10 text-center text-destructive'>Error: {error.message}</div>;
    }
    
    if (!announcements || announcements.length === 0) {
        return <p className="text-center text-muted-foreground mt-8 py-10">No announcements to display.</p>;
    }
    
    return (
        <div className='flex flex-col justify-between gap-4'>
            <div className='flex-grow flex flex-col gap-3'>
                {announcements.map((announcement) => (
                    <AnnouncementCard
                        key={announcement._id}
                        announcement={announcement}
                        onUpdateSuccess={refetch}
                        onDeleteSuccess={handleDataChange}
                    />
                ))}
            </div>

            {/* --- THIS IS THE FIX --- */}
            {/* Replaced the old pagination logic with the new simplified style */}
            {totalPages > 1 && (
                <div className="py-8">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} 
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} 
                                />
                            </PaginationItem>
                            
                            <PaginationItem>
                                <span className="text-sm font-medium px-4">
                                    Page {currentPage} of {totalPages}
                                </span>
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationNext 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} 
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} 
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
            {/* --- END OF FIX --- */}
        </div>
    );
};

export default AnnouncementFeed;