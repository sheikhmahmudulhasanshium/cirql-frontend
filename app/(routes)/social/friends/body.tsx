'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { unfriendUser } from '@/components/hooks/social/friend-actions';
import { PublicProfile } from '@/lib/types';
import { ConfirmationModal } from '@/components/modals/confirmation-modal';
import { Skeleton } from "@/components/ui/skeleton";
import { useFriendsList } from '@/components/hooks/social/use-friend-list';

// Integrated Skeleton Component
const FriendsListSkeleton = () => (
    <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-9 w-24 rounded-md" />
            </div>
        ))}
    </div>
);

export const FriendsList = () => {
  const { data: friends, isLoading, isError, refetch } = useFriendsList();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<PublicProfile | null>(null);

  const openConfirmationModal = (friend: PublicProfile) => {
    setSelectedFriend(friend);
    setIsModalOpen(true);
  };

  const handleConfirmUnfriend = () => {
    if (!selectedFriend) return;
    unfriendUser(selectedFriend.id, () => {
      refetch();
      setIsModalOpen(false);
      setSelectedFriend(null);
    });
  };

  if (isLoading) return <FriendsListSkeleton />;
  if (isError) return <p className="text-center text-destructive">Failed to load friends.</p>;
  if (!friends || friends.length === 0) return <p className="text-center text-muted-foreground py-8">You haven&apos;t added any friends yet.</p>;

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUnfriend}
        title={`Unfriend ${selectedFriend?.firstName}?`}
        description={`Are you sure you want to remove ${selectedFriend?.firstName} from your friends? This cannot be undone.`}
        confirmText="Unfriend"
      />
      <ul className="divide-y divide-border">
        {friends.map((friend) => (
          <li key={friend.id} className="flex items-center justify-between py-4">
            <Link href={`/profile/${friend.id}`} className="flex items-center gap-4 group">
              <Avatar className="h-12 w-12">
                <AvatarImage src={friend.picture} alt={friend.firstName} />
                <AvatarFallback>{friend.firstName?.[0]}</AvatarFallback>
              </Avatar>
              <p className="font-semibold group-hover:underline">{friend.firstName} {friend.lastName}</p>
            </Link>
            <Button size="sm" variant="outline" onClick={() => openConfirmationModal(friend)}>
              Unfriend
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};