// app/(routes)/home/user/admin/admin-messages.tsx
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Loader2, ServerCrash, Inbox, Mail, LifeBuoy, ListFilter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { TicketSummary, TicketStatus } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormattedDate } from '@/lib/FormattedDate';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define the types for our new filter and sort controls
type FilterStatus = TicketStatus | 'all' | 'locked';
type SortOption = 'updatedAt:desc' | 'updatedAt:asc' | 'subject:asc' | 'subject:desc';

// Updated helper to account for the 'locked' state
const getStatusColor = (status: TicketStatus, isLocked: boolean) => {
    if (isLocked) return 'border-purple-500/50 bg-purple-500/10 text-purple-600 dark:text-purple-400';
    switch (status) {
      case TicketStatus.OPEN: return 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300';
      case TicketStatus.PENDING_USER_REPLY: return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
      case TicketStatus.CLOSED: return 'border-gray-500/50 bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default: return 'border-gray-200 bg-gray-100';
    }
};

const getSubmitterInfo = (ticket: TicketSummary) => {
    if (ticket.user) {
      return {
        isGuest: false,
        name: `${ticket.user.firstName || ''} ${ticket.user.lastName || ''}`.trim() || 'Unnamed User',
        picture: ticket.user.picture,
        fallback: (ticket.user.firstName?.charAt(0) || 'U').toUpperCase(),
      };
    }
    return {
      isGuest: true,
      name: ticket.guestName || 'Anonymous Guest',
      picture: undefined,
      fallback: 'G',
    };
};

const AdminMessages = () => {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Add state for sorting and filtering
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt:desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    // Dynamically build query parameters based on state
    const params = new URLSearchParams();
    params.append('sortBy', sortBy);

    if (filterStatus === 'locked') {
        params.append('isLocked', 'true');
    } else if (filterStatus !== 'all') {
        params.append('status', filterStatus);
        params.append('isLocked', 'false');
    }

    apiClient.get(`/support/admin/tickets?${params.toString()}`, { signal: controller.signal })
      .then(res => {
        setTickets(res.data);
      })
      .catch((err) => {
        if (err.name !== 'CanceledError') {
          setError('Could not load support tickets.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
      
    return () => {
      controller.abort();
    };
  }, [sortBy, filterStatus]); // Re-fetch data when sort or filter changes

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 bg-destructive/10 border border-destructive rounded-lg">
        <ServerCrash className="w-8 h-8 text-destructive" />
        <p className="mt-4 font-semibold text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center p-4 border bg-card rounded-lg">
        <div>
          <h2 className="text-xl font-bold">Unified Support Inbox</h2>
          <p className="text-muted-foreground">Review and manage all tickets.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-start sm:justify-center">
                    <ListFilter className="mr-2 h-4 w-4" /> Filter Status
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
                    <DropdownMenuRadioItem value="all">🌐 All Tickets</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={TicketStatus.OPEN}>🟢 Open</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={TicketStatus.PENDING_USER_REPLY}>🟡 Pending Reply</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="locked">🔒 Locked</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={TicketStatus.CLOSED}>⚪️ Closed</DropdownMenuRadioItem>
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
                    <DropdownMenuRadioItem value="subject:asc">🔤 Subject (A-Z)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="subject:desc">🔡 Subject (Z-A)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {tickets.length > 0 ? (
        <div className="space-y-4">
            {tickets.map((ticket) => {
            const submitter = getSubmitterInfo(ticket);
            return (
              <div key={ticket._id} className={`p-3 sm:p-4 border-l-4 rounded-lg bg-card ${getStatusColor(ticket.status, ticket.isLocked)}`}>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex-shrink-0 pt-1">
                            {submitter.isGuest ? (
                                <Mail className="h-6 w-6 text-muted-foreground" />
                            ) : (
                                <Avatar className="h-8 w-8">
                                <AvatarImage src={submitter.picture} />
                                <AvatarFallback>{submitter.fallback}</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold truncate">{ticket.subject}</p>
                            <p className="text-sm text-muted-foreground truncate">By: {submitter.name}</p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        {ticket.hasUnseenMessages && !ticket.isLocked && (
                            <div className="flex items-center justify-end gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                                <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span> New
                            </div>
                        )}
                        <div className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full whitespace-nowrap">
                            {ticket.isLocked ? "Locked" : ticket.status}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-end pt-3 mt-3 border-t border-inherit">
                    <p className="text-xs text-muted-foreground">Last updated: <FormattedDate date={ticket.updatedAt} formatType="short" /></p>

                    <Button size="sm" onClick={() => router.push(`/contacts/${ticket._id}`)}>
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        View & Reply
                    </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-10 border-2 border-dashed rounded-lg">
          <Inbox className="mx-auto w-12 h-12 text-muted-foreground" />
          <h2 className="mt-6 text-xl font-semibold">No Tickets Found</h2>
          <p className="mt-2 text-muted-foreground">No tickets match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;