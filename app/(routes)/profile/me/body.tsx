'use client';

import { useState, useEffect } from 'react';
import { useMyProfile } from '@/components/hooks/profile/get-my-profile';
import BasicBodyProvider from '@/components/providers/basic-body-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InfoIcon, Globe2Icon, Heart, Pencil } from 'lucide-react'; // 1. Import Pencil icon
import Link from 'next/link';
import { ProfileActions } from '../menu-bar';
import { useGetMySettings } from '@/components/hooks/settings/get-settings';
// 2. Import the new modal component
import { InterestsModal } from '@/components/modals/profile/interests-modal';
import { Button } from '@/components/ui/button';

const breakpoints = {
  phone_sm: 374, sm: 640, tablet_portrait: 767, md: 768, desktop_sm: 1023,
};

const Body = () => {
  const { data, isLoading, isError, refetch: refetchProfile } = useMyProfile();
  // 3. Destructure the refetch function from useGetMySettings
  const { settings, isLoading: isLoadingSettings, refetch: refetchSettings } = useGetMySettings();
  const [width, setWidth] = useState<number | undefined>(undefined);
  // 4. Add state to control the modal
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading || isLoadingSettings || typeof width === 'undefined') {
    return <div className="text-center p-10">Loading...</div>;
  }
  if (isError || !data) {
    return <div className="text-center p-10">Error loading profile</div>;
  }

  const fullName = `${data.firstName} ${data.lastName}`;
  const getTruncatedWebsite = (url: string): string => {
    if (width <= breakpoints.phone_sm) return url.length > 15 ? url.substring(0, 15) + '...' : url;
    if (width <= 480) return url.length > 20 ? url.substring(0, 20) + '...' : url;
    if (width <= breakpoints.tablet_portrait) return url.length > 25 ? url.substring(0, 25) + '...' : url;
    if (width <= breakpoints.desktop_sm) return url.length > 32 ? url.substring(0, 32) + '...' : url;
    return url.length > 44 ? url.substring(0, 44) + '...' : url;
  };
  const displayWebsite = data.website ? getTruncatedWebsite(data.website) : '';

  const interests = settings?.contentPreferences?.interests ?? [];

  return (
    <>
      {/* 5. Place the modal at the top level */}
      {settings && (
        <InterestsModal
          isOpen={isInterestsModalOpen}
          onClose={() => setIsInterestsModalOpen(false)}
          onSuccess={refetchSettings} // This will refetch the settings data
          currentInterests={interests}
        />
      )}

      <BasicBodyProvider>
        <div className="min-h-screen w-full flex flex-col items-center px-4 py-8">
          <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 shadow-md rounded-lg p-6 bg-card text-card-foreground">
            <Avatar className="h-28 w-28 border-4 border-primary shadow-lg flex-shrink-0">
              <AvatarImage src={data.picture || '/default-avatar.png'} alt={fullName} />
              <AvatarFallback className="text-3xl">{fullName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 min-w-0">
              <div className="w-full">
                <h1 className="text-3xl font-bold tracking-tight break-words" title={fullName}>
                  {fullName}
                </h1>
                {data.headline && (<p className="text-lg text-muted-foreground break-words" title={data.headline}>{data.headline}</p>)}
                {data.location && (<p className="text-sm text-muted-foreground">from {data.location}</p>)}
                {data.website && (
                  <Link href={data.website} className="flex items-center justify-center lg:justify-start gap-2 mt-2 text-primary hover:underline hover:underline-offset-4" title={data.website}>
                    <Globe2Icon className="h-4 w-4 flex-shrink-0" />
                    <p className="truncate max-w-full">{displayWebsite}</p>
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm">
                <Link href="/social/friends" className="hover:underline">
                  <strong className="font-semibold">{data.friendsCount}</strong>
                  <span className="text-muted-foreground ml-1">Friends</span>
                </Link>
                <Link href="/social/followers" className="hover:underline">
                  <strong className="font-semibold">{data.followersCount}</strong>
                  <span className="text-muted-foreground ml-1">Followers</span>
                </Link>
                <div className="cursor-default">
                  <strong className="font-semibold">{data.followingCount}</strong>
                  <span className="text-muted-foreground ml-1">Following</span>
                </div>
              </div>

              <ProfileActions type="me" profile={data} screenWidth={width} onProfileUpdate={refetchProfile} />
            </div>
          </div>
          {data.bio && (
            <div className="w-full max-w-5xl mt-6 px-6 py-5 shadow-md rounded-lg bg-card text-card-foreground">
              <h2 className="text-xl flex items-center gap-2 font-semibold">
                <InfoIcon className="h-5 w-5" /> About
              </h2>
              <p className="mt-2 text-muted-foreground">{data.bio}</p>
            </div>
          )}
        
          {interests.length > 0 && (
            <div className="w-full max-w-5xl mt-6 px-6 py-5 shadow-md rounded-lg bg-card text-card-foreground">
              {/* 6. Make the header a flex container */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl flex items-center gap-2 font-semibold"><Heart className='h-5 w-5' /> Interests</h2>
                {/* 7. Add the Edit button to open the modal */}
                <Button variant="ghost" size="icon" onClick={() => setIsInterestsModalOpen(true)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className='mt-2 flex flex-wrap gap-2'>
                {interests.map((interest) => (
                  <span key={interest} className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">{interest}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </BasicBodyProvider>
    </>
  );
};

export default Body;