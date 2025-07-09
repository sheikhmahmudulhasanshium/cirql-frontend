// app/contacts/contact-form.tsx
'use client';

import { useState } from 'react';
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import apiClient from '@/lib/apiClient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TicketCategory } from '@/lib/types'; // Ensure this enum is correct in your types file

export function ContactForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState<TicketCategory | ''>('');

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!fullName || fullName.length < 2) newErrors.fullName = 'Full name is required.';
        if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'A valid email is required.';
        if (!category) newErrors.category = 'Please select a reason for contact.';
        if (!message || message.length < 10) newErrors.message = 'Message must be at least 10 characters.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Validation Failed", { description: "Please correct the errors in the form." });
            return;
        }

        setIsLoading(true);

        try {
            await apiClient.post('/support/public-ticket', {
                name: fullName,
                email,
                category,
                message,
            });
            
            toast.success("Message Sent!", {
                description: "Your ticket has been created. We'll be in touch soon!",
                icon: <CheckCircle className="h-4 w-4" />,
            });

            setFullName('');
            setEmail('');
            setMessage('');
            setCategory('');
            setErrors({});

        } catch (err) {
            console.error("Contact form submission error:", err);
            toast.error("Failed to Send Message", { description: "An unexpected error occurred. Please try again later." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                <Label htmlFor="category">Reason for Contact</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as TicketCategory)} disabled={isLoading}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a reason..." />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(TicketCategory).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
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

            <Button type="submit" size="lg" className="w-full !mt-10" disabled={isLoading}>
                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>)
                 : 'Send Message'
                }
            </Button>
        </form>
    );
}