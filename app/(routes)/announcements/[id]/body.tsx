'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Hooks
import useAnnouncementById from '@/components/hooks/announcements/get-announcement-by-id';

// Components
import BasicPageProvider from '@/components/providers/basic-page-provider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'; // (Optional) For a better loading state
import AnnouncementCard from '../../components/announcement-card';
import Header from '../../components/header-sign-out';
import Footer from '../../components/footer';

// A more descriptive name for the page component
const AnnouncementDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const announcementId = params.id as string;

  const { announcement, isLoading, error } = useAnnouncementById(announcementId);

  // A more realistic implementation for a delete handler on a details page.
  // After deleting, we should navigate the user away, e.g., back to the list.
  const handleDeleteSuccess = () => {
    console.log('Announcement deleted. Navigating back to all announcements.');
    router.push('/announcements'); // Assuming '/announcements' is your list page
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-10 w-48" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-destructive">
          <h2 className="text-xl font-semibold">Failed to load announcement</h2>
          <p>{error.message}</p>
        </div>
      );
    }

    if (!announcement) {
      return (
        <div className="text-center text-muted-foreground">
          <h2 className="text-xl font-semibold">Announcement Not Found</h2>
          <p>The announcement you are looking for does not exist or may have been removed.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <AnnouncementCard
          key={announcement._id}
          announcement={announcement}
          onDeleteSuccess={handleDeleteSuccess}
        />
        {/* Use Next.js Link for client-side navigation, styled as a button */}
        <Link href="/announcements" passHref>
          <Button variant="outline" className="self-start">
            ← See All Announcements
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">
          Announcement Details
        </h1>
        {renderContent()}
      </main>
    </BasicPageProvider>
  );
};

export default AnnouncementDetailsPage;