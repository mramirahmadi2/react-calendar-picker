/** Stable calendar systems supported by the public API. */
export type CalendarType = "gregorian" | "jalali";

export type Locale = "fa" | "en";

/**
 * First column of the calendar grid.
 * 0 = Saturday, 1 = Sunday, … 6 = Friday (matches existing engine layout).
 */
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CalendarDate {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
}

export interface DateRange {
  start: CalendarDate | null;
  end: CalendarDate | null;
}

/** Canonical calendar engine interface for all stable calendar implementations. */
export interface CalendarEngine {
  today(): CalendarDate;

  getMonthDays(year: number, month: number): number;

  getFirstDayOfMonth(year: number, month: number): number;

  getMonthNames(locale?: Locale): string[];

  getWeekDays(locale?: Locale): string[];

  fromGregorian(date: Date): CalendarDate;

  toGregorian(date: CalendarDate): Date;

  format(date: CalendarDate): string;
}
