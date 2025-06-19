// components/announcements/announcements.tsx
"use client";

import useAnnouncements from '@/components/hooks/announcements/get-announcements';
import CreateAnnouncementModal from '@/components/modals/announcements/create-announcement-modal';
import BasicBodyProvider from '@/components/providers/basic-body-provider';
import AnnouncementCard from './announcement-card';
import { useAuth } from '@/components/contexts/AuthContext';
//import FilteredAnnouncementModal from '@/components/modals/announcements/filtered-announcements';
//import useAnnouncementsWithFilter from '@/components/hooks/announcements/get-announcement-with-filter';


const Announcements = () => {
     const { data: announcements, isLoading, error, refetch } = useAnnouncements(); //  add refetch
    
    // FIX: Destructure 'state' from useAuth, then get 'isAdmin' from the state object.
    const { state } = useAuth();
    const { isAdmin } = state;

    const handleDataChange = () => { // function to refetch data
        refetch()
    };

    if (isLoading) {
        return <div>Loading announcements...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <BasicBodyProvider>
            <div className='flex flex-col justify-between min-h-svh gap-4'>
               <div className='pt-8 pl-12'>
                    <h1 className='text-4xl italic'>📢 Announcements</h1>
                </div>
                    <div className='px-4 justify-end flex w-full pt-4' >                
                        {isAdmin&&
                            <CreateAnnouncementModal onCreateSuccess={handleDataChange} />
                        }
                        {/*announcements&&
                            announcements?.length>5&&
                            <FilteredAnnouncementModal/>
                        */}
                </div>
                
                <div className='flex flex-col gap-1'>
                                   
                 {announcements && announcements.map((announcement) => (
                    <AnnouncementCard
                        key={announcement._id}
                        announcement={announcement}
                        onUpdateSuccess={handleDataChange}
                        onDeleteSuccess={handleDataChange}
                    />
                )).reverse()}
                </div>

            </div>
        </BasicBodyProvider>

    )

}

export default Announcements;
