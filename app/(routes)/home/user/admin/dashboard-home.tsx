// app/(routes)/home/user/admin/dashboard-home.tsx
'use client';

import { Users, UserX, TrendingUp, BarChart, UserCheck } from 'lucide-react';
import StatCard from './statcard';
import { useAdminUsers } from '@/components/hooks/users/get-users-by-admin';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
// --- FIX: Corrected the import path for the analytics hook ---
import useUserAnalytics from '@/components/hooks/users/get-user-analytics-by-user';
const DashboardHome = () => {
  const { data: analyticsData, isLoading: isAnalyticsLoading, error: analyticsError } = useUserAnalytics();
  const { users: recentUsers, isLoading: isUsersLoading, error: usersError } = useAdminUsers(1, 5, {});
  const error = analyticsError || usersError;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border bg-card">
        <p className="text-destructive">Failed to load dashboard data.</p>
      </div>
    );
  }

  const growth = analyticsData?.weeklyGrowth;
  const growthPercentage = growth?.percentage ?? 0;
  const growthDescription = growth ? `${growth.newUsersThisWeek} new this week` : 'Calculating...';
  const growthColor = growthPercentage >= 0 ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className="space-y-6">
      {/* Section 1: Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={analyticsData?.totalUsers ?? '...'}
          icon={Users}
          description={`${analyticsData?.statusCounts.active ?? '...'} active accounts`}
          isLoading={isAnalyticsLoading}
        />
        <StatCard
          title="Weekly Growth"
          // This JSX is now valid because the `value` prop in StatCard accepts a ReactNode
          value={
            <span className={growthColor}>
              {growthPercentage > 0 ? '+' : ''}{growthPercentage}%
            </span>
          }
          icon={TrendingUp}
          description={growthDescription}
          isLoading={isAnalyticsLoading}
        />
        <StatCard
          title="Banned Accounts"
          value={analyticsData?.statusCounts.banned ?? '...'}
          icon={UserX}
          description="Users with restricted access"
          isLoading={isAnalyticsLoading}
        />
        <StatCard
          title="Engagement"
          value={analyticsData?.engagement.active ?? '...'}
          icon={UserCheck}
          description="Users active in last 30 days"
          isLoading={isAnalyticsLoading}
        />
      </div>

      {/* Section 2: Recent Signups and Chart Placeholder */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <div className="space-y-4">
            {isUsersLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))
            ) : (
              recentUsers.map(user => (
                <div key={user._id} className="flex items-center space-x-4">
                  <Avatar className="h-9 w-9">
                    {user.picture && <AvatarImage src={user.picture} alt={`${user.firstName}`} />}
                    <AvatarFallback>{user.firstName?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-1 rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col">
           <h3 className="text-lg font-semibold mb-4">User Growth Chart</h3>
           <div className="flex-1 flex items-center justify-center h-48 bg-muted rounded-lg">
              <BarChart className="h-10 w-10 text-muted-foreground" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;