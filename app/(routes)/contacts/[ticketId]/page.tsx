// app/(routes)/contacts/[ticketId]/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/components/contexts/AuthContext';
import { TicketDetails, TicketMessage, TicketStatus, Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, Lock } from 'lucide-react'; 
import BasicPageProvider from '@/components/providers/basic-page-provider';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const MessageBubble = ({ message, isUserMessage }: { message: TicketMessage, isUserMessage: boolean }) => {
  const isAdminReply = message.sender.roles.includes(Role.Admin) || message.sender.roles.includes(Role.Owner);
  
  return (
    <div className={`flex items-start gap-3 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      {!isUserMessage && (
        <Avatar className="w-10 h-10 border">
          <AvatarImage src={message.sender.picture} />
          <AvatarFallback>{message.sender.firstName?.charAt(0)?.toUpperCase() || 'A'}</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col ${isUserMessage ? 'items-end' : 'items-start'}`}>
        <div className={`p-3 rounded-lg max-w-md md:max-w-xl ${isUserMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          {/* --- START OF FIX --- */}
          {/* Added the 'break-words' class to handle long, unbroken strings */}
          <p className="text-sm break-words" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
          {/* --- END OF FIX --- */}
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
    const { state: { user, isAdmin } } = useAuth();
    const params = useParams();
    const router = useRouter();
    const ticketId = params.ticketId as string;
    
    const [ticket, setTicket] = useState<TicketDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchTicket = useCallback(async () => {
        if (!ticketId) return;
        try {
            const response = await apiClient.get(`/support/tickets/${ticketId}`);
            setTicket(response.data);
            
            apiClient.post(`/support/tickets/${ticketId}/seen`).catch(err => console.error("Silent error: Failed to mark ticket as seen:", err));

        } catch {
            toast.error('Failed to load ticket', { description: 'You may not have permission to view this, or it may not exist.' });
            router.push('/contacts');
        } finally {
            setIsLoading(false);
        }
    }, [ticketId, router]);

    useEffect(() => {
        if (user) {
            fetchTicket();
        }
    }, [fetchTicket, user]);

    useEffect(scrollToBottom, [ticket?.messages]);

    const unseenMessageCount = useMemo(() => {
      if (!ticket || !user) return 0;
      
      const lastSeenTimestamp = isAdmin ? ticket.lastSeenByAdminAt : ticket.lastSeenByUserAt;
      
      if (!lastSeenTimestamp) {
        return ticket.messages.filter(msg => msg.sender._id !== user._id).length;
      }

      const lastSeenDate = new Date(lastSeenTimestamp);
      return ticket.messages.filter(msg => new Date(msg.createdAt) > lastSeenDate).length;
    }, [ticket, user, isAdmin]);

    const handleReply = async () => {
        if (replyContent.trim().length === 0 || isReplying) return;
        setIsReplying(true);
        try {
            await apiClient.post(`/support/tickets/${ticketId}/messages`, {
                content: replyContent,
            });
            setReplyContent('');
            toast.success('Reply sent!');
            await fetchTicket(); 
        } catch {
            toast.error('Failed to send reply.');
        } finally {
            setIsReplying(false);
        }
    };

    const handleCloseTicket = async () => {
        if (isClosing) return;
        setIsClosing(true);
        try {
            await apiClient.patch(`/support/tickets/${ticketId}/close`);
            toast.success("Ticket has been closed.");
            await fetchTicket();
        } catch {
            toast.error("Failed to close ticket.");
        } finally {
            setIsClosing(false);
        }
    }

    if (isLoading || !user) {
      return (
        <BasicPageProvider header={<Header />} footer={<Footer />}>
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </BasicPageProvider>
      );
    }
    
    if (!ticket) return null;

    const isTicketClosed = ticket.status === TicketStatus.CLOSED;

    return (
        <BasicPageProvider header={<Header />} footer={<Footer />}>
            <main className="container mx-auto max-w-3xl px-4 py-8">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <h1 className="text-2xl font-bold tracking-tight">{ticket.subject}</h1>
                    {isAdmin && !isTicketClosed && (
                        <Button variant="destructive" size="sm" onClick={handleCloseTicket} disabled={isClosing}>
                            {isClosing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                            Close Ticket
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2 mb-8">
                  <p className="text-muted-foreground">Status: {ticket.status}</p>
                  {unseenMessageCount > 0 && !isTicketClosed && (
                    <Badge variant="default">{unseenMessageCount} New</Badge>
                  )}
                </div>
                
                <div className="space-y-6">
                    {ticket.messages.map(message => (
                        <MessageBubble key={message._id} message={message} isUserMessage={message.sender._id === user?._id} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-10 pt-6 border-t">
                    {isTicketClosed ? (
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <Lock className="mx-auto h-6 w-6 text-muted-foreground" />
                            <p className="mt-2 font-semibold">This ticket is closed.</p>
                            <p className="text-sm text-muted-foreground">Further replies cannot be added.</p>
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </main>
        </BasicPageProvider>
    );
}