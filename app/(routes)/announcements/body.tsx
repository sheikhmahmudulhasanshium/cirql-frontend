'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  Loader2,
  ArrowUpDown,
  ChevronsLeft,
  ListFilter,
  ChevronsRight, // Added missing ChevronLeft import
} from 'lucide-react';

// Hooks & Types
import apiClient from '@/lib/apiClient';
import { Announcement } from '@/lib/types';

// UI Components
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Page Structure & Content Components
import BasicPageProvider from '@/components/providers/basic-page-provider';
import Footer from '../components/footer';
import Header from '../components/header-sign-out';
import AnnouncementCard from './announcement-card';

// ============================================================================
// Local Enum for Type-Safety
// ============================================================================
enum AnnouncementType {
  UPCOMING = 'Upcoming',
  LATEST_UPDATES = 'Latest Updates',
  COMPANY_NEWS = 'Company News',
  GENERAL = 'General',
}

// ============================================================================
// Custom Hook to handle all client-side logic
// ============================================================================
const usePublicAnnouncements = ({ itemsPerPage = 5, initialSortBy = 'createdAt:desc' }) => {
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filterType, setFilterType] = useState<AnnouncementType | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(initialSortBy);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    apiClient.get<{ data: Announcement[] }>('/announcements?limit=1000', { signal: controller.signal })
      .then(response => setAllAnnouncements(response.data.data))
      .catch(err => err.name !== 'CanceledError' && setError(err))
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    if (!filterType) return allAnnouncements;
    return allAnnouncements.filter(ann => ann.type === filterType);
  }, [allAnnouncements, filterType]);

  const sortedAnnouncements = useMemo(() => {
    const sortable = [...filteredAnnouncements];
    const [field, order] = sortBy.split(':');
    sortable.sort((a, b) => {
      const valA = a[field as keyof Announcement];
      const valB = b[field as keyof Announcement];
      if (valA == null && valB == null) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;
      const comparison = valA > valB ? 1 : valA < valB ? -1 : 0;
      return order === 'desc' ? comparison * -1 : comparison;
    });
    return sortable;
  }, [filteredAnnouncements, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, sortBy]);

  const totalPages = Math.ceil(sortedAnnouncements.length / itemsPerPage);
  const paginatedAnnouncements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAnnouncements.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAnnouncements, currentPage, itemsPerPage]);

  return {
    announcements: paginatedAnnouncements, isLoading, error, currentPage, totalPages,
    setPage: setCurrentPage, sortBy, setSortBy, filterType, setFilterType,
    hasData: sortedAnnouncements.length > 0,
  };
};

// ============================================================================
// 1. Reusable Pagination Component (Helper)
// ============================================================================
interface AnnouncementsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const AnnouncementsPagination = ({ currentPage, totalPages, onPageChange, siblingCount = 1 }: AnnouncementsPaginationProps) => {
    const paginationRange = useMemo(() => {
        const totalPageNumbers = siblingCount + 5;
        if (totalPageNumbers >= totalPages) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;
        
        if (!shouldShowLeftDots && shouldShowRightDots) {
            // FIX: Changed 'let' to 'const' as the variables are not reassigned.
            const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
            return [...leftRange, '...', totalPages];
        }
        if (shouldShowLeftDots && !shouldShowRightDots) {
            // FIX: Changed 'let' to 'const'
            const rightRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1);
            return [1, '...', ...rightRange];
        }
        if (shouldShowLeftDots && shouldShowRightDots) {
            // FIX: Changed 'let' to 'const'
            const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
            return [1, '...', ...middleRange, '...', totalPages];
        }
        return [];
    }, [totalPages, currentPage, siblingCount]);

    if (totalPages <= 1) return null;

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <Button variant="ghost" size="icon" onClick={() => onPageChange(1)} disabled={currentPage === 1} aria-label="Go to first page"><ChevronsLeft className="h-4 w-4" /></Button>
                </PaginationItem>
                <PaginationItem>
                    <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
                </PaginationItem>
                {paginationRange.map((page, index) =>
                    typeof page === 'string' ? <PaginationEllipsis key={`ellipsis-${index}`} /> : <PaginationItem key={page}><PaginationLink onClick={() => onPageChange(page)} isActive={currentPage === page}>{page}</PaginationLink></PaginationItem>
                )}
                <PaginationItem>
                    <PaginationNext onClick={() => onPageChange(currentPage + 1)} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} />
                </PaginationItem>
                <PaginationItem>
                    <Button variant="ghost" size="icon" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} aria-label="Go to last page"><ChevronsRight className="h-4 w-4" /></Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

