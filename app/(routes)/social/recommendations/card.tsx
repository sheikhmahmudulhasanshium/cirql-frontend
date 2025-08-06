'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, UserCheck, Sparkles, Rss, X } from 'lucide-react';
import { PublicProfile } from '@/lib/types';
import { toast } from 'sonner';

interface UserRecommendationCardProps {
  profile: PublicProfile & { headline?: string; commonInterests?: string[] };
  onDismiss: (userId: string) => void;
  onAddFriend: (userId: string) => Promise<void>;
  onFollow: (userId: string) => Promise<void>;
}

export const UserRecommendationCard = ({
  profile,
  onDismiss,
  onAddFriend,
  onFollow,
}: UserRecommendationCardProps) => {
  const [friendState, setFriendState] = useState<'idle' | 'loading' | 'sent'>('idle');
  const [followState, setFollowState] = useState<'idle' | 'loading' | 'following'>('idle');

  const handleAddClick = async () => {
    setFriendState('loading');
    try {
      await onAddFriend(profile.id);
      setFriendState('sent');
    } catch {
      toast.error('Failed to send friend request', {
        description: 'Please try again later.',
      });
      setFriendState('idle');
    }
  };

  const handleFollowClick = async () => {
    setFollowState('loading');
    try {
      await onFollow(profile.id);
      setFollowState('following');
    } catch {
      toast.error('Something Went Wrong', {
        description: 'Please try again later.',
      }); 
      setFollowState('idle');
    }
  };

  return (
    <Card className="flex flex-col p-5 text-center h-full transition-all duration-300 bg-background shadow-md border border-border hover:shadow-lg rounded-xl overflow-hidden">
      <Link
        href={`/profile/${profile.id}`}
        aria-label={`View profile of ${profile.firstName} ${profile.lastName}`}
        className="flex-shrink-0"
      >
        <Avatar className="h-20 w-20 mb-4 mx-auto ring-2 ring-offset-2 ring-muted hover:ring-primary transition duration-300">
          <AvatarImage src={profile.picture} alt={`${profile.firstName} ${profile.lastName}`} />
          <AvatarFallback>{profile.firstName?.[0]}{profile.lastName?.[0]}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 w-full min-h-0 flex flex-col justify-center items-center">
        <Link href={`/profile/${profile.id}`} className="w-full">
          <h3 className="font-semibold hover:underline cursor-pointer truncate w-full">
            {profile.firstName} {profile.lastName}
          </h3>
        </Link>
        {profile.headline && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 text-center">
            {profile.headline}
          </p>
        )}
        {profile.commonInterests && profile.commonInterests.length > 0 && (
          <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="truncate">
              {profile.commonInterests.slice(0, 2).join(', ')}
            </span>
          </div>
        )}
      </div>

      <div className="w-full mt-5 flex-shrink-0">
        <div className="flex flex-col gap-2 w-full">
          {friendState === 'sent' ? (
            <Button disabled variant="outline" className="w-full">
              <UserCheck className="mr-2 h-4 w-4" />
              Request Sent
            </Button>
          ) : (
            <Button
              onClick={handleAddClick}
              disabled={friendState === 'loading'}
              className="w-full"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {friendState === 'loading' ? 'Sending...' : 'Add Friend'}
            </Button>
          )}

          {followState === 'following' ? (
            <Button disabled variant="outline" className="w-full">
              <UserCheck className="mr-2 h-4 w-4" />
              Following
            </Button>
          ) : (
            <Button
              onClick={handleFollowClick}
              disabled={followState === 'loading'}
              variant="secondary"
              className="w-full"
            >
              <Rss className="mr-2 h-4 w-4" />
              {followState === 'loading' ? 'Following...' : 'Follow'}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(profile.id)}
            className="w-full text-destructive hover:bg-destructive/10"
          >
            <X className="mr-2 h-4 w-4" />
            Dismiss
          </Button>
        </div>
      </div>
    </Card>
  );
};
