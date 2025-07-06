'use client';

import { useState } from 'react';
import { useAuth } from '@/components/contexts/AuthContext';
import TesterSidebar, { TesterView } from './tester-sidebar';
import TesterHeader from './tester-header';
import TesterDashboard from './tester-dashboard';
import IssueReporter from './issue-reporter';
import BugList from './bug-list';

const TesterLayout = () => {
  const { state } = useAuth();
  const userName = `${state?.user?.firstName || ''} ${state?.user?.lastName || ''}`.trim() || "Tester";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<TesterView>('dashboard');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <TesterDashboard userName={userName} setActiveView={setActiveView} />;
      case 'report-issue':
        return <IssueReporter />;
      case 'my-bug-reports':
        return <BugList />;
      default:
        return <TesterDashboard userName={userName} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <TesterSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeView={activeView}
        setActiveView={setActiveView}
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <TesterHeader
          setMobileMenuOpen={setMobileMenuOpen}
          activeView={activeView}
        />
        {/* --- START OF FIX: Reduced padding for extra-small screens --- */}
        <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
        {/* --- END OF FIX --- */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TesterLayout;