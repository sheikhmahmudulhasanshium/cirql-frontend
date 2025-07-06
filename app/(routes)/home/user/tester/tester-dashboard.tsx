'use client';

import { useState, useEffect, useMemo } from 'react';
import { TestTube2, Bug, ClipboardList, CheckCircle2, Hourglass, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TesterView } from './tester-sidebar';
import apiClient from '@/lib/apiClient';
import { TicketSummary, TicketStatus } from '@/lib/types';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import StatCard from '../admin/statcard';

interface TesterDashboardProps {
  userName: string;
  setActiveView: (view: TesterView) => void;
}

const TesterDashboard = ({ userName, setActiveView }: TesterDashboardProps) => {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    apiClient.get<TicketSummary[]>('/support/tickets', { signal: controller.signal })
      .then(res => {
        // --- START OF FIX: Remove the incorrect client-side filter ---
        // We want to see stats for ALL tickets submitted by the user.
        setTickets(res.data);
        // --- END OF FIX ---
      })
      .catch(err => {
        if (err.name !== 'CanceledError') {
          console.error("Failed to fetch tester tickets for dashboard", err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === TicketStatus.OPEN).length;
    const pending = tickets.filter(t => t.status === TicketStatus.PENDING_USER_REPLY).length;
    const closed = tickets.filter(t => t.status === TicketStatus.CLOSED).length;
    return { total, open, pending, closed };
  }, [tickets]);

  const chartData = [
    { name: 'Open', value: stats.open, fill: 'hsl(var(--chart-1))' },
    { name: 'Pending', value: stats.pending, fill: 'hsl(var(--chart-2))' },
    { name: 'Closed', value: stats.closed, fill: 'hsl(var(--chart-5))' },
  ];

  const chartConfig = {
    value: { label: 'Tickets' },
    open: { label: 'Open', color: 'hsl(var(--chart-1))' },
    pending: { label: 'Pending', color: 'hsl(var(--chart-2))' },
    closed: { label: 'Closed', color: 'hsl(var(--chart-5))' },
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          <TestTube2 className="mr-2 h-6 w-6 md:mr-3 md:h-8 md:w-8 text-primary" />
          Tester Dashboard
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Welcome, {userName}! This is your space for testing and reporting.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard isLoading={isLoading} title="Total Tickets Submitted" value={stats.total} icon={ClipboardList} description="All tickets you've created." />
        <StatCard isLoading={isLoading} title="Open & Investigating" value={stats.open} icon={Bug} description="Tickets currently being looked at." />
        <StatCard isLoading={isLoading} title="Awaiting Your Reply" value={stats.pending} icon={Hourglass} description="Tickets needing your input." />
        <StatCard isLoading={isLoading} title="Closed / Resolved" value={stats.closed} icon={CheckCircle2} description="Issues that have been resolved." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              My Tickets by Status
            </CardTitle>
            <CardDescription>A visual summary of all your submitted tickets.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-[250px]">
            {isLoading ? (
              <Skeleton className="w-full flex-1" />
            ) : tickets.length > 0 ? (
              <ChartContainer config={chartConfig} className="w-full h-full flex-1">
                <ResponsiveContainer>
                  <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 10, top: 5, right: 10, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={70} fontSize={12} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="value" radius={5} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center h-full bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">No ticket data to display.</p>
                </div>
            )}
          </CardContent>
        </Card>
        
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="mr-2 h-5 w-5" />
                My Bug Reports
              </CardTitle>
              <CardDescription>
                View and track all bug reports you&apos;ve submitted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setActiveView('my-bug-reports')} className="w-full">
                View Bug Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bug className="mr-2 h-5 w-5" />
                Submit a New Report
              </CardTitle>
              <CardDescription>
                Found something new? Let us know so we can fix it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setActiveView('report-issue')} className="w-full">
                Report an Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TesterDashboard;