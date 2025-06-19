'use client';

import { Users, UserX, Activity } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StatCard from './statcard';
import { useAdminUsers } from '@/components/hooks/users/get-users-by-admin';

const DashboardHome = () => {
  // Hook call 1: For total user count and recent user list
  const { 
    users, 
    pagination, 
    isLoading: isUsersLoading, 
    error 
  } = useAdminUsers(1, 5, {});

  // Hook call 2: For Banned user count. Very efficient.
  const { 
    pagination: bannedPagination, 
    isLoading: isBannedLoading 
  } = useAdminUsers(1, 1, { accountStatus: 'banned' });

  // --- FIX: Removed unused 'isLoading' variable ---
  // The individual loading states (isUsersLoading, isBannedLoading) are used below.

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border bg-card">
        <p className="text-destructive">Failed to load dashboard data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value={pagination?.totalItems ?? '...'} 
          icon={Users}
          description="All user accounts"
          isLoading={isUsersLoading}
        />
        <StatCard 
          title="Banned Accounts" 
          value={bannedPagination?.totalItems ?? '...'} 
          icon={UserX}
          description="Users with restricted access"
          isLoading={isBannedLoading}
        />
        <StatCard 
          title="Active Now" 
          value="73" // NOTE: This remains mock data as the API doesn't support this query
          icon={Activity}
          description="Users active in the last hour"
          isLoading={isUsersLoading} // Can use any loading flag here
        />
      </div>

      {/* Section 2: Recent Signups and Chart Placeholder */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <p className="text-sm text-muted-foreground -mt-3 mb-4">Showing the first 5 users in the database.</p>
          <div className="space-y-4">
            {isUsersLoading ? (
              // Skeleton loaders for the recent users list
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-9 w-9 bg-muted rounded-full"></div>
                  <div className="space-y-1.5">
                    <div className="h-4 w-32 bg-muted rounded-md"></div>
                    <div className="h-3 w-48 bg-muted rounded-md"></div>
                  </div>
                </div>
              ))
            ) : (
              // Real data from the hook
              users.map(user => (
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
           <h3 className="text-lg font-semibold mb-4">User Growth</h3>
           <div className="flex-1 flex items-center justify-center h-48 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Chart component will be here</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;