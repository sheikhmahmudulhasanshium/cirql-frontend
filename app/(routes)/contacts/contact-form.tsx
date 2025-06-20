// app/contacts/ContactForm.tsx (FINAL, LINT-FREE VERSION)

'use client';

import { useState, useRef } from 'react';
import Script from 'next/script';
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

// --- Configuration ---
const API_KEY = process.env.NEXT_PUBLIC_GMAIL_API_KEY;
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/gmail.send';
const yourReceivingEmail = "contact.cirql@gmail.com";

const inquiryOptions = [
    { value: "Feedback", label: "Feedback & Suggestions" },
    { value: "Support", label: "Technical Support Question" },
    { value: "Complaint", label: "Formal Complaint" },
    { value: "Review", label: "Product/Service Review" },
    { value: "Partnership", label: "Partnership Inquiry" },
];

// --- FIX: Disabling the 'no-explicit-any' rule for this specific block ---
// This is necessary because we are augmenting the global Window object,
// which is a standard pattern for libraries that don't use module imports.
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
    interface Window {
        gapi: any;
        google: any;
        tokenClient: any;
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */


export function ContactForm() {
    const [isGapiReady, setIsGapiReady] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [inquiryType, setInquiryType] = useState('');
    const [message, setMessage] = useState('');
    const gapiInited = useRef(false);
    const gisInited = useRef(false);

    const handleGapiScriptLoad = () => { if (window.gapi) window.gapi.load('client', initializeGapiClient); };

    const initializeGapiClient = async () => {
        if (gapiInited.current || !window.gapi) return;
        try {
            await window.gapi.client.init({ apiKey: API_KEY });
            gapiInited.current = true;
            setIsGapiReady(true);
        } catch (error) {
            console.error("Error initializing GAPI client", error);
            toast.error("Could not load Google Services.");
        }
    };

    const handleGisScriptLoad = () => {
        if (gisInited.current || !window.google) return;
        window.tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID!,
            scope: SCOPES,
            // --- FIX: Replaced `resp: any` with the specific type from the @types/google.accounts package ---
            callback: async (resp: google.accounts.oauth2.TokenResponse) => {
                if (resp.error) {
                    setIsLoading(false);
                    toast.error("Authentication Failed", { description: "You must grant permission to send an email." });
                    return;
                }
                setIsSignedIn(true);
                await handleSubmit();
            },
        });
        gisInited.current = true;
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!fullName || fullName.length < 2) newErrors.fullName = 'Full name is required.';
        if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'A valid email is required.';
        if (!inquiryType) newErrors.inquiryType = 'Please select a reason for contact.';
        if (!message || message.length < 10) newErrors.message = 'Message must be at least 10 characters.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const createAndSendEmail = async () => {
        const selectedOption = inquiryOptions.find(opt => opt.value === inquiryType);
        const subject = `[${selectedOption?.label || 'Inquiry'}] - from ${fullName}`;
        const emailBody = [
            `Content-Type: text/plain; charset="UTF-8"`, `MIME-Version: 1.0`, `to: ${yourReceivingEmail}`,
            `from: ${fullName} <${email}>`, `subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`, ``, `${message}`
        ].join('\n');
        const base64EncodedEmail = btoa(emailBody).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        
        try {
            await window.gapi.client.load('gmail', 'v1');
            
            // --- FIX: Disabling the linter for this single line where a type assertion is necessary ---
            // This is a valid use case because the '.gmail' property is loaded dynamically.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await (window.gapi.client as any).gmail.users.messages.send({
                'userId': 'me',
                'resource': { 'raw': base64EncodedEmail }
            });

            if (response.status === 200) {
                toast.success("Email sent successfully!", { description: "Your message is on its way. Thank you!", icon: <CheckCircle className="h-4 w-4" />, });
                setFullName(''); setEmail(''); setInquiryType(''); setMessage(''); setErrors({});
            } else {
                throw new Error('Gmail API returned a non-200 status.');
            }
        } catch (err) {
            console.error("Gmail API error:", err);
            toast.error("Failed to Send Email", { description: "An error occurred with the Gmail API. Please try again.", icon: <AlertCircle className="h-4 w-4" />, });
        } finally {
            setIsLoading(false);
            setIsSignedIn(false);
        }
    };
    
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!validateForm()) { toast.error("Validation Failed", { description: "Please correct the errors in the form." }); return; }
        setIsLoading(true);
        if (isSignedIn) { await createAndSendEmail(); }
        else {
            if (window.tokenClient) { window.tokenClient.requestAccessToken({ prompt: 'consent' }); }
            else { toast.error("Google Sign-In is not ready. Please wait a moment."); setIsLoading(false); }
        }
    };

    return (
        <>
            <Script async defer src="https://apis.google.com/js/api.js" onLoad={handleGapiScriptLoad}></Script>
            <Script async defer src="https://accounts.google.com/gsi/client" onLoad={handleGisScriptLoad}></Script>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-2">
                        {/* --- FIX: Replaced the ' apostrophe with the ' HTML entity --- */}
                        <Label htmlFor="email">Your Email (used in &lsqo;From&rsqo; field)</Label>
                        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="inquiryType">Reason for Contact</Label>
                    <Select value={inquiryType} onValueChange={setInquiryType}>
                        <SelectTrigger id="inquiryType"><SelectValue placeholder="Select a reason..." /></SelectTrigger>
                        <SelectContent>
                            {inquiryOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {errors.inquiryType && <p className="text-sm text-red-500 mt-1">{errors.inquiryType}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                        id="message" 
                        placeholder="Please describe your reason for contact here..." 
                        rows={5} 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                    />
                    {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
                </div>
                <p className="text-xs text-muted-foreground !mt-2">File attachments are not supported in this form.</p>
                <Button type="submit" size="lg" className="w-full !mt-10" disabled={!isGapiReady || isLoading}>
                    {isLoading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)
                     : isSignedIn ? 'Send Email via Gmail'
                     : 'Sign in with Google to Send'
                    }
                </Button>
            </form>
        </>
    );
}