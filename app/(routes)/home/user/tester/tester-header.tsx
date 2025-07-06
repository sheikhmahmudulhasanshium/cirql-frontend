'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { TesterView } from './tester-sidebar';

interface TesterHeaderProps {
  setMobileMenuOpen: (open: boolean) => void;
  activeView: TesterView;
}

const getTitle = (view: TesterView) => {
    const titles: Record<TesterView, string> = {
        dashboard: 'Tester Dashboard',
        'report-issue': 'Report an Issue',
        'my-bug-reports': 'My Submitted Bug Reports',
    };
    return titles[view];
}

const TesterHeader = ({ setMobileMenuOpen, activeView }: TesterHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 my-4">
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

export default TesterHeader;