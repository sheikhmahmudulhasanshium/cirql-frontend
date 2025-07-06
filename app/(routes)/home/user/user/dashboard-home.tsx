import BasicBodyProvider from "@/components/providers/basic-body-provider";
import { Shortcuts } from "./ShortCuts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

interface UserDashboardProps {
  userName: string;
}

const UserDashboard = ({ userName }: UserDashboardProps) => (
   <BasicBodyProvider>
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold">Welcome back, {userName}!</h1>
        <p className="text-lg text-muted-foreground">Here&apos;s a look at what&apos;s happening.</p>
      </div>
      
      {/* --- START OF NEW LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main content area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Newspaper className="mr-2 h-5 w-5" /> Newsfeed</CardTitle>
              <CardDescription>The latest updates from the community.</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">Newsfeed coming soon!</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar area for shortcuts */}
        <div className="lg:col-span-1">
          <Shortcuts />
        </div>
      </div>
      {/* --- END OF NEW LAYOUT --- */}

    </div>
  </BasicBodyProvider>
);
export default UserDashboard;