'use client';

import Link from 'next/link';
import { Compass, History, Link2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useNavigationStats } from '@/components/hooks/activity/useNavigationStatus';

// Helper to format the display name of a URL
const formatUrlDisplayName = (url: string) => {
  if (url === '/') return 'Home';
  // Capitalize the first letter and replace dashes with spaces
  return url
    .substring(1)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

export const Shortcuts = () => {
  const { stats, isLoading } = useNavigationStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5" /> Quick Access</CardTitle>
          <CardDescription>Your most visited pages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-4/5" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5" /> Quick Access</CardTitle>
        <CardDescription>Your most visited pages.</CardDescription>
      </CardHeader>
      <CardContent>
        {stats && stats.mostVisitedPages.length > 0 ? (
          <ul className="space-y-2">
            {stats.mostVisitedPages.map((page) => (
              <li key={page.url}>
                <Link href={page.url} passHref>
                  <Button variant="ghost" className="w-full justify-start h-auto py-2">
                    <Link2 className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{formatUrlDisplayName(page.url)}</span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-4">
            <Compass className="mx-auto h-8 w-8 mb-2" />
            <p>Start exploring the site and your shortcuts will appear here!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};