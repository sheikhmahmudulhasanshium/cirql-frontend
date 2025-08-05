'use client';

import React, { useState } from 'react';
import { usePendingFriendRequests } from '@/components/hooks/social/use-friend-requests';
import { acceptFriendRequest, rejectFriendRequest } from '@/components/hooks/social/friend-actions';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ConfirmationModal } from '@/components/modals/confirmation-modal';

// Integrated Skeleton Component
const RequestListSkeleton = () => (
    <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index}>
                <div className="p-4 flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                </div>
                <CardFooter className="flex justify-end gap-2">
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-20 rounded-md" />
                </CardFooter>
            </Card>
        ))}
    </div>
);

export const FriendRequestList = () => {
  const { data: requests, isLoading, isError, refetch } = usePendingFriendRequests();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const openConfirmationModal = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsModalOpen(true);
  };

  const handleConfirmDecline = () => {
    if (!selectedRequestId) return;
    rejectFriendRequest(selectedRequestId, () => {
      refetch();
      setIsModalOpen(false);
      setSelectedRequestId(null);
    });
  };

  if (isLoading) return <RequestListSkeleton />;
  if (isError) return <p className="text-center text-destructive">Failed to load friend requests.</p>;
  if (!requests || requests.length === 0) return <p className="text-center text-muted-foreground py-8">No pending friend requests.</p>;

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDecline}
        title="Decline Request?"
        description="Are you sure you want to decline this friend request? This action cannot be undone."
        confirmText="Decline"
      />
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request._id}>
            <div className="p-4 flex items-center gap-4">
              <Link href={`/profile/${request.requester.id}`}>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={request.requester.picture} alt={request.requester.firstName} />
                  <AvatarFallback>{request.requester.firstName?.[0]}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link href={`/profile/${request.requester.id}`} className="hover:underline">
                  <p className="font-semibold">{request.requester.firstName} {request.requester.lastName}</p>
                </Link>
                <p className="text-sm text-muted-foreground">Sent you a friend request</p>
              </div>
            </div>
            <CardFooter className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => openConfirmationModal(request._id)}>Decline</Button>
              <Button size="sm" onClick={() => acceptFriendRequest(request._id, refetch)}>Accept</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};