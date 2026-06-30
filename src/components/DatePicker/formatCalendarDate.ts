import type { CalendarDate } from "../../core/calendar.types";

export interface FormatCalendarDateOptions {
  showTime?: boolean;
  showSeconds?: boolean;
}

/** Display format: YYYY/MM/DD, optionally with local time fields from CalendarDate. */
export function formatCalendarDate(
  date: CalendarDate,
  options?: FormatCalendarDateOptions,
): string {
  const year = String(date.year).padStart(4, "0");
  const month = String(date.month).padStart(2, "0");
  const day = String(date.day).padStart(2, "0");
  const base = `${year}/${month}/${day}`;

  if (!options?.showTime) {
    return base;
  }

  const hour = String(date.hour ?? 0).padStart(2, "0");
  const minute = String(date.minute ?? 0).padStart(2, "0");

  if (options.showSeconds) {
    const second = String(date.second ?? 0).padStart(2, "0");
    return `${base} ${hour}:${minute}:${second}`;
  }

  return `${base} ${hour}:${minute}`;
}
