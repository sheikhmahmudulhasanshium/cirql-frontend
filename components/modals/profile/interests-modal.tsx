'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { updateMySettings } from '@/components/hooks/settings/patch-settings';
import { toast } from 'sonner';
import clsx from 'clsx';
import { InterestsList } from '@/lib/menu';
import { Loader2 } from 'lucide-react';

const MIN_INTERESTS = 5;
const MAX_INTERESTS = 10;

interface InterestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // To refetch settings data on the profile page
  currentInterests: string[];
}

export const InterestsModal = ({ isOpen, onClose, onSuccess, currentInterests }: InterestsModalProps) => {
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set(currentInterests));
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if the modal is reopened with different initial props
  useEffect(() => {
    setSelectedInterests(new Set(currentInterests));
  }, [currentInterests, isOpen]);

  const handleSelectInterest = (interestName: string) => {
    setSelectedInterests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(interestName)) {
        newSet.delete(interestName);
      } else {
        if (newSet.size < MAX_INTERESTS) {
          newSet.add(interestName);
        } else {
          toast.warning('Maximum interests reached', {
            description: `You can select up to ${MAX_INTERESTS} interests.`,
          });
        }
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (selectedInterests.size < MIN_INTERESTS) {
      toast.error('Not enough interests selected', {
        description: `Please select at least ${MIN_INTERESTS} interests.`,
      });
      return;
    }
    
    setIsSaving(true);
    try {
      await updateMySettings({
        contentPreferences: { interests: Array.from(selectedInterests) },
      });
      toast.success('Your interests have been updated!');
      onSuccess(); // Trigger data refetch on the profile page
      onClose();   // Close the modal
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      toast.error('Failed to save interests', { description: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const isValidSelectionCount = selectedInterests.size >= MIN_INTERESTS && selectedInterests.size <= MAX_INTERESTS;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Your Interests</DialogTitle>
          <DialogDescription>
            Select {MIN_INTERESTS}-{MAX_INTERESTS} topics you love to get better recommendations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {InterestsList.map((interest) => {
              const isSelected = selectedInterests.has(interest.name);
              return (
                <Card
                  key={interest.name}
                  onClick={() => handleSelectInterest(interest.name)}
                  className={clsx(
                    'cursor-pointer transition-all duration-200 transform hover:scale-105',
                    'flex flex-col items-center justify-center text-center p-3 aspect-square',
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                      : 'bg-card hover:bg-muted/50',
                  )}
                >
                  <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                    <interest.icon className="h-7 w-7" />
                    <span className="text-xs font-medium">{interest.name}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between w-full">
          <div className={clsx("text-sm font-medium", { "text-destructive": !isValidSelectionCount })}>
            {selectedInterests.size} / {MAX_INTERESTS} selected
          </div>
          <Button onClick={handleSave} disabled={isSaving || !isValidSelectionCount}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};