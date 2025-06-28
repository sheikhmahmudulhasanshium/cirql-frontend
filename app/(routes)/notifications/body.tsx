'use client';

import { useState } from 'react';
import BasicBodyProvider from '@/components/providers/basic-body-provider';
import { Button } from "@/components/ui/button";
import AnnouncementFeed from '../components/announcement';
import NotificationFeed from '../components/notifications';

// Define the types for our filters
type FilterType = 'all' | 'unread' | 'read' | 'announcements';

const Body = () => {
    // State to manage the active filter. 'all' is the default.
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    return (
        <BasicBodyProvider>
            <div className="container mx-auto py-8 px-4 md:px-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Updates</h1>
                </div>
                
                {/* Unified Filter Bar */}
                <div className="flex items-center gap-2 border-b pb-2 mb-6 overflow-x-auto">
                    <Button
                        variant={activeFilter === 'all' ? 'secondary' : 'ghost'}
                        onClick={() => setActiveFilter('all')}
                        className="flex-shrink-0"
                    >
                        All
                    </Button>
                    <Button
                        variant={activeFilter === 'unread' ? 'secondary' : 'ghost'}
                        onClick={() => setActiveFilter('unread')}
                        className="flex-shrink-0"
                    >
                        Unread
                    </Button>
                     <Button
                        variant={activeFilter === 'read' ? 'secondary' : 'ghost'}
                        onClick={() => setActiveFilter('read')}
                        className="flex-shrink-0"
                    >
                        Read
                    </Button>
                    <Button
                        variant={activeFilter === 'announcements' ? 'secondary' : 'ghost'}
                        onClick={() => setActiveFilter('announcements')}
                        className="flex-shrink-0"
                    >
                        Announcements
                    </Button>
                </div>
                
                {/* Conditionally Render the Correct Feed */}
                <div className="w-full">
                    {activeFilter === 'announcements' ? (
                        <AnnouncementFeed />
                    ) : (
                        // Pass the filter ('all', 'read', or 'unread') to the notification feed
                        <NotificationFeed filter={activeFilter} />
                    )}
                </div>

            </div>
        </BasicBodyProvider>
    );
}
 
export default Body;