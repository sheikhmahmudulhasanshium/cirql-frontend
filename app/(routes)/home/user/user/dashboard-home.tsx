import BasicBodyProvider from "@/components/providers/basic-body-provider";

interface UserDashboardProps {
  userName: string;
}

const UserDashboard = ({ userName }: UserDashboardProps) => (
  <BasicBodyProvider>
    <div className="flex flex-1 justify-center items-center min-h-screen w-full flex-col gap-4 text-center p-4">
        <p className="text-4xl font-bold">Welcome, {userName}!</p>
        <p className="text-xl text-gray-600 max-w-lg">This is your personal space. Newsfeed coming soon!</p>
    </div>
  </BasicBodyProvider>
);
export default UserDashboard;