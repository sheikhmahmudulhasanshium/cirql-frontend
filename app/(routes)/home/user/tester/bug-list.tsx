'use client';

import { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/apiClient';
// --- FIX: useAuth is no longer needed in this component ---
// import { useAuth } from '@/components/contexts/AuthContext';
import { TicketSummary, TicketStatus } from '@/lib/types';
import { Loader2, ServerCrash, Inbox, ArrowUpDown, LifeBuoy, ListFilter } from 'lucide-react';
import { FormattedDate } from '@/lib/FormattedDate';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.OPEN: return 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300';
    case TicketStatus.PENDING_USER_REPLY: return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
    case TicketStatus.CLOSED: return 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400';
    default: return 'border-gray-200 bg-gray-100';
  }
};

type SortOption = 'updatedAt:desc' | 'updatedAt:asc' | 'subject:asc' | 'subject:desc';

const BugList = () => {
  // --- FIX: The unused `state` variable has been removed ---
  const [myTickets, setMyTickets] = useState<TicketSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt:desc');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');

  useEffect(() => {
    const controller = new AbortController();
    
    apiClient.get<TicketSummary[]>('/support/tickets', { signal: controller.signal })
      .then(res => {
        setMyTickets(res.data);
      })
      .catch(err => {
        if (err.name !== 'CanceledError') setError('Could not load your tickets.');
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, []);

  const filteredAndSortedBugs = useMemo(() => {
    let bugs = [...myTickets];

    if (filterStatus !== 'all') {
      bugs = bugs.filter(bug => bug.status === filterStatus);
    }
    
    const [field, order] = sortBy.split(':');
    bugs.sort((a, b) => {
      // --- START OF FIX: Use type-safe casting instead of 'any' ---
      const valA = a[field as keyof TicketSummary] as string | number;
      const valB = b[field as keyof TicketSummary] as string | number;
      // --- END OF FIX ---
      const comparison = valA > valB ? 1 : valA < valB ? -1 : 0;
      return order === 'desc' ? -comparison : comparison;
    });

    return bugs;
  }, [myTickets, sortBy, filterStatus]);


  if (isLoading) {
    return <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (error) {
    return <div className="text-center p-10 bg-destructive/10 rounded-lg"><ServerCrash className="mx-auto w-8 h-8 text-destructive" /><p className="mt-4 font-semibold text-destructive">{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center p-4 border bg-card rounded-lg">
        <div>
          <h2 className="text-xl font-bold">My Submitted Tickets</h2>
          <p className="text-muted-foreground">A list of all the support tickets you&apos;ve created.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto justify-start sm:justify-center">
                <ListFilter className="mr-2 h-4 w-4" /> Filter Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={filterStatus} onValueChange={(v) => setFilterStatus(v as TicketStatus | 'all')}>
                <DropdownMenuRadioItem value="all">🌐 All Status</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={TicketStatus.OPEN}>🟢 Open</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={TicketStatus.PENDING_USER_REPLY}>🟡 Pending Reply</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={TicketStatus.CLOSED}>🔴 Closed</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto justify-start sm:justify-center">
                <ArrowUpDown className="mr-2 h-4 w-4" /> Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <DropdownMenuRadioItem value="updatedAt:desc">⏳ Last Updated</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="updatedAt:asc">⌛️ First Updated</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="subject:asc">🔤 Alphabetical (A-Z)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="subject:desc">🔡 Alphabetical (Z-A)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredAndSortedBugs.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedBugs.map(ticket => (
            <div key={ticket._id} className={`p-3 sm:p-4 border-l-4 rounded-lg bg-card ${getStatusColor(ticket.status)}`}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base sm:text-lg truncate">{ticket.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: <FormattedDate date={ticket.updatedAt} formatType="short" />
                  </p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto flex justify-end pt-2 sm:pt-0">
                   <Link href={`/contacts/${ticket._id}`} passHref>
                      <Button size="sm" variant="outline" className="w-full sm:w-auto">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        View
                      </Button>
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-10 border-2 border-dashed rounded-lg">
          <Inbox className="mx-auto w-12 h-12 text-muted-foreground" />
          <h2 className="mt-6 text-xl font-semibold">No Tickets Found</h2>
          <p className="mt-2 text-muted-foreground">No tickets match your current filters, or you haven&apos;t submitted any yet.</p>
        </div>
      )}
    </div>
  );
};

export default BugList;