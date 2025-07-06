'use client';

import { timeFromNow } from '@/lib/date-formatter';
import { useEffect, useState } from 'react';
import {
  formatDate,
  longDateFormatMap,
  timeFormatMap
} from '@/lib/date-formatter';
import { useGetMySettings } from '@/components/hooks/settings/get-settings';
import { useAuth } from '@/components/contexts/AuthContext';

interface RelativeTimeProps {
  date: Date | string | number;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  const { state } = useAuth();
  const isAuthenticated = state.status === 'authenticated';
  
  // --- START OF FIX: Call hooks unconditionally at the top level ---
  // The useGetMySettings hook is now designed to be safe to call even when
  // not authenticated. It will simply return null for settings.
  const { settings } = useGetMySettings();
  // --- END OF FIX ---

  const [relativeTime, setRelativeTime] = useState(() => timeFromNow(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(timeFromNow(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  // Use the isAuthenticated flag to decide which format to use.
  const fullDateTime = settings && isAuthenticated
    ? formatDate(date, `${longDateFormatMap[settings.dateTimePreferences.longDateFormat]}, ${timeFormatMap[settings.dateTimePreferences.timeFormat]}`)
    : new Date(date).toLocaleString();

  return <span title={fullDateTime}>{relativeTime}</span>;
}