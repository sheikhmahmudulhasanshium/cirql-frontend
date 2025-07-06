'use client';

import { useAuth, Role } from "@/components/contexts/AuthContext";
import AdminLayout from "./user/admin/admin-layout";
import UserDashboard from "./user/user/dashboard-home";
import TesterLayout from "./user/tester/tester-layout";
import BasicBodyProvider from '@/components/providers/basic-body-provider';
import { useActivityHeartbeat } from "@/components/hooks/activity/useActivityHeartbeat";

const Body = () => {
    const { state } = useAuth();
    // --- START OF FIX: Add parentheses to clarify operator precedence ---
    const isTester = state?.user?.roles.includes(Role.Tester) ?? false;
    const isAdmin = (state?.user?.roles.includes(Role.Admin) || state?.user?.roles.includes(Role.Owner)) ?? false;
    // --- END OF FIX ---

    useActivityHeartbeat();

    const contentToRender = () => {
      if (isAdmin) {
        return <AdminLayout />;
      }
      if (isTester) {
        return <TesterLayout />;
      }
      return <UserDashboard userName={`${state?.user?.firstName || ''} ${state?.user?.lastName || ''}`.trim() || "Guest"} />;
    };
    
    return (
        <BasicBodyProvider>
            {contentToRender()}
        </BasicBodyProvider>
    );
};
 
export default Body;