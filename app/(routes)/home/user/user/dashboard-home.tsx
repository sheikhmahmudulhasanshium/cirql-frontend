'use client';

import { useState, useEffect } from 'react';
import BasicBodyProvider from "@/components/providers/basic-body-provider";
import { Shortcuts } from "./ShortCuts";
import { RecommendationList } from "@/app/(routes)/social/recommendations/list";
import { useUserRecommendations } from '@/components/hooks/social/use-recommendations';
import { SocialProfile } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { SocialActionsGrid } from './social-link-card';

const DashboardSkeleton = () => (
  <div className="container mx-auto p-4 sm:p-6 space-y-8">
    <Skeleton className="h-10 w-1/2" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
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
        </div>
      </div>
      <div className="lg:col-span-1 space-y-8">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  </div>
);

interface UserDashboardProps {
  userName: string;
}

const UserDashboard = ({ userName }: UserDashboardProps) => {
  const { data: initialData, isLoading, isError } = useUserRecommendations();
  const [recommendations, setRecommendations] = useState<SocialProfile[]>([]);

  useEffect(() => {
    if (initialData) {
      setRecommendations(initialData.slice(0, 4));
    }
  }, [initialData]);

  const handleAction = (_userIdToDismiss: string) => {
    console.log('Dismiss user:', _userIdToDismiss);
    // Your dismiss handler
  };

  const handleAddFriend = async (_userId: string) => {
    console.log('Add friend:', _userId);
    // Your add friend handler
  };

  const handleFollow = async (_userId: string) => {
    console.log('Follow user:', _userId);
    // Your follow handler
  };

  if (isLoading) {
    return (
      <BasicBodyProvider>
        <DashboardSkeleton />
      </BasicBodyProvider>
    );
  }

  return (
    <BasicBodyProvider>
      <div className="container mx-auto p-4 sm:p-6 space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s a look at what&apos;s happening in your network.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {!isError && recommendations.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold tracking-tight mb-4">
                  Recommended For You
                </h2>
                <RecommendationList
                  layout="grid"
                  recommendations={recommendations}
                  onDismiss={handleAction}
                  onAddFriend={handleAddFriend}
                  onFollow={handleFollow}
                />
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8 sticky top-24">
            <Shortcuts />
            <Separator />
          </div>
        </div>

        {/* Full Width SocialActionsGrid */}
        <div className="w-full">
          <SocialActionsGrid />
        </div>
      </div>
    </BasicBodyProvider>
  );
};

export default UserDashboard;
