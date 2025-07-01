// app/(routes)/components/take-a-break-reminder.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from '@/components/contexts/AuthContext';
import { useGetMySettings } from '@/components/hooks/settings/get-settings';
import { Button } from '@/components/ui/button';
import { Coffee, Settings, Timer, X } from 'lucide-react'; // Import Settings icon
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const TakeABreakReminder = () => {
  const router = useRouter(); // Initialize router
  const { state: authState } = useAuth();
  const { settings, isLoading: isLoadingSettings } = useGetMySettings();
  
  // --- FIX: Re-add the missing state and ref definitions ---
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const SNOOZE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
  // --- END FIX ---

  // Extract the specific settings we care about to prevent unnecessary re-renders.
  const isEnabled = settings?.wellbeingPreferences?.isBreakReminderEnabled;
  const intervalMinutes = settings?.wellbeingPreferences?.breakReminderIntervalMinutes;

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    if (authState.status !== 'authenticated' || isLoadingSettings || !isEnabled || !intervalMinutes) {
      clearTimer();
      return;
    }

    const intervalMilliseconds = intervalMinutes * 60 * 1000;

    timerRef.current = setInterval(() => {
      setIsPopupVisible(true);
    }, intervalMilliseconds);
    
    return () => {
      clearTimer();
    };

  }, [authState.status, isLoadingSettings, isEnabled, intervalMinutes]);

  // --- FIX: Re-add the missing handler function definitions ---
  const handleDismiss = () => {
    setIsPopupVisible(false);
  };
  
  const handleSnooze = () => {
    setIsPopupVisible(false);
    toast.info("Reminder snoozed for 5 minutes.");

    setTimeout(() => {
      setIsPopupVisible(true);
    }, SNOOZE_DURATION_MS);
  };
  // --- END FIX ---

  const handleGoToSettings = () => {
    setIsPopupVisible(false); // Hide the popup before navigating
    router.push('/settings');
  };
  
  return (
    <div
      className={cn(
        "fixed bottom-5 left-5 w-[350px] max-w-[90vw] bg-background border rounded-lg shadow-lg p-4 z-50 transition-all duration-300 ease-in-out",
        isPopupVisible // This variable is now defined
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-6 w-6"
        onClick={handleDismiss} // This function is now defined
        aria-label="Dismiss reminder"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
            <Coffee className="h-6 w-6 text-primary" />
        </div>
        <div>
            <h3 className="font-semibold text-card-foreground">Time to stretch?</h3>
            <p className="text-sm text-muted-foreground">A short break can help you stay refreshed.</p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        {/* Left-aligned Settings link */}
        <Button 
          variant="link" 
          className="p-0 h-auto text-muted-foreground hover:text-primary"
          onClick={handleGoToSettings}
        >
          <Settings className="mr-1 h-4 w-4" />
          Settings
        </Button>

        {/* Right-aligned action buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDismiss}> {/* This function is now defined */}
            Dismiss
          </Button>
          <Button onClick={handleSnooze}> {/* This function is now defined */}
            <Timer className="mr-2 h-4 w-4" />
            Snooze 5 min
          </Button>
        </div>
      </div>
    </div>
  );
};