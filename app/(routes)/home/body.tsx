'use client';

import { useAuth } from "@/components/contexts/AuthContext";
import AdminLayout from "./user/admin/admin-layout";
import UserDashboard from "./user/user/dashboard-home";



const HomePage = () => {
  const { state } = useAuth();
  const isAdmin = state?.isAdmin ?? false;

  // Render the AdminLayout if the user is an admin
  if (isAdmin) {
    return <AdminLayout />;
  }

  // Otherwise, render the standard user dashboard
  const userName = `${state?.user?.firstName || ''} ${state?.user?.lastName || ''}`.trim() || "Guest";
  return <UserDashboard userName={userName} />;
};
 
export default HomePage;