'use client';

import { useGetMySettings } from '@/components/hooks/settings/get-settings';
import { Skeleton } from '@/components/ui/skeleton';
import {
  formatDate,
  shortDateFormatMap,
  longDateFormatMap,
  timeFormatMap,
} from '@/lib/date-formatter';

type FormatType = 'short' | 'long' | 'time' | 'full';

interface FormattedDateProps {
  date: Date | string | number;
  formatType?: FormatType;
}

export function FormattedDate({
  date,
  formatType = 'short',
}: FormattedDateProps) {
  const { settings, isLoading } = useGetMySettings();

  if (isLoading || !settings) {
    return <Skeleton className="h-4 w-24 inline-block" />;
  }

  const { shortDateFormat, longDateFormat, timeFormat } =
    settings.dateTimePreferences;

  let formatString = '';

  switch (formatType) {
    case 'short':
      formatString = shortDateFormatMap[shortDateFormat];
      break;
    case 'long':
      formatString = longDateFormatMap[longDateFormat];
      break;
    case 'time':
      formatString = timeFormatMap[timeFormat];
      break;
    case 'full':
      formatString = `${longDateFormatMap[longDateFormat]}, ${timeFormatMap[timeFormat]}`;
      break;
    default:
      formatString = shortDateFormatMap[shortDateFormat];
  }

  return (
    <time dateTime={new Date(date).toISOString()}>
      {formatDate(date, formatString)}
    </time>
  );
}