// components/admin/admin-layout.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/components/contexts/AuthContext';
import Sidebar, { AdminView } from './admin-sidebar';
import DashboardHeader from './dashboard-header';
import DashboardHome from './dashboard-home';
import ManageContent from './admin-manage-content';
import AppSettings from './admin-settings';
import AdminMessages from './admin-messages'; // --- NEW: Import the messages component ---
import { ManageUsers } from './admin-manage-users';

const AdminLayout = () => {
  useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardHome />;
      case 'users': return <ManageUsers />;
      case 'content': return <ManageContent />;
      case 'messages': return <AdminMessages />; // --- NEW: Add the case for the new view ---
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
      <div className="flex flex-col flex-1">
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