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
// --- MODIFIED: Import the full Announcement type ---
import { UpdateAnnouncementDto, AnnouncementType, Announcement } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit2 } from "lucide-react";
// --- REMOVED: The problematic hook is no longer needed ---
// import useAnnouncementById from '@/components/hooks/announcements/get-announcement-by-id';
import { toast } from 'sonner';

interface UpdateAnnouncementModalProps {
    // --- MODIFIED: Expect the full announcement object, not just the ID ---
    announcement: Announcement;
    onUpdateSuccess?: () => void;
}

const UpdateAnnouncementModal = ({ announcement, onUpdateSuccess }: UpdateAnnouncementModalProps) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<AnnouncementType>(AnnouncementType.GENERAL);
    const [visible, setVisible] = useState(true);
    const [expirationDate, setExpirationDate] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    const { updateAnnouncement, isLoading, error } = useUpdateAnnouncementById();
    // --- REMOVED: The problematic hook call is gone ---
    // const { announcement: fetchedAnnouncement, isLoading: isAnnouncementLoading, error: announcementError } = useAnnouncementById(announcementId);

    // This effect now uses the 'announcement' prop directly. It's much faster.
    useEffect(() => {
        if (announcement) {
            setTitle(announcement.title);
            setContent(announcement.content);
            setType(announcement.type);
            setVisible(announcement.visible);
            // Handle date formatting for the datetime-local input
            setExpirationDate(announcement.expirationDate ? new Date(announcement.expirationDate).toISOString().slice(0, 16) : null);
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
            // Ensure null is sent if the date is cleared
            expirationDate: expirationDate || null,
            imageUrl,
            linkUrl,
        };

        const updatedAnnouncement = await updateAnnouncement(announcement._id, data);
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

    // No need for loading/error states for fetching data anymore
    if (!announcement) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                 <Button variant="outline" size="sm">
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
                    {/* ... The form fields remain the same ... */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="content" className="text-right">Content</Label>
                        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select value={type} onValueChange={(value) => setType(value as AnnouncementType)}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {Object.values(AnnouncementType).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="visible" className="text-right">Visible</Label>
                        <Input type="checkbox" id="visible" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="h-4 w-4" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="expirationDate" className="text-right">Expiration</Label>
                        <Input type="datetime-local" id="expirationDate" value={expirationDate || ''} onChange={(e) => setExpirationDate(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                        <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="linkUrl" className="text-right">Link URL</Label>
                        <Input id="linkUrl" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="col-span-3" />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Announcement"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateAnnouncementModal;