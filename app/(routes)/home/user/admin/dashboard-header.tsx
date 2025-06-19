'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { AdminView } from './admin-sidebar';

interface DashboardHeaderProps {
  setMobileMenuOpen: (open: boolean) => void;
  activeView: AdminView;
}

const getTitle = (view: AdminView) => {
    const titles = {
        dashboard: 'Dashboard',
        users: 'User Management',
        content: 'Content Management',
        settings: 'Application Settings'
    };
    return titles[view];
}

const DashboardHeader = ({ setMobileMenuOpen, activeView }: DashboardHeaderProps) => {
  return (
    // FIX: Standardized height to h-14 and added consistent padding
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Button
        size="icon"
        variant="outline"
        className="md:hidden"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open Menu</span>
      </Button>
      
      <div className="flex-1">
        <h1 className="text-xl font-semibold">{getTitle(activeView)}</h1>
      </div>
    </header>
  );
};

export default DashboardHeader;