// app/(routes)/contacts/[ticketId]/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react'; // Import useCallback
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/components/contexts/AuthContext';
import { TicketDetails, TicketMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send } from 'lucide-react';
import BasicPageProvider from '@/components/providers/basic-page-provider';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { toast } from 'sonner';

const MessageBubble = ({ message, isUserMessage }: { message: TicketMessage, isUserMessage: boolean }) => {
  const isAdminReply = message.sender.roles.includes('admin') || message.sender.roles.includes('owner');
  
  return (
    <div className={`flex items-start gap-3 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      {!isUserMessage && (
        <Avatar className="w-10 h-10 border">
          <AvatarImage src={message.sender.picture} />
          <AvatarFallback>{message.sender.firstName?.charAt(0) || 'A'}</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col ${isUserMessage ? 'items-end' : 'items-start'}`}>
        <div className={`p-3 rounded-lg max-w-md md:max-w-xl ${isUserMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isAdminReply && !isUserMessage ? `${message.sender.firstName} (Support)` : message.sender.firstName}
          {' · '}
          {new Date(message.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default function TicketConversationPage() {
    const { state: { user } } = useAuth();
    const params = useParams();
    const router = useRouter();
    const ticketId = params.ticketId as string;
    
    const [ticket, setTicket] = useState<TicketDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // --- FIX START: Wrap fetchTicket in useCallback ---
    const fetchTicket = useCallback(async () => {
        if (!ticketId) return;
        try {
            const response = await apiClient.get(`/support/tickets/${ticketId}`);
            setTicket(response.data);
        } catch { // The `error` variable is not needed, so we can omit it.
            toast.error('Failed to load ticket', { description: 'You may not have permission to view this, or it may not exist.' });
            router.push('/contacts');
        } finally {
            setIsLoading(false);
        }
    }, [ticketId, router]); // Add dependencies for useCallback
    // --- FIX END ---

    useEffect(() => {
        fetchTicket();
    // --- FIX START: Add fetchTicket to the dependency array ---
    }, [fetchTicket]);
    // --- FIX END ---

    useEffect(scrollToBottom, [ticket?.messages]);

    const handleReply = async () => {
        if (replyContent.trim().length === 0) return;
        setIsReplying(true);
        try {
            await apiClient.post(`/support/tickets/${ticketId}/messages`, {
                content: replyContent,
            });
            setReplyContent('');
            toast.success('Reply sent!');
            await fetchTicket(); // Refetch to show the new message
        } catch { // The `error` variable is not needed here either.
            toast.error('Failed to send reply.');
        } finally {
            setIsReplying(false);
        }
    };

    if (isLoading) {
      return (
        <BasicPageProvider header={<Header />} footer={<Footer />}>
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </BasicPageProvider>
      );
    }
    
    if (!ticket) return null;

    return (
        <BasicPageProvider header={<Header />} footer={<Footer />}>
            <main className="container mx-auto max-w-3xl px-4 py-8">
                <h1 className="text-2xl font-bold tracking-tight mb-1">{ticket.subject}</h1>
                <p className="text-muted-foreground mb-8">Status: {ticket.status}</p>
                
                <div className="space-y-6">
                    {ticket.messages.map(message => (
                        <MessageBubble key={message._id} message={message} isUserMessage={message.sender._id === user?._id} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-10 pt-6 border-t">
                    <h2 className="text-lg font-semibold mb-3">Add a Reply</h2>
                    <Textarea 
                        value={replyContent} 
                        onChange={e => setReplyContent(e.target.value)} 
                        placeholder="Type your reply here..."
                        className="min-h-[120px]"
                        disabled={isReplying}
                    />
                    <Button onClick={handleReply} className="mt-3 w-full" disabled={isReplying || replyContent.trim().length === 0}>
                        {isReplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Send Reply
                    </Button>
                </div>
            </main>
        </BasicPageProvider>
    );
}