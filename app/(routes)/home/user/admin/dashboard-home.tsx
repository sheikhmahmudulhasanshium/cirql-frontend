'use client';

import { useState } from 'react';
import { Users, UserX, TrendingUp, UserCheck, TestTube2, BarChart2 } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import StatCard from './statcard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import useAdminAnalytics from '@/components/hooks/activity/useAdminAnalytics';
import useAdminGrowthChart from '@/components/hooks/activity/useAdminGrowthChart';
import { ActiveUserDto, AnalyticsPeriod } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const periodLabels: Record<AnalyticsPeriod, string> = {
  '1m': 'Last Minute',
  '12h': 'Last 12 Hours',
  '1d': 'Last 24 Hours',
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '365d': 'Last Year',
};

const DashboardHome = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>('7d');
  
  const { data: analyticsData, isLoading: isAnalyticsLoading, error: analyticsError } = useAdminAnalytics(period);
  // --- NEW: Call the chart hook ---
  const { data: chartData, isLoading: isChartLoading, error: chartError } = useAdminGrowthChart(period);

  if (analyticsError || chartError) {
    return <div className="flex items-center justify-center h-64 rounded-lg border bg-card"><p className="text-destructive">Failed to load dashboard data.</p></div>;
  }

  const growth = analyticsData?.weeklyGrowth;
  const growthPercentage = growth?.percentageChange ?? 0;
  const newUsersText = growth ? `${growth.newUsers} new` : '...';
  const growthColor = growthPercentage >= 0 ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={period} onValueChange={(value: AnalyticsPeriod) => setPeriod(value)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select period" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Test (1 Minute)</SelectItem>
            <SelectItem value="12h">Last 12 Hours</SelectItem>
            <SelectItem value="1d">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="365d">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={analyticsData?.totalUsers ?? '...'} icon={Users} description={`${analyticsData?.totalUsers ? analyticsData.totalUsers - (analyticsData.bannedUsers ?? 0) : '...'} active`} isLoading={isAnalyticsLoading}/>
        <StatCard title="New Users" value={<span className={growthColor}>{growthPercentage > 0 ? '+' : ''}{growthPercentage.toFixed(1)}%</span>} icon={TrendingUp} description={`${newUsersText} in this period`} isLoading={isAnalyticsLoading}/>
        <StatCard title="Banned Accounts" value={analyticsData?.bannedUsers ?? '...'} icon={UserX} description="Users with restricted access" isLoading={isAnalyticsLoading}/>
        <StatCard title="Top Active User" value={analyticsData?.mostActiveUsers?.[0]?.firstName || '...'} icon={UserCheck} description={`In ${periodLabels[period].toLowerCase()}`} isLoading={isAnalyticsLoading}/>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Top 5 Active Users ({periodLabels[period]})</CardTitle>
              {period === '1m' && <div className="flex items-center gap-2 text-xs text-amber-600"><TestTube2 className="h-4 w-4" /> TEST MODE</div>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isAnalyticsLoading ? (
                Array.from({ length: 5 }).map((_, i) => ( <div key={i} className="flex items-center space-x-4"><Skeleton className="h-9 w-9 rounded-full" /><div className="space-y-1.5 w-full"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></div></div> ))
              ) : analyticsData && analyticsData.mostActiveUsers.length > 0 ? (
                analyticsData.mostActiveUsers.map((user: ActiveUserDto) => (
                  <div key={user.userId} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4 min-w-0">
                      <Avatar className="h-9 w-9"><AvatarImage src={user.picture} alt={user.firstName} /><AvatarFallback>{user.firstName?.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                      <div className="min-w-0"><p className="text-sm font-medium leading-none truncate">{user.firstName} {user.lastName}</p></div>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.activityCount} actions</p>
                  </div>
                ))
              ) : (
                <p className='text-center text-muted-foreground py-4'>No user activity recorded in this period.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* --- THIS IS THE FINAL FIX --- */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader><CardTitle>User Growth ({periodLabels[period]})</CardTitle></CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {isChartLoading ? (
              <Skeleton className="w-full h-[250px]" />
            ) : chartData && chartData.length > 0 ? (
              <ChartContainer config={{}} className="w-full h-[250px]">
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} width={20} allowDecimals={false} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="count" fill="var(--color-primary)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex-1 flex items-center justify-center h-48 bg-muted rounded-lg">
                <div className="text-center text-muted-foreground">
                  <BarChart2 className="h-10 w-10 mx-auto mb-2" />
                  <p>No new user data for this period.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* --- END OF FINAL FIX --- */}
      </div>
    </div>
  );
};

export default DashboardHome;