// ============================================================================
// 2. Core Content Component
// ============================================================================
export const AnnouncementsBody = () => {
  const {
    announcements, isLoading, error, currentPage, totalPages,
    setPage, sortBy, setSortBy, filterType, setFilterType, hasData,
  } = usePublicAnnouncements({ itemsPerPage: 5 });

  const typeEmojiMap: Record<AnnouncementType, string> = {
    [AnnouncementType.UPCOMING]: '🗓️',
    [AnnouncementType.LATEST_UPDATES]: '🚀',
    [AnnouncementType.COMPANY_NEWS]: '🏢',
    [AnnouncementType.GENERAL]: '📢',
  };

  const sortOptions: Record<string, { label: string; emoji: string }> = {
    'createdAt:desc': { label: 'Newest First', emoji: '⏳' },
    'createdAt:asc': { label: 'Oldest First', emoji: '⌛️' },
    'title:asc': { label: 'Title (A-Z)', emoji: '🔤' },
    'title:desc': { label: 'Title (Z-A)', emoji: '🔡' },
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex min-h-[300px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }
    if (error) {
      return <div className="py-10 text-center text-destructive">Could not load announcements.</div>;
    }
    if (announcements.length === 0) {
      return <div className="py-10 text-center text-muted-foreground">No announcements found matching your criteria.</div>;
    }
    return (
      <div className="space-y-4">
        {announcements.map((ann) => (
          <AnnouncementCard key={ann._id} announcement={ann} />
        ))}
      </div>
    );
  };

  return (
    <main className="container mx-auto max-w-3xl py-8 px-4 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="font-bold mb-8 text-center text-3xl font-geistSans lg:text-6xl md:text-4xl sm:text-3xl bg-gradient-to-tl from-slate-500 to-yellow-100 dark:from-blue-500 dark:to-cyan-300 text-transparent bg-clip-text py-4 animate-accordion-down" id='announcements'>Announcements</h1>
        <p className="mt-4 text-lg text-muted-foreground">The latest news, updates, and sneak peeks from our team.</p>
      </div>

      {hasData && (
        <div className="mb-6 flex w-full items-center justify-between gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[48%] justify-start sm:w-[180px]">
                <ListFilter className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                {filterType ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4">{typeEmojiMap[filterType]}</span>
                    <span className="truncate">{filterType}</span>
                  </span>
                ) : 'Filter by type'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px]">
              <DropdownMenuRadioGroup value={filterType} onValueChange={(value) => setFilterType(value === 'All' ? undefined : value as AnnouncementType)}>
                <DropdownMenuRadioItem value="All">
                  <span className="flex items-center gap-2"><span className="w-4">🌐</span><span>All Types</span></span>
                </DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                {Object.values(AnnouncementType).map(type => (
                  <DropdownMenuRadioItem key={type} value={type}>
                    <span className="flex items-center gap-2"><span className="w-4">{typeEmojiMap[type]}</span><span>{type}</span></span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[48%] justify-start sm:w-[180px]">
                <ArrowUpDown className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="truncate">{sortOptions[sortBy]?.label || 'Sort'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                {Object.entries(sortOptions).map(([value, { label, emoji }]) => (
                  <DropdownMenuRadioItem key={value} value={value}>
                    <span className="flex items-center gap-2"><span className="w-4">{emoji}</span><span>{label}</span></span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      <div className="min-h-[400px]">{renderContent()}</div>
      
      <div className="pt-8">
        <AnnouncementsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </main>
  );
};

// ============================================================================
// 3. Main Page Layout Component (The final exported component)
// ============================================================================
const Body = () => {
  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <AnnouncementsBody />
    </BasicPageProvider>
  );
};

export default Body;