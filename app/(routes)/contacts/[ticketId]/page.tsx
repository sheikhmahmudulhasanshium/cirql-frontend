'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/components/contexts/AuthContext';
import { TicketDetails, TicketStatus, Media } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, Paperclip, X, ArrowLeft, Lock } from 'lucide-react';
import BasicPageProvider from '@/components/providers/basic-page-provider';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { UniversalUploader, UploadedFileResponse } from '../../components/uploads/universal-uploader';
import Header from '../../components/header';
import Footer from '../../components/footer';

const AttachmentLink = ({ attachment }: { attachment: Media }) => (
  <Link
    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/media/download/${attachment._id}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground hover:underline"
  >
    <Paperclip className="h-3 w-3" />
    <span>{attachment.filename || 'Attachment'}</span>
  </Link>
);

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

  const [stagedFiles, setStagedFiles] = useState<UploadedFileResponse[]>([]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  const handleReply = async () => {
    const attachmentIds = stagedFiles.map(f => f.mediaId);
    if ((replyContent.trim().length === 0 && attachmentIds.length === 0) || isReplying) return;

    setIsReplying(true);
    try {
      await apiClient.post(`/support/tickets/${ticketId}/messages`, {
        content: replyContent,
        attachments: attachmentIds
      });

      setReplyContent('');
      setStagedFiles([]);
      toast.success('Reply sent!');
      await fetchTicket();
    } catch {
      toast.error('Failed to send reply.');
    } finally {
      setIsReplying(false);
    }
  };

  const handleFileUploadComplete = (res: UploadedFileResponse[]) => {
    setStagedFiles(prev => [...prev, ...res]);
    toast.success(`${res.length} file(s) attached and ready to send.`);
  };

  const handleRemoveAttachment = (mediaIdToRemove: string) => {
    setStagedFiles(prev => prev.filter(att => att.mediaId !== mediaIdToRemove));
  };

  if (isLoading || !user) {
    return (
      <BasicPageProvider header={<Header />} footer={<Footer />}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </BasicPageProvider>
    );
  }

  if (!ticket) return null;

  const canInteract = !ticket.isLocked && ticket.status !== TicketStatus.CLOSED;
  const canReply = !isReplying && (replyContent.trim().length > 0 || stagedFiles.length > 0);

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <Link href="/contacts" passHref>
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tickets
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{ticket.subject}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>Status: {ticket.status}</span>
              {ticket.isLocked && <Lock className="h-3 w-3" />}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {ticket.messages.map(message => (
            <div key={message._id} className={`group flex items-start gap-3 ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}>
              {message.sender._id !== user?._id && (
                <Avatar>
                  <AvatarImage src={message.sender.picture} />
                  <AvatarFallback>{message.sender.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div className={`flex flex-col ${message.sender._id === user?._id ? 'items-end' : 'items-start'}`}>
                <div className={`relative p-3 rounded-lg max-w-md md:max-w-xl ${message.sender._id === user?._id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {message.content && <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className={`mt-2 pt-2 space-y-1 ${message.content ? 'border-t border-muted-foreground/30' : ''}`}>
                      {message.attachments.map((att) => (
                        <AttachmentLink key={att._id} attachment={att} />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {message.sender._id === user?._id ? 'You' : message.sender.firstName} • {format(new Date(message.createdAt), 'PPp')}
                  {message.editedAt && ` (edited)`}
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

              <div className="space-y-2">
                <Label>Attach Files</Label>
                <UniversalUploader
                  onUploadComplete={handleFileUploadComplete}
                  input={{ ticketId }} // optional context input
                />
              </div>

              {stagedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {stagedFiles.map((att) => (
                      <div key={att.mediaId} className="flex items-center gap-2 bg-muted rounded-full pl-3 pr-1 py-1 text-sm">
                        <Paperclip className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate max-w-xs">{att.name}</span>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => handleRemoveAttachment(att.mediaId)}>
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
            <div className="text-center text-muted-foreground bg-muted p-4 rounded-lg">
              <p className="font-semibold">
                {ticket.isLocked ? "This ticket is locked." : "This ticket is closed."}
              </p>
              <p className="text-sm">
                Replies cannot be sent. Please create a new ticket for further assistance.
              </p>
            </div>
          )}
        </div>
      </div>
    </BasicPageProvider>
  );
};

export default TicketConversationPage;
