// app/(routes)/home/user/admin/admin-layout.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/components/contexts/AuthContext';
// FIX: Corrected import path
import AdminManageAnnouncements from './admin-manage-announcements';
import Sidebar, { AdminView } from './admin-sidebar';
import DashboardHome from './dashboard-home';
import { ManageUsers } from './admin-manage-users';
import AdminMessages from './admin-messages';
import AppSettings from './admin-settings';
import DashboardHeader from './dashboard-header';

const AdminLayout = () => {
  useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // --- START OF FIX ---
  // Removed the extra equals sign from this line.
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  // --- END OF FIX ---
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardHome />;
      case 'users': return <ManageUsers />;
      case 'content': return <AdminManageAnnouncements />;
      case 'messages': return <AdminMessages />;
      case 'settings': return <AppSettings />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeView={activeView}
        setActiveView={setActiveView}
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <DashboardHeader
          setMobileMenuOpen={setMobileMenuOpen}
          activeView={activeView}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;