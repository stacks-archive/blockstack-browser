import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export function todaysIsoDate() {
  return new Date().toISOString().split('T')[0];
}

// Convert ISO date to locale date taking into account user timezone
export function isoDateToLocalDate(isoDate: string): string {
  return dayjs.tz(isoDate).format('YYYY-MM-DD');
}

// txDate is of the form YYYY-MM-DD
export function displayDate(txDate: string): string {
  const date = dayjs(txDate);
  if (date.isToday()) return 'Today';
  if (date.isYesterday()) return 'Yesterday';
  if (dayjs().isSame(date, 'year')) {
    return date.format('MMM Do');
  }
  return date.format('MMM Do, YYYY');
}
