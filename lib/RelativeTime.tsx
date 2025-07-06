'use client';

import { timeFromNow } from '@/lib/date-formatter';
import { useEffect, useState } from 'react';
import {
  formatDate,
  longDateFormatMap,
  timeFormatMap
} from '@/lib/date-formatter';
import { useGetMySettings } from '@/components/hooks/settings/get-settings';
import { useAuth } from '@/components/contexts/AuthContext'; // --- FIX: Import useAuth ---

interface RelativeTimeProps {
  date: Date | string | number;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  // --- START OF FIX: Make the component auth-aware ---
  const { state } = useAuth();
  const isAuthenticated = state.status === 'authenticated';
  
  // Conditionally call the hook. If not authenticated, settings will be null.
  const { settings } = isAuthenticated ? useGetMySettings() : { settings: null };
  // --- END OF FIX ---

  const [relativeTime, setRelativeTime] = useState(() => timeFromNow(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(timeFromNow(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  // --- START OF FIX: Add a fallback for unauthenticated users ---
  const fullDateTime = settings && isAuthenticated
    ? formatDate(date, `${longDateFormatMap[settings.dateTimePreferences.longDateFormat]}, ${timeFormatMap[settings.dateTimePreferences.timeFormat]}`)
    : new Date(date).toLocaleString(); // Use a standard, non-settings-based format for guests
  // --- END OF FIX ---

  return <span title={fullDateTime}>{relativeTime}</span>;
}