'use client';

import { useState, useEffect } from 'react';
import { useUserProfile } from '@/components/hooks/profile/get-user-profile';
import BasicBodyProvider from '@/components/providers/basic-body-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InfoIcon, Globe2Icon, Users } from 'lucide-react'; // Import Users icon
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProfileActions } from '../menu-bar';

const breakpoints = {
  phone_sm: 374, sm: 640, tablet_portrait: 767, md: 768, desktop_sm: 1023,
};

const Body = () => {
  const params = useParams();
  const profileID = params.id as string;
  const { data, isLoading, isError, refetch } = useUserProfile(profileID);

  const [width, setWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading || typeof width === 'undefined') {
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

  return (
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
              {data.headline && <p className="text-lg text-muted-foreground break-words" title={data.headline}>{data.headline}</p>}
              {data.location && (<p className="text-sm text-muted-foreground">From {data.location}</p>)}
              {data.website && (
                <Link href={data.website} className="flex items-center justify-center lg:justify-start gap-2 mt-2 text-primary hover:underline hover:underline-offset-4" title={data.website}>
                  <Globe2Icon className="h-4 w-4 flex-shrink-0" />
                  <p className="truncate max-w-full">{displayWebsite}</p>
                </Link>
              )}
            </div>
            
            {/* --- START: SOCIAL STATS --- */}
            <div className="flex items-center flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm">
              <div className="cursor-default">
                <strong className="font-semibold">{data.friendsCount}</strong>
                <span className="text-muted-foreground ml-1">Friends</span>
              </div>
              <div className="cursor-default">
                <strong className="font-semibold">{data.followersCount}</strong>
                <span className="text-muted-foreground ml-1">Followers</span>
              </div>
              <div className="cursor-default">
                <strong className="font-semibold">{data.followingCount}</strong>
                <span className="text-muted-foreground ml-1">Following</span>
              </div>
              {/* Conditionally render Mutual Friends only if there are any */}
              {data.mutualFriendsCount > 0 && (
                 <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1.5" />
                    <strong className="text-foreground font-semibold">{data.mutualFriendsCount}</strong>
                    <span className="ml-1">Mutual Friends</span>
                </div>
              )}
            </div>
            {/* --- END: SOCIAL STATS --- */}

            <ProfileActions type="public" profile={data} screenWidth={width} onProfileUpdate={refetch} />
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
      </div>
    </BasicBodyProvider>
  );
};

export default Body;