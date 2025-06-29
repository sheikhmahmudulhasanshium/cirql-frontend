// components/admin/admin-manage-tickets.tsx
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Loader2, ServerCrash, Inbox, User, Mail, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { TicketSummary } from '@/lib/types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
// --- START OF FIX: Removed unused 'get' import ---
// import { get } from 'http'; 
// --- END OF FIX ---

const AdminManageTickets = () => {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // This is a more robust way to handle the API call in Strict Mode
    const controller = new AbortController();
    setIsLoading(true);

    apiClient.get('/support/admin/tickets', { signal: controller.signal })
      .then(res => {
        setTickets(res.data);
      })
      .catch((err) => {
        // Don't set an error state if the request was intentionally canceled
        if (err.name !== 'CanceledError') {
          setError('Could not load support tickets.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
      
    // The cleanup function will run on unmount
    return () => {
      controller.abort();
    };
  }, []);

  const getSubmitterInfo = (ticket: TicketSummary) => {
    if (ticket.user) {
      return {
        isGuest: false,
        name: `${ticket.user.firstName || ''} ${ticket.user.lastName || ''}`.trim() || 'Unnamed User',
        detail: ticket.user.email || 'No Email Provided',
        picture: ticket.user.picture,
        fallback: (ticket.user.firstName?.charAt(0) || 'U').toUpperCase(),
      };
    }
    return {
      isGuest: true,
      name: ticket.guestName || 'Anonymous Guest',
      detail: ticket.guestEmail || 'No Email Provided',
      picture: undefined,
      fallback: 'G',
    };
  };

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

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg bg-card">
        <Inbox className="w-12 h-12 text-muted-foreground" />
        <h2 className="mt-6 text-xl font-semibold">Ticket Queue is Empty</h2>
        <p className="mt-2 text-muted-foreground">No support tickets have been created yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="px-1 pt-1">
        <h3 className="text-xl font-semibold">Unified Support Tickets</h3>
        <p className="text-muted-foreground mt-1">Showing all tickets from guests and registered users.</p>
      </div>
      {tickets.map((ticket) => {
        const submitter = getSubmitterInfo(ticket);
        return (
          <div key={ticket._id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-4 min-w-0">
                 {ticket.hasUnseenMessages ? (
                  <span className="h-2.5 w-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1" title="New messages"></span>
                ) : (
                  <span className="h-2.5 w-2.5 flex-shrink-0 mt-1"></span>
                )}
                <div className="flex-shrink-0">
                  {submitter.isGuest ? (
                    <Mail className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={submitter.picture} />
                      <AvatarFallback>{submitter.fallback}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                {/* --- START OF FIX: Simplified Layout --- */}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{ticket.subject}</p>
                  {/* The long "From:" line is removed to prevent overflow. */}
                  {/* We now just show the name, which is much shorter. */}
                  <p className="text-sm text-muted-foreground truncate">
                    By: {submitter.name}
                  </p>
                </div>
                {/* --- END OF FIX --- */}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full whitespace-nowrap">{ticket.status}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(ticket.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-3 mt-3 border-t">
              <Button size="sm" onClick={() => router.push(`/contacts/${ticket._id}`)}>
                <LifeBuoy className="mr-2 h-4 w-4" />
                View & Reply
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminManageTickets;