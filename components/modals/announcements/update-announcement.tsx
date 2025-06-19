// components/modals/announcements/update-announcement-modal.tsx
"use client";

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import useUpdateAnnouncementById from '@/components/hooks/announcements/update-announcement-by-id';
import { UpdateAnnouncementDto, AnnouncementType } from '@/lib/types'; // Removed Announcement
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit2 } from "lucide-react";
import useAnnouncementById from '@/components/hooks/announcements/get-announcement-by-id';
import { toast } from 'sonner';

interface UpdateAnnouncementModalProps {
    announcementId: string;
    onUpdateSuccess?: () => void;
}

const UpdateAnnouncementModal = ({ announcementId, onUpdateSuccess }: UpdateAnnouncementModalProps) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<AnnouncementType>(AnnouncementType.GENERAL);
    const [visible, setVisible] = useState(true);
    const [expirationDate, setExpirationDate] = useState<string | null>(null); // ISO string
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    const { updateAnnouncement, isLoading, error } = useUpdateAnnouncementById();
    const { announcement, isLoading: isAnnouncementLoading, error: announcementError } = useAnnouncementById(announcementId);

    useEffect(() => {
        if (announcement) {
            setTitle(announcement.title);
            setContent(announcement.content);
            setType(announcement.type);
            setVisible(announcement.visible);
            setExpirationDate(announcement.expirationDate || null);
            setImageUrl(announcement.imageUrl || '');
            setLinkUrl(announcement.linkUrl || '');
        }
    }, [announcement]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: UpdateAnnouncementDto = {
            title,
            content,
            type,
            visible,
            expirationDate,
            imageUrl,
            linkUrl,
        };

        const updatedAnnouncement = await updateAnnouncement(announcementId, data);
        if (updatedAnnouncement) {
            toast.success("Announcement updated successfully!");
            setOpen(false);
            if (onUpdateSuccess) {
                onUpdateSuccess()
            }

        } else if (error) {
            toast.error(error.message.toString());
        }
    };

    if (isAnnouncementLoading) {
        return <div>Loading announcement...</div>; // Basic loading state
    }

    if (announcementError) {
        return <div>Error loading announcement: {announcementError.message}</div>;
    }
    if (!announcement) {
        return null
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Edit2 className="mr-2 h-4 w-4" /> Update
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Announcement</DialogTitle>
                    <DialogDescription>
                        Update the details of the announcement.
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
                                <SelectValue>{type}</SelectValue>
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
                        {isLoading ? "Updating..." : "Update Announcement"}
                    </Button>
                    {error && (
                        <div className="text-red-500">Error: {error.message}</div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateAnnouncementModal;