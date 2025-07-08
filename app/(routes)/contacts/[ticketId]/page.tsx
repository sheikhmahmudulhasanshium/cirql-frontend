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
import { Loader2, Send, Lock, Unlock, Pencil, Ban } from 'lucide-react';
import BasicPageProvider from '@/components/providers/basic-page-provider';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { RelativeTime } from '@/lib/RelativeTime';
import { editMessage, lockTicket, unlockTicket } from '@/components/hooks/support/use-ticket-action';

const TicketConversationPage = () => {
    const { state: { user, isAdmin } } = useAuth();
    const params = useParams();
    const router = useRouter();
    const ticketId = params.ticketId as string;
    
    const [ticket, setTicket] = useState<TicketDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [isSubmittingAction, setIsSubmittingAction] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState('');

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
      if (!lastSeenTimestamp) return ticket.messages.filter(msg => msg.sender._id !== user._id).length;
      const lastSeenDate = new Date(lastSeenTimestamp);
      return ticket.messages.filter(msg => new Date(msg.createdAt) > lastSeenDate).length;
    }, [ticket, user, isAdmin]);

    const handleReply = async () => {
        if (replyContent.trim().length === 0 || isReplying) return;
        setIsReplying(true);
        try {
            await apiClient.post(`/support/tickets/${ticketId}/messages`, { content: replyContent });
            setReplyContent('');
            toast.success('Reply sent!');
            await fetchTicket(); 
        } catch {
            toast.error('Failed to send reply.');
        } finally {
            setIsReplying(false);
        }
    };

    const handleToggleLock = async () => {
        if (!ticket || isSubmittingAction) return;
        setIsSubmittingAction(true);
        try {
            if (ticket.isLocked) {
                await unlockTicket(ticketId);
            } else {
                await lockTicket(ticketId);
            }
            await fetchTicket();
        } finally {
            setIsSubmittingAction(false);
        }
    };

    const handleCloseTicket = async () => {
        if (isSubmittingAction) return;
        setIsSubmittingAction(true);
        try {
            await apiClient.patch(`/support/tickets/${ticketId}/close`);
            toast.success("Ticket has been closed.");
            await fetchTicket();
        } catch {
            toast.error("Failed to close ticket.");
        } finally {
            setIsSubmittingAction(false);
        }
    };

    const handleStartEdit = (message: TicketMessage) => {
        setEditingMessageId(message._id);
        setEditedContent(message.content);
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditedContent('');
    };

    const handleSaveEdit = async () => {
        if (!editingMessageId || isSubmittingAction) return;
        setIsSubmittingAction(true);
        try {
            await editMessage(editingMessageId, editedContent);
            await fetchTicket();
            handleCancelEdit();
        } finally {
            setIsSubmittingAction(false);
        }
    };

    if (isLoading || !user) {
      return (
        <BasicPageProvider header={<Header />} footer={<Footer />}>
          <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin" /></div>
        </BasicPageProvider>
      );
    }
    
    if (!ticket) return null;

    const isTicketClosed = ticket.status === TicketStatus.CLOSED;
    const isTicketLocked = ticket.isLocked;
    const canInteract = !isTicketClosed && !isTicketLocked;

    return (
        <BasicPageProvider header={<Header />} footer={<Footer />}>
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-2">
                    <h1 className="text-2xl font-bold tracking-tight">{ticket.subject}</h1>
                    {isAdmin && !isTicketClosed && (
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="outline" size="sm" onClick={handleToggleLock} disabled={isSubmittingAction} className="flex-1 sm:flex-auto">
                                {isSubmittingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : (ticket.isLocked ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />)}
                                {ticket.isLocked ? 'Unlock' : 'Lock'}
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleCloseTicket} disabled={isSubmittingAction} className="flex-1 sm:flex-auto">
                                {isSubmittingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Ban className="mr-2 h-4 w-4" />}
                                Close Ticket
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mb-8">
                  <p className="text-muted-foreground">Status: {ticket.status}</p>
                  {unseenMessageCount > 0 && !isTicketClosed && <Badge variant="default">{unseenMessageCount} New</Badge>}
                  {isTicketLocked && <Badge variant="destructive"><Lock className="mr-1.5 h-3 w-3"/>Locked</Badge>}
                </div>
                
                <div className="space-y-6">
                    {ticket.messages.map(message => {
                        const isUserMessage = message.sender._id === user?._id;
                        const canEdit = isUserMessage && canInteract;

                        if (editingMessageId === message._id) {
                            return (
                                <div key={message._id} className="p-3 rounded-lg bg-muted border border-primary">
                                    <Textarea value={editedContent} onChange={e => setEditedContent(e.target.value)} className="min-h-[100px] bg-background" disabled={isSubmittingAction} />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <Button variant="ghost" size="sm" onClick={handleCancelEdit} disabled={isSubmittingAction}>Cancel</Button>
                                        <Button size="sm" onClick={handleSaveEdit} disabled={isSubmittingAction || editedContent.trim().length === 0}>
                                            {isSubmittingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={message._id} className={`group flex items-start gap-3 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
                                {!isUserMessage && (
                                    <Avatar className="w-10 h-10 border"><AvatarImage src={message.sender.picture} /><AvatarFallback>{message.sender.firstName?.charAt(0)?.toUpperCase() || 'A'}</AvatarFallback></Avatar>
                                )}
                                <div className={`flex flex-col ${isUserMessage ? 'items-end' : 'items-start'}`}>
                                    <div className={`relative p-3 rounded-lg max-w-md md:max-w-xl ${isUserMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm break-words" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                                        {canEdit && (
                                            <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleStartEdit(message)}>
                                                <Pencil className="h-4 w-4"/>
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {message.sender.roles.includes(Role.Admin) || message.sender.roles.includes(Role.Owner) ? `${message.sender.firstName} (Support)` : message.sender.firstName}
                                        {' · '}
                                        <RelativeTime date={message.createdAt} />
                                        {message.editedAt && <span title={new Date(message.editedAt).toLocaleString()}> (edited)</span>}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-10 pt-6 border-t">
                    {isTicketClosed || isTicketLocked ? (
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <Lock className="mx-auto h-6 w-6 text-muted-foreground" />
                            <p className="mt-2 font-semibold">{isTicketClosed ? "This ticket is closed." : "This ticket is locked."}</p>
                            <p className="text-sm text-muted-foreground">Further replies cannot be added.</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold mb-3">Add a Reply</h2>
                            <Textarea value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="Type your reply here..." className="min-h-[120px]" disabled={isReplying} />
                            <Button onClick={handleReply} className="mt-3 w-full" disabled={isReplying || replyContent.trim().length === 0}>
                                {isReplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                Send Reply
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </BasicPageProvider>
    );
};

export default TicketConversationPage;