'use client';

import { useState, ReactNode } from 'react';
import SocialNavbar from './navbar';
import { FriendsList } from './friends/body';
import { FollowersList } from './followers/body';
import { FriendRequestList } from './friend-requests/body';

import { SentFriendRequestList } from './sent-requests/body';

const renderActiveView = (view: string): ReactNode => {
  switch (view) {
    case 'friends-list':
      return <FriendsList />;
    case 'followers-list':
      return <FollowersList />;
    case 'friend-requests':
      return <FriendRequestList />;
    case 'sent-requests':
      return <SentFriendRequestList />;
    case 'follow-requests':
      return <p className="text-center text-muted-foreground py-8">Follow Requests component goes here.</p>;
    default:
      return <FriendsList />;
  }
};


const Body = () => {
  const [activeView, setActiveView] = useState('friends-list');

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <SocialNavbar activeView={activeView} setActiveView={setActiveView} />

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mt-4 md:mt-0">
        {/* Sidebar takes left space in md+ */}
        <div className="hidden md:block w-64 flex-shrink-0" />
        
        {/* Main Content */}
        <main className="flex-1 min-w-0">{renderActiveView(activeView)}</main>
      </div>
    </div>
  );
};

export default Body;
