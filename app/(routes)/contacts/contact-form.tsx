// app/contacts/contact-form.tsx

'use client';

import { useState } from 'react';
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import apiClient from '@/lib/apiClient';

export function ContactForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!fullName || fullName.length < 2) newErrors.fullName = 'Full name is required.';
        if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'A valid email is required.';
        if (!message || message.length < 10) newErrors.message = 'Message must be at least 10 characters.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Validation Failed", {
                description: "Please correct the errors in the form.",
                icon: <AlertCircle className="h-4 w-4" />,
            });
            return;
        }

        setIsLoading(true);

        try {
            await apiClient.post('/contact', {
                name: fullName,
                email,
                message,
            });
            
            toast.success("Message Sent!", {
                description: "Your message is on its way. Thank you!",
                icon: <CheckCircle className="h-4 w-4" />,
            });

            setFullName('');
            setEmail('');
            setMessage('');
            setErrors({});

        } catch (err) {
            console.error("Contact form submission error:", err);
            toast.error("Failed to Send Message", {
                description: "An unexpected error occurred. Please try again later.",
                icon: <AlertCircle className="h-4 w-4" />,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} />
                        {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                        id="message" 
                        placeholder="Please describe your reason for contact here..." 
                        rows={5} 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        disabled={isLoading}
                    />
                    {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
                </div>
                <p className="text-xs text-muted-foreground !mt-2">File attachments are not supported in this form.</p>
                <Button type="submit" size="lg" className="w-full !mt-10" disabled={isLoading}>
                    {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>)
                     : 'Send Message'
                    }
                </Button>
            </form>
        </>
    );
}