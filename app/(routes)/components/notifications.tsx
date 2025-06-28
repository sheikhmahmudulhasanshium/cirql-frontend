'use client';

import { useState, useMemo, useEffect } from 'react';
import { useNotificationContext } from "@/components/contexts/NotificationContext";
import useNotifications from "@/components/hooks/notifications/use-notifications";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { NotificationCard } from './notification-card';

interface NotificationFeedProps {
  filter: 'all' | 'read' | 'unread';
}

const NotificationFeed = ({ filter }: NotificationFeedProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { unreadCount, handleMarkAllAsRead } = useNotificationContext();
  
  // Convert our simple filter string to the boolean required by the API hook
  const isReadFilter = useMemo(() => {
    if (filter === 'read') return true;
    if (filter === 'unread') return false;
    return undefined; // 'all' maps to undefined
  }, [filter]);

  const filterParams = useMemo(() => ({
    page: currentPage,
    limit: 10,
    isRead: isReadFilter,
  }), [currentPage, isReadFilter]);

  const { data: notifications, total, isLoading, error, refetch } = useNotifications(filterParams);

  // When the filter changes, reset to the first page
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleMarkAllAndRefetch = async () => {
    await handleMarkAllAsRead();
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = total ? Math.ceil(total / 10) : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-destructive">Error: {error.message}</div>;
  }

  if (!notifications || notifications.length === 0) {
    return <p className="text-center text-muted-foreground mt-8 py-10">You have no notifications in this category.</p>;
  }

  return (
    <div className='w-full'>
        {/* "Mark all as read" button only shows for notification feeds */}
        <div className="flex justify-end mb-4">
            <Button onClick={handleMarkAllAndRefetch} disabled={unreadCount === 0 || isLoading}>
                Mark all as read
            </Button>
        </div>
        
        <div className="flex flex-col gap-3">
            {notifications.map((notification) => (
                <NotificationCard key={notification._id} notification={notification} />
            ))}
        </div>

        {totalPages > 1 && (
            <div className="py-8">
            <Pagination>
                <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) handlePageChange(currentPage - 1); }} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page); }} isActive={currentPage === page}>{page}</PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) handlePageChange(currentPage + 1); }} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} />
                </PaginationItem>
                </PaginationContent>
            </Pagination>
            </div>
        )}
    </div>
  );
};

export default NotificationFeed;