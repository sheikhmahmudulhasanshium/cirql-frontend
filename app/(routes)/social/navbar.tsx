'use client';

import { Users, UserPlus, Mail, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const navMenu = [
  { id: 'friends', label: 'Friends', icon: Users },
  { id: 'followers', label: 'Followers', icon: UserCheck },
  { id: 'friend-requests', label: 'Friend Requests', icon: UserPlus },
  { id: 'sent-requests', label: 'Sent Requests', icon: Mail },
  { id: 'follow-requests', label: 'Follow Requests', icon: Mail },
];

interface SocialNavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const SocialNavbar = ({ activeView, setActiveView }: SocialNavbarProps) => {
  return (
    <>
      {/* Sidebar layout for md+ */}
      <aside className="hidden md:block w-full md:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-1">
          {navMenu.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                  isActive && 'bg-muted font-medium text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Top navbar for mobile */}
      <nav className="md:hidden sticky top-16 z-10 bg-background border-b border-border py-2 px-4 flex overflow-x-auto gap-4">
        {navMenu.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground transition-all hover:text-primary hover:bg-muted whitespace-nowrap',
                isActive && 'bg-muted font-medium text-primary'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default SocialNavbar;
