'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// --- START: USE THE ORIGINAL, SIMPLE HOOK ---
import { useSentFriendRequests } from '@/components/hooks/social/use-friend-requests';
// --- END: USE THE ORIGINAL, SIMPLE HOOK ---
import { cancelFriendRequest } from '@/components/hooks/social/friend-actions';
import { ConfirmationModal } from '@/components/modals/confirmation-modal';
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FriendRequest } from '@/lib/types';

// Skeleton Component
const SentRequestListSkeleton = () => (
    <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-9 w-32 rounded-md" />
            </div>
        ))}
    </div>
);

export const SentFriendRequestList = () => {
    // --- START: USE THE ORIGINAL HOOK. IT NOW GETS THE CORRECT DATA. ---
    const { data: requests, isLoading, isError, refetch } = useSentFriendRequests();
    // --- END: USE THE ORIGINAL HOOK. ---

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<FriendRequest | null>(null);

    const openConfirmationModal = (request: FriendRequest) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = () => {
        if (!selectedRequest) return;
        cancelFriendRequest(selectedRequest._id, () => {
            refetch();
            setIsModalOpen(false);
            setSelectedRequest(null);
        });
    };

    if (isLoading) return <SentRequestListSkeleton />;
    if (isError) return <p className="text-center text-destructive">Failed to load sent requests.</p>;
    if (!requests || requests.length === 0) {
        return <p className="text-center text-muted-foreground py-8">You have no pending sent requests.</p>;
    }

    // This JSX will now work without TypeScript errors because `request.recipient` is an object.
    return (
        <>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Cancel Friend Request?"
                description={`Are you sure you want to cancel your friend request to ${selectedRequest?.recipient.firstName}?`}
                confirmText="Yes, Cancel"
            />
            <ul className="divide-y divide-border">
                {requests.map((request) => (
                    <li key={request._id} className="flex items-center justify-between py-4">
                        <Link href={`/profile/${request.recipient.id}`} className="flex items-center gap-4 group">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={request.recipient.picture} alt={request.recipient.firstName} />
                                <AvatarFallback>{request.recipient.firstName?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold group-hover:underline">
                                    {request.recipient.firstName} {request.recipient.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">Request Sent</p>
                            </div>
                        </Link>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openConfirmationModal(request)}
                        >
                            Cancel Request
                        </Button>
                    </li>
                ))}
            </ul>
        </>
    );
};