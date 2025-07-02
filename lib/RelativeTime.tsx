'use client';

import { timeFromNow } from '@/lib/date-formatter';
import { useEffect, useState } from 'react';
import {
  formatDate,
  longDateFormatMap,
  timeFormatMap
} from '@/lib/date-formatter';
import { useGetMySettings } from '@/components/hooks/settings/get-settings';

interface RelativeTimeProps {
  date: Date | string | number;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  const { settings } = useGetMySettings();
  const [relativeTime, setRelativeTime] = useState(() => timeFromNow(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(timeFromNow(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  const fullDateTime = settings 
    ? formatDate(date, `${longDateFormatMap[settings.dateTimePreferences.longDateFormat]}, ${timeFormatMap[settings.dateTimePreferences.timeFormat]}`)
    : new Date(date).toLocaleString();

  return <span title={fullDateTime}>{relativeTime}</span>;
}