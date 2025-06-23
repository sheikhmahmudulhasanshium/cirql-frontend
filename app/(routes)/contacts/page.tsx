// app/contacts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { TicketSummary, TicketStatus } from '@/lib/types';
import { useAuth } from '@/components/contexts/AuthContext';
import { PlusCircle, MessageSquare, Loader2, ServerCrash } from 'lucide-react';
import BasicPageProvider from '@/components/providers/basic-page-provider';
import Header from '../components/header'; // Assuming a generic header
import Footer from '../components/footer';

// Helper to get a color based on ticket status
const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.OPEN:
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    case TicketStatus.PENDING_USER_REPLY:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
    case TicketStatus.CLOSED:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

export default function ContactsDashboardPage() {
  const router = useRouter();
  const { state } = useAuth();
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === 'authenticated') {
      setIsLoading(true);
      apiClient.get('/support/tickets')
        .then(response => {
          setTickets(response.data);
        })
        .catch(() => {
          setError('Could not load your support tickets. Please try again later.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (state.status === 'unauthenticated') {
      // If user is not logged in, redirect them away
      router.push('/sign-in');
    }
  }, [state.status, router]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-10">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading your tickets...</p>
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
        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <MessageSquare className="w-12 h-12 text-muted-foreground" />
          <h2 className="mt-6 text-xl font-semibold">No tickets yet</h2>
          <p className="mt-2 text-muted-foreground">Get started by creating your first support ticket.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tickets.map(ticket => (
          <Link href={`/contacts/${ticket._id}`} key={ticket._id} className="block p-4 border rounded-lg hover:bg-accent transition-colors">
            <div className="flex justify-between items-center gap-4">
              <p className="font-semibold truncate">{ticket.subject}</p>
              <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Category: {ticket.category} · Last updated: {new Date(ticket.updatedAt).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <BasicPageProvider header={<Header/>} footer={<Footer/>}>
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
          <Link href="/contacts/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Ticket
            </Button>
          </Link>
        </div>
        {renderContent()}
      </main>
    </BasicPageProvider>
  );
}