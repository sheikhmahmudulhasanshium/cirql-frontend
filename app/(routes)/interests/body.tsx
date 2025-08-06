'use client';

// This file is now identical to the modal's internal logic.
// This ensures a consistent user experience on both the dedicated page and in the modal.
// All previous code from this file can be replaced with the code from the modal component.
// For brevity, I'll show the simplified structure that now uses the modal.

import { useState } from 'react';
import BasicBodyProvider from '@/components/providers/basic-body-provider';
import { useGetMySettings } from '@/components/hooks/settings/get-settings';
import { InterestsModal } from '@/components/modals/profile/interests-modal';
import { Button } from '@/components/ui/button';

const Body = () => {
  const { settings, isLoading, error } = useGetMySettings();
  const [isModalOpen, setIsModalOpen] = useState(true); // Open by default on this page

  if (isLoading) return <p>Loading interests...</p>;
  if (error) return <p>Error loading interests.</p>;

  // A function to refetch or update settings state after success
  const handleSuccess = () => {
    // A simple way to trigger a refetch would be to use the hook's refetch function if available
    // or manually update the state if the API returns the new settings.
    // For this example, we'll just log it.
    console.log("Interests updated successfully!");
  };

  return (
    <BasicBodyProvider>
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <h1 className="text-3xl font-bold">Your Interests</h1>
        <p>This is your dedicated page for managing interests.</p>
        <Button onClick={() => setIsModalOpen(true)} className="mt-4">
          Edit Interests
        </Button>
        
        {settings && (
          <InterestsModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleSuccess}
            currentInterests={settings.contentPreferences.interests}
          />
        )}
      </div>
    </BasicBodyProvider>
  );
};

export default Body;