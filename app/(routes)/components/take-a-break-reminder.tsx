'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/contexts/AuthContext';
import { useGetMySettings } from '@/components/hooks/settings/get-settings';
import { Button } from '@/components/ui/button';
import { Coffee, Settings, Timer, X, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const TakeABreakReminder = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { state: authState } = useAuth();
  const { settings, isLoading: isLoadingSettings } = useGetMySettings();

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const SNOOZE_DURATION_MS = 5 * 60 * 1000;

  const isEnabled = settings?.wellbeingPreferences?.isBreakReminderEnabled;
  const intervalMinutes = settings?.wellbeingPreferences?.breakReminderIntervalMinutes;

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    // Suppress on specific routes if needed (optional)
    if (
      authState.status !== 'authenticated' ||
      isLoadingSettings ||
      !isEnabled ||
      !intervalMinutes ||
      pathname === '/activity' // Optional: hide reminder on /activity
    ) {
      clearTimer();
      return;
    }

    const intervalMilliseconds = intervalMinutes * 60 * 1000;

    timerRef.current = setInterval(() => {
      setIsPopupVisible(true);
    }, intervalMilliseconds);

    return () => clearTimer();
  }, [authState.status, isLoadingSettings, isEnabled, intervalMinutes, pathname]);

  const handleDismiss = () => {
    setIsPopupVisible(false);
  };

  const handleSnooze = () => {
    setIsPopupVisible(false);
    toast.info('Reminder snoozed for 5 minutes.');

    setTimeout(() => {
      setIsPopupVisible(true);
    }, SNOOZE_DURATION_MS);
  };

  const handleGoToSettings = () => {
    setIsPopupVisible(false);
    router.push('/settings');
  };

  const handleGoToActivity = () => {
    setIsPopupVisible(false);
    router.push('/activity');
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 left-6 w-[320px] sm:w-[340px] min-h-[120px]',
        'bg-card border border-border shadow-xl rounded-xl z-50',
        'transition-all duration-300 ease-in-out',
        isPopupVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
        aria-label="Dismiss reminder"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Coffee className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Time to stretch?</h3>
            <p className="text-xs text-muted-foreground">
              A quick break can boost your focus and wellbeing.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {/* Change Settings Button */}
          <Button
            variant="secondary"
            onClick={handleGoToSettings}
            className="w-full flex items-center justify-center gap-2 text-sm"
          >
            Change Settings <Settings className="w-4 h-4" />
          </Button>

          {/* View Activity Button */}
          <Button
            variant="outline"
            onClick={handleGoToActivity}
            className="w-full flex items-center justify-center gap-2 text-sm"
          >
            View Activity <CalendarDays className="w-4 h-4" />
          </Button>

          {/* Dismiss + Snooze */}
          <div className="flex justify-between gap-2">
            <Button variant="outline" className="flex-1 text-sm" onClick={handleDismiss}>
              Dismiss
            </Button>
            <Button className="flex-1 text-sm" onClick={handleSnooze}>
              <Timer className="w-4 h-4 mr-1" />
              Snooze 5 min
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
