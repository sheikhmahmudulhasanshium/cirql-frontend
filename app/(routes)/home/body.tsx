'use client';

// Imports from the old HomePage component, with paths adjusted
import { useAuth } from "@/components/contexts/AuthContext";
import AdminLayout from "./user/admin/admin-layout";
import UserDashboard from "./user/user/dashboard-home";

// Import from the old Body component
import BasicBodyProvider from '@/components/providers/basic-body-provider';

const Body = () => {
    // Logic from the old HomePage component is now directly here
    const { state } = useAuth();
    const isAdmin = state?.isAdmin ?? false;

    // Determine which main component to render based on the user's role
    const contentToRender = isAdmin
        ? <AdminLayout />
        : <UserDashboard userName={`${state?.user?.firstName || ''} ${state?.user?.lastName || ''}`.trim() || "Guest"} />;
    
    // The BasicBodyProvider still wraps the main content
    return (
        <BasicBodyProvider>
            {contentToRender}
        </BasicBodyProvider>
    );
};
 
export default Body;