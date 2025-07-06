'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/contexts/AuthContext';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bug, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { TicketCategory } from '@/lib/types';
import { AxiosError } from 'axios';

export const BugReportModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [expected, setExpected] = useState('');
  const [logs, setLogs] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { state } = useAuth();
  const pathname = usePathname();

  const handleSubmit = async () => {
    if (!description || !expected) {
      toast.error("Please fill out the description and expected behavior fields.");
      return;
    }

    setIsSubmitting(true);

    const fullPageUrl = typeof window !== 'undefined' ? window.location.href : pathname;
    const userInfo = `User ID: ${state.user?._id}\nUser Email: ${state.user?.email}`;

    const formattedMessage = `
**ISSUE DESCRIPTION:**
${description}

---

**EXPECTED BEHAVIOR:**
${expected}

---

**TECHNICAL DETAILS:**
- **Page URL:** ${fullPageUrl}
- **User Info:** ${userInfo}
- **Timestamp (UTC):** ${new Date().toISOString()}

---

**CONSOLE LOGS:**
\`\`\`
${logs || 'No logs provided.'}
\`\`\`
    `;

    try {
      await apiClient.post('/support/tickets', {
        category: TicketCategory.TECHNICAL_SUPPORT,
        subject: `Bug Report: ${description.substring(0, 50)}...`,
        initialMessage: formattedMessage.trim(),
      });

      toast.success("Bug report submitted!", {
        description: "Thank you, your feedback has been sent to the development team."
      });
      
      setDescription('');
      setExpected('');
      setLogs('');
      setIsOpen(false);

    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string | string[] }>;
      const serverMessage = axiosError.response?.data?.message;
      const errorMessage = Array.isArray(serverMessage) ? serverMessage.join(', ') : serverMessage;
      toast.error("Submission Failed", {
        description: errorMessage || "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bug className="mr-2 h-4 w-4" /> Report an Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Submit a Bug Report</DialogTitle>
          <DialogDescription>
            Your detailed feedback helps us improve CiRQL. The page you&apos;re on and your user info will be automatically included.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="description" className="font-semibold">
              1. Please describe the bug
            </Label>
            <Textarea
              id="description"
              placeholder="What were you doing when the issue occurred? What happened?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="expected" className="font-semibold">
              2. What was the expected behavior?
            </Label>
            <Textarea
              id="expected"
              placeholder="What should have happened instead?"
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>
           <div>
            <Label htmlFor="logs" className="font-semibold">
              3. Error Logs (Optional, but very helpful!)
            </Label>
            <Textarea
              id="logs"
              placeholder="If you see any errors in the browser console (press F12), please paste them here."
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              className="mt-1 font-mono text-xs"
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !description || !expected}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bug className="mr-2 h-4 w-4" />}
            Submit Bug Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};