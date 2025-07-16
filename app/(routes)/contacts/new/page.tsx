'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TicketCategory } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import BasicPageProvider from '@/components/providers/basic-page-provider';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { AxiosError } from 'axios';
import { FileUpload, UploadedFileResponse } from '../../components/uploads/file-upload';

const formSchema = z.object({
  category: z.nativeEnum(TicketCategory, {
    required_error: "Please select a category.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }).max(100),
  initialMessage: z.string().optional(),
});

export default function NewTicketPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<UploadedFileResponse[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      initialMessage: "",
    },
  });

  const handleUploadComplete = (res: UploadedFileResponse[]) => {
    setAttachments(prev => [...prev, ...res]);
    form.trigger();
  };
  
  const canSubmit = attachments.length > 0 || (form.getValues('initialMessage') || '').trim().length > 0;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const attachmentUrls = attachments.map(a => a.url);

      // --- START OF FIX ---
      // We don't need the 'response' variable, so we just await the call.
      const response = await apiClient.post('/support/tickets', {
        ...values,
        attachments: attachmentUrls,
      });
      // --- END OF FIX ---
      
      toast.success('Ticket created successfully!');
      router.push(`/contacts/${response.data._id}`); // Use the response data to redirect
    } catch (err) {
      let errorMessage = 'Failed to create ticket.';
      if (err instanceof AxiosError && err.response?.data?.message) {
        errorMessage = Array.isArray(err.response.data.message) ? err.response.data.message.join(', ') : err.response.data.message;
      }
      toast.error('Submission Error', { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create a New Ticket</h1>
          <p className="text-muted-foreground mt-2">
            Please provide as much detail as possible so we can assist you effectively.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Contact</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TicketCategory).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Issue with profile settings" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="initialMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe your issue</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please include all relevant details, links, or steps to reproduce the issue."
                      className="resize-y min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Attach Files (optional)</FormLabel>
              <div className="mt-2">
                  <FileUpload
                      endpoint="mediaUploader"
                      onUploadComplete={handleUploadComplete}
                  />
              </div>
              {attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                      <p className="text-xs text-muted-foreground">Attached:</p>
                      <ul className="list-disc list-inside">
                          {attachments.map((file, i) => (
                              <li key={i} className="text-xs">
                                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                      {file.name}
                                  </a>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting || !canSubmit} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Ticket
            </Button>
            {!canSubmit && <p className="text-xs text-center text-muted-foreground pt-2">Please enter a message or upload a file to submit.</p>}
          </form>
        </Form>
      </div>
    </BasicPageProvider>
  );
}