'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/components/contexts/AuthContext';
import { TicketDetails, TicketStatus, Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, Lock, Paperclip, Upload, Link as LinkIcon, X } from 'lucide-react';
import BasicPageProvider from '@/components/providers/basic-page-provider';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { RelativeTime } from '@/lib/RelativeTime';
import { FileUpload, UploadedFileResponse } from '../../components/uploads/file-upload';
import { UrlUploader } from '../../components/uploads/url-upload';
import { Label } from '@/components/ui/label';

interface StagedAttachment {
  id: string; 
  name: string;
  url: string;
}

const TicketConversationPage = () => {
    const { state: { user } } = useAuth();
    const params = useParams();
    const router = useRouter();
    const ticketId = params.ticketId as string;
    
    const [ticket, setTicket] = useState<TicketDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const [attachments, setAttachments] = useState<StagedAttachment[]>([]);
    const [uploadMethod, setUploadMethod] = useState<'device' | 'url'>('device');

    const fetchTicket = useCallback(async () => {
        if (!ticketId) return;
        try {
            const response = await apiClient.get(`/support/tickets/${ticketId}`);
            setTicket(response.data);
            apiClient.post(`/support/tickets/${ticketId}/seen`).catch(() => {});
        } catch {
            toast.error('Failed to load ticket', { description: 'You may not have permission to view this, or it may not exist.' });
            router.push('/contacts');
        } finally {
            setIsLoading(false);
        }
    }, [ticketId, router]);

    useEffect(() => {
        if (user) fetchTicket();
    }, [fetchTicket, user]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [ticket?.messages]);

    const unseenMessageCount = useMemo(() => {
        if (!ticket || !user) return 0;
        const lastSeenTimestamp = ticket.lastSeenByUserAt; // This should be lastSeenByUserAt for a user-centric view
        if (!lastSeenTimestamp) return ticket.messages.filter(msg => msg.sender._id !== user._id).length;
        const lastSeenDate = new Date(lastSeenTimestamp);
        return ticket.messages.filter(msg => new Date(msg.createdAt) > lastSeenDate && msg.sender._id !== user._id).length;
    }, [ticket, user]);
    
    const handleReply = async () => {
        if ((replyContent.trim().length === 0 && attachments.length === 0) || isReplying) return;
        
        setIsReplying(true);
        try {
            const attachmentUrls = attachments.map(a => a.url);
            await apiClient.post(`/support/tickets/${ticketId}/messages`, { 
                content: replyContent,
                attachments: attachmentUrls
            });
            
            setReplyContent('');
            setAttachments([]);
            toast.success('Reply sent!');
            await fetchTicket(); 
        } catch {
            toast.error('Failed to send reply.');
        } finally {
            setIsReplying(false);
        }
    };
    
    // A single handler for all file uploads (from device)
    const handleFileUploadComplete = (res: UploadedFileResponse[]) => {
        const newAttachments = res.map(file => ({
            id: self.crypto.randomUUID(),
            name: file.name,
            url: file.url,
        }));
        setAttachments(prev => [...prev, ...newAttachments]);
        toast.success(`${res.length} file(s) attached.`);
    };
    
    // A handler for URL uploads, which wraps the main handler
    const handleUrlUploadComplete = (res: UploadedFileResponse) => {
        handleFileUploadComplete([res]);
    };

    const handleRemoveAttachment = (idToRemove: string) => {
        setAttachments(prev => prev.filter(att => att.id !== idToRemove));
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
    const canReply = !isReplying && (replyContent.trim().length > 0 || attachments.length > 0);

    return (
        <BasicPageProvider header={<Header />} footer={<Footer />}>
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-2">
                    <h1 className="text-2xl font-bold tracking-tight">{ticket.subject}</h1>
                </div>

                <div className="flex items-center gap-2 mb-8">
                    <p className="text-muted-foreground">Status: {ticket.status}</p>
                    {unseenMessageCount > 0 && !isTicketClosed && <Badge variant="default">{unseenMessageCount} New</Badge>}
                    {isTicketLocked && <Badge variant="destructive"><Lock className="mr-1.5 h-3 w-3"/>Locked</Badge>}
                </div>
                
                <div className="space-y-6">
                    {ticket.messages.map(message => (
                        <div key={message._id} className={`group flex items-start gap-3 ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                            {message.sender._id !== user?._id && (
                                <Avatar className="w-10 h-10 border">
                                    <AvatarImage src={message.sender.picture} />
                                    <AvatarFallback>{message.sender.firstName?.charAt(0)?.toUpperCase() || 'A'}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`flex flex-col ${message.sender._id === user?._id ? 'items-end' : 'items-start'}`}>
                                <div className={`relative p-3 rounded-lg max-w-md md:max-w-xl ${message.sender._id === user?._id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    {message.content && <p className="text-sm break-words" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>}
                                    {message.attachments && message.attachments.length > 0 && (
                                        <div className={`mt-2 pt-2 space-y-1 ${message.content ? 'border-t border-muted-foreground/30' : ''}`}>
                                            {message.attachments.map((url, index) => (
                                                <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:underline">
                                                    <Paperclip className="h-3 w-3" />
                                                    <span>{url.split('/').pop()?.split('-').slice(1).join('-') || 'Attachment'}</span>
                                                </a>
                                            ))}
                                        </div>
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
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-10 pt-6 border-t">
                    {canInteract ? (
                        <div className="space-y-4">
                            <Textarea 
                                value={replyContent} 
                                onChange={e => setReplyContent(e.target.value)} 
                                placeholder="Type your reply here..." 
                                className="min-h-[120px]"
                                disabled={isReplying} 
                            />
                            
                            <div className="space-y-3">
                                <Label>Attach Files</Label>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        type="button" 
                                        variant={uploadMethod === 'device' ? 'default' : 'outline'} 
                                        onClick={() => setUploadMethod('device')}
                                        className="flex-1 sm:flex-auto"
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        From Device
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant={uploadMethod === 'url' ? 'default' : 'outline'} 
                                        onClick={() => setUploadMethod('url')}
                                        className="flex-1 sm:flex-auto"
                                    >
                                        <LinkIcon className="mr-2 h-4 w-4" />
                                        From URL
                                    </Button>
                                </div>

                                <div className="p-4 border rounded-md bg-muted/50">
                                    {uploadMethod === 'device' ? (
                                        <FileUpload endpoint="mediaUploader" onUploadComplete={handleFileUploadComplete} />
                                    ) : (
                                        <UrlUploader onUploadComplete={handleUrlUploadComplete} />
                                    )}
                                </div>
                            </div>
                            
                            {attachments.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        {attachments.map((att) => (
                                            <div key={att.id} className="flex items-center gap-2 bg-muted rounded-full pl-3 pr-1 py-1 text-sm">
                                                <Paperclip className="h-3 w-3 flex-shrink-0" />
                                                <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-xs">
                                                    {att.name}
                                                </a>
                                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => handleRemoveAttachment(att.id)}>
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button onClick={handleReply} className="w-full" disabled={!canReply}>
                                {isReplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                Send Reply
                            </Button>
                        </div>
                    ) : (
                       <div className="text-center p-4 bg-muted rounded-lg">
                            <Lock className="mx-auto h-6 w-6 text-muted-foreground" />
                            <p className="mt-2 font-semibold">{isTicketClosed ? "This ticket is closed." : "This ticket is locked."}</p>
                            <p className="text-sm text-muted-foreground">Further replies cannot be added.</p>
                        </div>
                    )}
                </div>
            </div>
        </BasicPageProvider>
    );
};

export default TicketConversationPage;