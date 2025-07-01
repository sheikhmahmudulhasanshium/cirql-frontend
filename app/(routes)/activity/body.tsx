'use client';

import { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis,  } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalyticsPeriod } from '@/lib/types';
import BasicBodyProvider from '@/components/providers/basic-body-provider';
import useMyActivityChart from '@/components/hooks/activity/useMyActivityChart';
import { Hand, Clock } from 'lucide-react';
import useUserActivitySummary from '@/components/hooks/activity/useUserActivitySummary';

const periodLabels: Record<AnalyticsPeriod, string> = {
  '1m': 'Last Minute',
  '12h': 'Last 12 Hours',
  '1d': 'Last 24 Hours',
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '365d': 'Last Year',
};

const Body = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>('7d');
  
  const { data: chartData, isLoading: isChartLoading, error: chartError } = useMyActivityChart(period);
  const { summary, isLoading: isSummaryLoading, error: summaryError } = useUserActivitySummary();
  
  const totalActions = chartData.reduce((acc, item) => acc + item.count, 0);

  const renderContent = () => {
    if (chartError || summaryError) {
      return <div className="text-destructive text-center p-8">Failed to load your activity data.</div>;
    }
    
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                    <Hand className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isChartLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{totalActions}</div>}
                    <p className="text-xs text-muted-foreground">in the {periodLabels[period].toLowerCase()}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Screen Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isSummaryLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{summary?.screenTimeMinutes ?? 0} min</div>}
                     <p className="text-xs text-muted-foreground">in the last 7 days</p>
                </CardContent>
            </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
            <CardDescription>A summary of all your actions on the platform.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full p-2">
            {isChartLoading ? <Skeleton className="h-full w-full" /> : (
              <ChartContainer config={{}} className="h-full w-full">
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="count" fill="var(--color-primary)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <BasicBodyProvider>
      <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Activity</h1>
              <p className="text-muted-foreground">Here&apos;s a look at your engagement over time.</p>
            </div>
            <Select value={period} onValueChange={(value: AnalyticsPeriod) => setPeriod(value)}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Select period" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="365d">Last Year</SelectItem>
              </SelectContent>
            </Select>
        </div>
        {renderContent()}
      </div>
    </BasicBodyProvider>
  );
};

export default Body;