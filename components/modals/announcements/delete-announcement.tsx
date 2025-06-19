// components/modals/announcements/delete-announcement-modal.tsx
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
import useDeleteAnnouncementById from '@/components/hooks/announcements/delete-announcement-by-id';
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from 'sonner'; // Correct import: sonner

interface DeleteAnnouncementModalProps {
    announcementId: string;
    onDeleteSuccess?: () => void;
}

const DeleteAnnouncementModal = ({ announcementId, onDeleteSuccess }: DeleteAnnouncementModalProps) => {
    const [open, setOpen] = useState(false);
    const { deleteAnnouncement, isLoading, error } = useDeleteAnnouncementById();

    const handleDelete = async () => {
        const success = await deleteAnnouncement(announcementId);
        if (success) {
            toast.success("Announcement deleted successfully!"); // Use sonner
            setOpen(false);
            if (onDeleteSuccess) {
                onDeleteSuccess()
            }
        } else if (error) {
            toast.error(error.message.toString()); // Use sonner
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Announcement</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this announcement? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
                {error && (
                    <div className="text-red-500">Error: {error.message}</div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAnnouncementModal;