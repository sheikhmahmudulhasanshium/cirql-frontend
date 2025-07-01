'use client';

import { useAuth } from "@/components/contexts/AuthContext";
import AdminLayout from "./user/admin/admin-layout";
import UserDashboard from "./user/user/dashboard-home";
import BasicBodyProvider from '@/components/providers/basic-body-provider';
import { useActivityHeartbeat } from "@/components/hooks/activity/useActivityHeartbeat";

const Body = () => {
    const { state } = useAuth();
    const isAdmin = state?.isAdmin ?? false;

    // This hook will automatically handle starting and stopping the timer 
    // based on the user's authentication status.
    useActivityHeartbeat();

    const contentToRender = isAdmin
        ? <AdminLayout />
        : <UserDashboard userName={`${state?.user?.firstName || ''} ${state?.user?.lastName || ''}`.trim() || "Guest"} />;
    
    return (
        <BasicBodyProvider>
            {contentToRender}
        </BasicBodyProvider>
    );
};
 
export default Body;