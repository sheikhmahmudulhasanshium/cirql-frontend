import {
  format,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';

export enum ShortDateFormatKey {
  MDY_LongMonth = 'MDY_LongMonth',
  DMY_Ordinal = 'DMY_Ordinal',
  DMY_Slash = 'DMY_Slash',
  MDY_Slash = 'MDY_Slash',
  DMY_Dash = 'DMY_Dash',
  MDY_Dash = 'MDY_Dash',
  ISO = 'ISO',
}

export enum LongDateFormatKey {
  Full = 'Full',
  Medium = 'Medium',
}

export enum TimeFormatKey {
  TwelveHour = 'TwelveHour',
  TwelveHourWithSeconds = 'TwelveHourWithSeconds',
  TwentyFourHour = 'TwentyFourHour',
  TwentyFourHourWithSeconds = 'TwentyFourHourWithSeconds',
}

export const shortDateFormatMap: Record<string, string> = {
  [ShortDateFormatKey.MDY_LongMonth]: 'MMM d, yyyy',
  [ShortDateFormatKey.DMY_Ordinal]: 'do MMMM yyyy',
  [ShortDateFormatKey.DMY_Slash]: 'dd/MM/yyyy',
  [ShortDateFormatKey.MDY_Slash]: 'MM/dd/yyyy',
  [ShortDateFormatKey.DMY_Dash]: 'dd-MM-yyyy',
  [ShortDateFormatKey.MDY_Dash]: 'MM-dd-yyyy',
  [ShortDateFormatKey.ISO]: 'yyyy-MM-dd',
};

export const longDateFormatMap: Record<string, string> = {
  [LongDateFormatKey.Full]: 'eeee, MMMM d, yyyy',
  [LongDateFormatKey.Medium]: 'E, MMM d, yyyy',
};

export const timeFormatMap: Record<string, string> = {
  [TimeFormatKey.TwelveHour]: 'hh:mm a',
  [TimeFormatKey.TwelveHourWithSeconds]: 'hh:mm:ss a',
  [TimeFormatKey.TwentyFourHour]: 'HH:mm',
  [TimeFormatKey.TwentyFourHourWithSeconds]: 'HH:mm:ss',
};

export const shortDateFormatLabels: Record<string, string> = {
  [ShortDateFormatKey.MDY_LongMonth]: 'Month Day, Year (Apr 1, 2025)',
  [ShortDateFormatKey.DMY_Ordinal]: 'Day Month Year (1st April 2025)',
  [ShortDateFormatKey.DMY_Slash]: 'DD/MM/YYYY (01/04/2025)',
  [ShortDateFormatKey.MDY_Slash]: 'MM/DD/YYYY (04/01/2025)',
  [ShortDateFormatKey.DMY_Dash]: 'DD-MM-YYYY (01-04-2025)',
  [ShortDateFormatKey.MDY_Dash]: 'MM-DD-YYYY (04-01-2025)',
  [ShortDateFormatKey.ISO]: 'YYYY-MM-DD (2025-04-01)',
};

export const longDateFormatLabels: Record<string, string> = {
  [LongDateFormatKey.Full]: 'Full (Tuesday, April 1, 2025)',
  [LongDateFormatKey.Medium]: 'Medium (Tue, Apr 1, 2025)',
};

export const timeFormatLabels: Record<string, string> = {
  [TimeFormatKey.TwelveHour]: '12-Hour (01:30 PM)',
  [TimeFormatKey.TwelveHourWithSeconds]: '12-Hour with Seconds (01:30:00 PM)',
  [TimeFormatKey.TwentyFourHour]: '24-Hour (13:30)',
  [TimeFormatKey.TwentyFourHourWithSeconds]: '24-Hour with Seconds (13:30:00)',
};

export function formatDate(
  date: Date | string | number,
  formatString: string,
): string {
  try {
    return format(new Date(date), formatString);
  } catch {
    console.error('Invalid date or format provided to formatDate:', { date, formatString });
    return 'Invalid Date';
  }
}

export function timeFromNow(dateInput: Date | string | number): string {
  try {
    const date = new Date(dateInput);
    const now = new Date();
    const seconds = differenceInSeconds(now, date);

    if (seconds < 0) {
      const futureSeconds = Math.abs(seconds);
      const futureMinutes = Math.round(futureSeconds / 60);
      const futureHours = Math.round(futureMinutes / 60);
      const futureDays = Math.round(futureHours / 24);

      if (futureSeconds < 60) return `In a few seconds`;
      if (futureMinutes < 60) return `In ${futureMinutes} minute${futureMinutes > 1 ? 's' : ''}`;
      if (futureHours < 24) return `In ${futureHours} hour${futureHours > 1 ? 's' : ''}`;
      return `In ${futureDays} day${futureDays > 1 ? 's' : ''}`;
    }

    if (seconds < 10) return 'Just Now';
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = differenceInMinutes(now, date);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = differenceInHours(now, date);
    if (hours < 24) return `${hours}h ago`;

    const days = differenceInDays(now, date);
    if (days < 31) return `${days}d ago`;

    const months = differenceInMonths(now, date);
    if (months < 12) return `${months}mo ago`;

    const years = differenceInYears(now, date);
    return `${years}y ago`;
  } catch {
    console.error('Invalid date provided to timeFromNow:', dateInput);
    return 'Invalid Date';
  }
}