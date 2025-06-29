// components/hooks/announcements/get-announcements-public.ts
import { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/apiClient';
import { Announcement } from '@/lib/types';

interface PaginatedResponse {
  data: Announcement[];
  total: number;
}

interface UsePublicAnnouncementsProps {
  itemsPerPage?: number;
  initialSortBy?: string;
}

/**
 * A hook to fetch all public announcements and handle client-side pagination and sorting.
 * This is designed to work without a paginated backend API.
 */
const usePublicAnnouncements = ({ itemsPerPage = 5, initialSortBy = 'createdAt:desc' }: UsePublicAnnouncementsProps = {}) => {
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(initialSortBy);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    apiClient.get<PaginatedResponse>('/announcements?limit=1000', { signal: controller.signal })
      .then(response => {
        setAllAnnouncements(response.data.data);
      })
      .catch(err => {
        if (err.name !== 'CanceledError') {
          setError(err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  const sortedAnnouncements = useMemo(() => {
    const sortable = [...allAnnouncements];
    const [field, order] = sortBy.split(':');

    sortable.sort((a, b) => {
      const valA = a[field as keyof Announcement];
      const valB = b[field as keyof Announcement];

      // --- START: FIX FOR 'possibly null or undefined' ERROR ---
      // This logic handles null or undefined values, pushing them to the end of the list.
      // Using `== null` checks for both `null` and `undefined`.
      const aIsNull = valA == null;
      const bIsNull = valB == null;

      if (aIsNull && bIsNull) return 0; // Both are null, treat as equal
      if (aIsNull) return 1;             // A is null, so it should come after B
      if (bIsNull) return -1;            // B is null, so it should come after A
      // --- END: FIX ---
      
      // At this point, neither value is null, so we can safely compare them.
      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
      
      return order === 'desc' ? comparison * -1 : comparison;
    });
    return sortable;
  }, [allAnnouncements, sortBy]);

  const paginatedAnnouncements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAnnouncements.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAnnouncements, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAnnouncements.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const setPage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return { 
    announcements: paginatedAnnouncements, 
    isLoading: isLoading && allAnnouncements.length === 0,
    error,
    currentPage,
    totalPages,
    setPage,
    sortBy,
    setSortBy,
  };
};

export default usePublicAnnouncements;