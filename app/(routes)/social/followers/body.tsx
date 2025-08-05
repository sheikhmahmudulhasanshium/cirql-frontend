'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from "@/components/ui/skeleton";
import { useFollowersList } from '@/components/hooks/social/use-follower-list';

// Integrated Skeleton Component
const FollowersListSkeleton = () => (
    <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                </div>
            </div>
        ))}
    </div>
);

export const FollowersList = () => {
  const { data: followers, isLoading, isError } = useFollowersList();

  if (isLoading) return <FollowersListSkeleton />;
  if (isError) return <p className="text-center text-destructive">Failed to load followers.</p>;
  if (!followers || followers.length === 0) return <p className="text-center text-muted-foreground py-8">You don&apos;t have any followers yet.</p>;

  return (
    <ul className="divide-y divide-border">
      {followers.map((follower) => (
        <li key={follower.id} className="flex items-center py-4">
          <Link href={`/profile/${follower.id}`} className="flex items-center gap-4 group">
            <Avatar className="h-12 w-12">
              <AvatarImage src={follower.picture} alt={follower.firstName} />
              <AvatarFallback>{follower.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <p className="font-semibold group-hover:underline">{follower.firstName} {follower.lastName}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};