'use client';

import { useState, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Eye, EyeOff } from "lucide-react";
import useAnnouncementsWithFilter from '@/components/hooks/announcements/get-announcement-with-filter';
import CreateAnnouncementModal from '@/components/modals/announcements/create-announcement-modal';
import { Skeleton } from '@/components/ui/skeleton';
import UpdateAnnouncementModal from '@/components/modals/announcements/update-announcement';
import DeleteAnnouncementModal from '@/components/modals/announcements/delete-announcement';
import { FormattedDate } from '@/lib/FormattedDate';
// --- ADDED: Import our custom date formatting component ---

const AdminManageAnnouncements = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const filterParams = useMemo(() => ({
    page: currentPage,
    limit: 10,
  }), [currentPage]);

  const { data: announcements, total, isLoading, error, refetch } = useAnnouncementsWithFilter(filterParams);

  const totalPages = total ? Math.ceil(total / 10) : 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="p-10 text-center text-destructive">Failed to load announcements.</div>;
    }

    if (!announcements || announcements.length === 0) {
      return <div className="p-10 text-center text-muted-foreground">No announcements found.</div>;
    }

    return (
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement._id} className="rounded-lg border bg-card p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex-grow">
              <p className="font-semibold text-lg">{announcement.title}</p>
              <p className="text-sm text-muted-foreground">
                {/* --- THIS IS THE FIX --- */}
                Created on: <FormattedDate date={announcement.createdAt} formatType="short" />
                {/* --- END OF FIX --- */}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 w-full sm:w-auto">
              <Badge variant={announcement.visible ? "default" : "secondary"} className="flex items-center w-fit">
                {announcement.visible ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                {announcement.visible ? 'Visible' : 'Hidden'}
              </Badge>
              <div className="flex gap-2 justify-end flex-grow sm:flex-grow-0">
                <UpdateAnnouncementModal announcement={announcement} onUpdateSuccess={refetch} />
                <DeleteAnnouncementModal announcementId={announcement._id} onDeleteSuccess={refetch} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Announcement Manager</h2>
          <p className="text-muted-foreground">Create, edit, and manage all platform announcements.</p>
        </div>
        <CreateAnnouncementModal onCreateSuccess={refetch} />
      </div>

      {renderContent()}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }} />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 py-2 text-sm">Page {currentPage} of {totalPages}</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AdminManageAnnouncements;