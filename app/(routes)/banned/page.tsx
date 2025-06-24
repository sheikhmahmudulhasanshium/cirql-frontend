// app/(routes)/banned/page.tsx
'use client';

import { useAuth } from "@/components/contexts/AuthContext";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function BannedPage() {
    const { state } = useAuth();
    const router = useRouter();
    const [appealMessage, setAppealMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (state.status === 'loading') return;
        
        if (state.status === 'authenticated' && state.user?.accountStatus !== 'banned') {
            router.push('/home');
        }
        if (state.status === 'unauthenticated') {
            router.push('/sign-in');
        }
    }, [state.status, state.user, router]);

    const handleSubmitAppeal = async (e: FormEvent) => {
        e.preventDefault();
        if (appealMessage.length < 20) {
            toast.error("Appeal is too short", { description: "Please provide more detail in your appeal message (min 20 characters)." });
            return;
        }
        setIsSubmitting(true);
        try {
            await apiClient.post('/support/appeal-ticket', { message: appealMessage });
            toast.success("Appeal Submitted", { description: "Your appeal has been sent to our support team for review. They will contact you via email." });
            setAppealMessage(''); // Clear the textarea after successful submission
        } catch (error) {
            const err = error as AxiosError;
            // A more specific type for the error response data
            const responseData = err.response?.data as { message?: string | string[] };
            const errorMessage = responseData?.message || "Failed to submit appeal. Please try again later.";
            toast.error("Submission Failed", { description: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (state.status === 'loading' || !state.user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin"/>
                <p className="mt-4">Verifying account status...</p>
            </div>
        );
    }
    
    if (state.user.accountStatus !== 'banned') {
        return <div className="flex items-center justify-center min-h-screen"><p>Redirecting...</p></div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 dark:bg-red-950/20 p-4">
            <div className="w-full max-w-md p-8 text-center bg-background border border-destructive rounded-lg shadow-lg">
                <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
                <h1 className="text-3xl font-bold text-destructive">Account Suspended</h1>
                
                <div className="mt-6 text-left p-4 bg-muted rounded-md border">
                    <p className="font-semibold">Reason for suspension:</p>
                    <p className="mt-2 text-muted-foreground">{state.user.banReason || 'No reason provided.'}</p>
                </div>
                
                <div className="mt-6 text-left">
                    <p className="text-sm text-muted-foreground text-center mb-4">
                        If you believe this is a mistake, you can submit an appeal below. Your appeal will be sent to our support team as a new ticket.
                    </p>
                    <form onSubmit={handleSubmitAppeal} className="space-y-4">
                        <div>
                            <Label htmlFor="appeal-message" className="sr-only">Appeal Message</Label>
                            <Textarea
                                id="appeal-message"
                                placeholder="Please explain why you believe your account suspension should be lifted..."
                                value={appealMessage}
                                onChange={(e) => setAppealMessage(e.target.value)}
                                className="min-h-[120px]"
                                disabled={isSubmitting}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting || appealMessage.length < 20}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Submit Appeal
                        </Button>
                    </form>
                </div>

                <SignOutButton className="mt-6 w-full" variant="outline">
                    Sign Out
                </SignOutButton>
            </div>
        </div>
    );
}