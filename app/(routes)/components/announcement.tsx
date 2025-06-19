"use client";

import { useMemo, useState } from 'react'; // Import useState
import { useAuth } from '@/components/contexts/AuthContext';
import CreateAnnouncementModal from '@/components/modals/announcements/create-announcement-modal';
import BasicBodyProvider from '@/components/providers/basic-body-provider';
import AnnouncementCard from './announcement-card';
import useAnnouncementsWithFilter from '@/components/hooks/announcements/get-announcement-with-filter';

// Import the pagination components
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
} from "@/components/ui/pagination";

const Announcements = () => {
    // State for the current page
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // You can make this dynamic if needed

    // Get user state from the AuthContext
    const { state } = useAuth();
    const { isAdmin } = state;

    // 1. Update filterParams to include the current page and limit
    const filterParams = useMemo(() => {
        const baseParams = { page: currentPage, limit: itemsPerPage };

        if (isAdmin) {
            return baseParams;
        }

        return { ...baseParams, visible: true };
    }, [isAdmin, currentPage, itemsPerPage]);

    // 2. The hook now gets 'total' which we need for calculating total pages
    const { data: announcements, total, isLoading, error, refetch } = useAnnouncementsWithFilter(filterParams);
    
    // 3. This function remains the same
    const handleDataChange = () => {
        // If an item is created/deleted, it's good practice to go back to page 1
        setCurrentPage(1); 
        refetch();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // The useMemo/useEffect in the hook will automatically trigger a refetch
    };

    // Calculate total pages
    const totalPages = total ? Math.ceil(total / itemsPerPage) : 0;

    if (isLoading) {
        return <div className='p-10 text-center'>Loading announcements...</div>;
    }

    if (error) {
        return <div className='p-10 text-center text-red-500'>Error: {error.message}</div>;
    }

    return (
        <BasicBodyProvider>
            <div className='flex flex-col justify-between min-h-svh gap-4'>
               <div className='pt-8 pl-12'>
                    <h1 className='text-4xl italic'>📢 Announcements</h1>
                </div>
                <div className='px-4 justify-end flex w-full pt-4' >
                    {isAdmin &&
                        <CreateAnnouncementModal onCreateSuccess={handleDataChange} />
                    }
                </div>
                
                <div className='flex-grow flex flex-col gap-1'> {/* Use flex-grow here */}
                    {announcements && announcements.length > 0 ? (
                        announcements.map((announcement) => (
                            <AnnouncementCard
                                key={announcement._id}
                                announcement={announcement}
                                onUpdateSuccess={refetch} // Just refetch on update
                                onDeleteSuccess={handleDataChange} // Reset to page 1 on delete
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-8">No announcements to display.</p>
                    )}
                </div>

                {/* 4. Add the Pagination Component at the bottom */}
                {totalPages > 1 && (
                    <div className="py-8">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage > 1) handlePageChange(currentPage - 1);
                                        }}
                                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>

                                {/* Simple pagination link rendering */}
                                {/* For more complex logic (e.g., with ellipsis), you'd add more here */}
                                {[...Array(totalPages)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(i + 1);
                                            }}
                                            isActive={currentPage === i + 1}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                        }}
                                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </BasicBodyProvider>
    );
};

export default Announcements;