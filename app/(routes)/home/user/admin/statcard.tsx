// components/admin/StatCard.tsx
'use client';

import { LucideProps } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
// --- FIX: Import ReactNode to use as a type ---
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  // --- FIX: Changed type from 'string | number' to 'ReactNode' ---
  // This allows passing strings, numbers, or complex JSX elements like a styled <span>.
  value: ReactNode;
  icon: React.ComponentType<LucideProps>;
  description?: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, icon: Icon, description, isLoading }: StatCardProps) => {
  if (isLoading) {
    return <Skeleton className="h-[125px] w-full" />;
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        {/* This div now correctly renders a string, number, or JSX element */}
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
};

export default StatCard;