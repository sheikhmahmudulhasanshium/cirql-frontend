// components/admin/admin-manage-tickets.tsx
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Loader2, ServerCrash, Inbox, User, Mail, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Combined Ticket Type for Admin View
interface AdminTicket {
  _id: string;
  subject: string;
  category: string;
  status: string;
  updatedAt: string;
  user?: { // This will exist for logged-in users
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  guestName?: string; // This will exist for guests
  guestEmail?: string;
}

const AdminManageTickets = () => {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    apiClient.get('/support/admin/tickets')
      .then(res => {
        setTickets(res.data);
      })
      .catch(() => {
        setError('Could not load support tickets.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getSubmitterInfo = (ticket: AdminTicket) => {
    if (ticket.user) {
      return {
        name: `${ticket.user.firstName || ''} ${ticket.user.lastName || ''}`.trim(),
        detail: ticket.user.email || 'Registered User',
        icon: <User className="h-5 w-5 text-primary" />,
      };
    }
    if (ticket.guestName) {
      return {
        name: ticket.guestName,
        detail: ticket.guestEmail || 'Guest User',
        icon: <Mail className="h-5 w-5 text-accent-foreground" />,
      };
    }
    return { name: 'Anonymous', detail: 'No submitter info', icon: <User className="h-5 w-5 text-muted-foreground" /> };
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
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">{submitter.icon}</div>
                <div>
                  <p className="font-semibold">{ticket.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    From: {submitter.name} ({submitter.detail})
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full">{ticket.status}</div>
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