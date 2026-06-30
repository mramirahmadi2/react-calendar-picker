import type { CalendarDate, Locale, WeekStartsOn } from "../../core/calendar.types";

/**
 * Engine weekday labels are Saturday-first for `fa` / Jalali,
 * but Sunday-first for Gregorian `en`. Normalize to Saturday-first
 * (index 0 = Saturday) to match `getFirstDayOfMonth()` grid indices.
 */
export function normalizeWeekDaysToSaturdayFirst(
  weekDays: string[],
  locale: Locale,
): string[] {
  if (locale === "en") {
    const saturday = weekDays[6];
    return [saturday, ...weekDays.slice(0, 6)];
  }

  return weekDays;
}

/** Rotate Saturday-first labels so column 0 matches `weekStartsOn`. */
export function rotateWeekDays(
  saturdayFirstLabels: string[],
  weekStartsOn: WeekStartsOn,
): string[] {
  return [
    ...saturdayFirstLabels.slice(weekStartsOn),
    ...saturdayFirstLabels.slice(0, weekStartsOn),
  ];
}

/**
 * Leading empty cells before day 1, given engine offset (Saturday-first grid)
 * and the desired first column (`weekStartsOn`).
 */
export function getLeadingEmptyCells(
  engineStartDay: number,
  weekStartsOn: WeekStartsOn,
): number {
  return (engineStartDay - weekStartsOn + 7) % 7;
}

export function buildDayCells(
  daysInMonth: number,
  leadingEmpty: number,
): (number | null)[] {
  const cells: (number | null)[] = [];

  for (let i = 0; i < leadingEmpty; i++) {
    cells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return cells;
}

export function isSameCalendarDate(
  a: CalendarDate | null | undefined,
  year: number,
  month: number,
  day: number,
): boolean {
  return (
    a !== null &&
    a !== undefined &&
    a.year === year &&
    a.month === month &&
    a.day === day
  );
}
