// components/admin/admin-sidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LucideProps,
  Inbox, // --- NEW: Import the Inbox icon ---
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --- MODIFIED: Add 'messages' to the type ---
export type AdminView = 'dashboard' | 'users' | 'content' | 'settings' | 'messages';

interface NavItem {
  id: AdminView;
  label: string;
  icon: React.ComponentType<LucideProps>;
}

// --- MODIFIED: Add the new navigation item ---
const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Manage Users', icon: Users },
  { id: 'content', label: 'Manage Content', icon: FileText },
  { id: 'messages', label: 'Contact Inbox', icon: Inbox }, // <-- ADDED THIS LINE
];

// The rest of the file remains unchanged...
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeView: AdminView;
  setActiveView: React.Dispatch<React.SetStateAction<AdminView>>;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarNav = ({ isCollapsed, activeView, setActiveView, onLinkClick }: {
  isCollapsed: boolean;
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  onLinkClick?: () => void;
}) => {
  const handleItemClick = (id: AdminView) => {
    setActiveView(id);
    if (onLinkClick) onLinkClick();
  };

  return (
    <>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? "secondary" : "ghost"}
            className={cn("w-full justify-start gap-3", isCollapsed && "justify-center")}
            onClick={() => handleItemClick(item.id)}
            title={item.label}
          >
            <item.icon className={cn("h-5 w-5", isCollapsed && "mx-auto")} />
            {!isCollapsed && <span>{item.label}</span>}
          </Button>
        ))}
      </nav>
      <div className="mt-auto p-2 border-t">
        <Button
          variant={activeView === 'settings' ? "secondary" : "ghost"}
          className={cn("w-full justify-start gap-3", isCollapsed && "justify-center")}
          onClick={() => handleItemClick('settings')}
          title="Settings"
        >
          <Settings className={cn("h-5 w-5", isCollapsed && "mx-auto")} />
          {!isCollapsed && <span>Settings</span>}
        </Button>
      </div>
    </>
  );
};


const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  activeView,
  setActiveView,
  isMobileMenuOpen,
  setMobileMenuOpen,
}: SidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mobileSidebarContent = (
    <div className="md:hidden">
      {isMobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60"
        />
      )}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-background z-50 flex flex-col",
        "transform transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
         <div className="flex h-14 items-center border-b px-4">
            <Link href="/home" className="text-lg font-bold">CiRQL Admin</Link>
        </div>
        <SidebarNav 
          isCollapsed={false} 
          activeView={activeView} 
          setActiveView={setActiveView} 
          onLinkClick={() => setMobileMenuOpen(false)}
        />
      </aside>
    </div>
  );

  return (
    <>
      <aside className={cn(
        "hidden bg-background border-r md:flex md:flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className="flex h-14 items-center border-b px-4 justify-between">
          {!isCollapsed && <Link href="/home" className="font-bold">Cirql Admin</Link>}
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </Button>
        </div>
        <SidebarNav isCollapsed={isCollapsed} activeView={activeView} setActiveView={setActiveView} />
      </aside>

      {isMounted ? createPortal(mobileSidebarContent, document.body) : null}
    </>
  );
};

export default Sidebar;