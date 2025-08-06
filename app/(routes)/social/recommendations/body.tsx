'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BasicBodyProvider from "@/components/providers/basic-body-provider";
import { useUserRecommendations } from '@/components/hooks/social/use-recommendations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { SocialProfile } from '@/lib/types';
import { RecommendationList } from './list';

const RecommendationsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <Card key={i} className="flex flex-col items-center p-4 h-[230px]">
        <Skeleton className="h-20 w-20 rounded-full mb-3" />
        <Skeleton className="h-5 w-3/4 mb-1" />
        <div className="flex-grow" />
        <div className="mt-4 flex flex-col sm:flex-row gap-2 w-full">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    ))}
  </div>
);

const Body = () => {
  const { data: initialData, isLoading, isError, refetch } = useUserRecommendations();
  const [recommendations, setRecommendations] = useState<SocialProfile[]>([]);

  useEffect(() => {
    setRecommendations(initialData);
  }, [initialData]);

  const handleAction = (userIdToDismiss: string) => {
    setRecommendations(prev =>
      prev.filter(socialProfile => {
        if (typeof socialProfile.owner === 'object' && socialProfile.owner !== null) {
          return socialProfile.owner.id !== userIdToDismiss;
        }
        return false;
      })
    );
  };

  const handleAddFriend = async (userId: string) => {
    console.log(`Sending friend request to ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    handleAction(userId);
  };
  const handleFollow = async (userId: string) => {
        // Here you would call your actual API to follow a user
        console.log(`Following user: ${userId}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        // You might not want to dismiss the card after following,
        // as the button state changes to "Following".
    };


  return (
    <BasicBodyProvider>
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          <span className="hidden sm:inline">People You Might Know</span>
          <span className="sm:hidden">Recommendations</span>
        </h1>

        {isLoading && <RecommendationsSkeleton />}

        {isError && (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 border rounded-lg bg-card">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold">Could not load recommendations</h2>
            <p className="text-muted-foreground mt-2">There was an issue fetching suggestions for you.</p>
            <Button onClick={() => refetch()} className="mt-6">Try Again</Button>
          </div>
        )}

        {!isLoading && !isError && recommendations.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 border rounded-lg bg-card">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">All Caught Up!</h2>
            <p className="text-muted-foreground mt-2">
              We don&apos;t have any new recommendations for you right now. <br />
              Add more topics to your profile to discover more people.
            </p>
            <Link href="/interests">
              <Button className="mt-6">Manage Interests</Button>
            </Link>
          </div>
        )}

        {!isLoading && !isError && recommendations.length > 0 && (
          <RecommendationList
            layout="horizontal" // change to "grid" for vertical layout
            recommendations={recommendations}
            onDismiss={handleAction}
            onAddFriend={handleAddFriend}
            onFollow={handleFollow}
          />
        )}
      </div>
      <div className="m-8 p-4 rounded-md border border-border bg-muted/30 text-sm text-muted-foreground">
        <p className="mb-1 font-medium text-foreground">
            🎯 Not seeing what you expected?
        </p>
        <p>
            Recommendations are based on your selected interests. To get more personalized suggestions, please update your preferences on the{' '}
            <Link href="/interests" className="text-primary font-medium hover:underline">
            Interests Page
            </Link>
            .
        </p>
        </div>

    </BasicBodyProvider>
  );
};

export default Body;
