// components/modals/announcements/create-announcement-modal.tsx
"use client";

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import useCreateAnnouncement from '@/components/hooks/announcements/create-announcement';
import { CreateAnnouncementDto, AnnouncementType } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircleIcon } from "lucide-react";
import { toast } from 'sonner'; // Correct import: sonner

const CreateAnnouncementModal = ({ onCreateSuccess }: { onCreateSuccess?: () => void }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<AnnouncementType>(AnnouncementType.GENERAL);
    const [visible, setVisible] = useState(true);
    const [expirationDate, setExpirationDate] = useState<string | null>(null); // ISO string
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    const { createAnnouncement, isLoading, error } = useCreateAnnouncement();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: CreateAnnouncementDto = {
            title,
            content,
            type,
            visible,
            expirationDate,
            imageUrl,
            linkUrl,
        };

        const newAnnouncement = await createAnnouncement(data);
        if (newAnnouncement) {
            toast.success("Announcement created successfully!"); // Use sonner
            setOpen(false); // Close the modal
            // Reset form fields
            setTitle('');
            setContent('');
            setType(AnnouncementType.GENERAL);
            setVisible(true);
            setExpirationDate(null);
            setImageUrl('');
            setLinkUrl('');
            if (onCreateSuccess) {
                onCreateSuccess()
            }
        } else if (error) {
            toast.error(error.message.toString()); // Use sonner
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Create Announcement <PlusCircleIcon className="ml-2 h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Announcement</DialogTitle>
                    <DialogDescription>
                        Create a new announcement for the platform.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="content" className="text-right">
                            Content
                        </Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Type
                        </Label>
                        <Select value={type} onValueChange={(value) => setType(value as AnnouncementType)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={AnnouncementType.GENERAL}>General</SelectItem>
                                <SelectItem value={AnnouncementType.COMPANY_NEWS}>Company News</SelectItem>
                                <SelectItem value={AnnouncementType.LATEST_UPDATES}>Latest Updates</SelectItem>
                                <SelectItem value={AnnouncementType.UPCOMING}>Upcoming</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="visible" className="text-right">
                            Visible
                        </Label>
                        <Input
                            type="checkbox"
                            id="visible"
                            checked={visible}
                            onChange={(e) => setVisible(e.target.checked)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="expirationDate" className="text-right">
                            Expiration Date
                        </Label>
                        <Input
                            type="datetime-local"
                            id="expirationDate"
                            value={expirationDate || ''}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="imageUrl" className="text-right">
                            Image URL
                        </Label>
                        <Input
                            type="text"
                            id="imageUrl"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="linkUrl" className="text-right">
                            Link URL
                        </Label>
                        <Input
                            type="text"
                            id="linkUrl"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Announcement"}
                    </Button>
                    {error && (
                        <div className="text-red-500">Error: {error.message}</div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAnnouncementModal;