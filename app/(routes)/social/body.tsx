'use client';

import { useState, ReactNode } from 'react';
import SocialNavbar from './navbar';
import { FriendsList } from './friends/body';
import { FollowersList } from './followers/body';
import { FriendRequestList } from './friend-requests/body';
import { SentFriendRequestList } from './sent-requests/body';
// 1. Import the main component for the recommendations view
import RecommendationsBody from './recommendations/body'; 

// 2. Update the render logic
const renderActiveView = (view: string): ReactNode => {
  switch (view) {
    // Add the 'recommendations' case
    case 'recommendations':
      return <RecommendationsBody />;
    // Correct the case names to match the navbar IDs
    case 'friends':
      return <FriendsList />;
    case 'followers':
      return <FollowersList />;
    case 'friend-requests':
      return <FriendRequestList />;
    case 'sent-requests':
      return <SentFriendRequestList />;
    case 'follow-requests':
      return <p className="text-center text-muted-foreground py-8">Follow Requests component goes here.</p>;
    // Change the default view to recommendations
    default:
      return <RecommendationsBody />;
  }
};


const Body = () => {
  // 3. Set the default active view to 'recommendations'
  const [activeView, setActiveView] = useState('recommendations');

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* 4. Refactor layout for better structure */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* The Navbar now acts as the sidebar on desktop and top-bar on mobile */}
        <SocialNavbar activeView={activeView} setActiveView={setActiveView} />
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {renderActiveView(activeView)}
        </main>
      </div>
    </div>
  );
};

export default Body;