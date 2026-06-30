import type { CalendarDate } from "../../core/calendar.types";

/** Current local wall-clock time (not converted across calendar systems). */
export function getLocalTimeParts(): {
  hour: number;
  minute: number;
  second: number;
} {
  const now = new Date();
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  };
}

export function hasTimeParts(date: CalendarDate | null | undefined): boolean {
  return date?.hour !== undefined && date?.minute !== undefined;
}

/**
 * When no time is set yet, default to current local time.
 * Time is stored as-is on CalendarDate and is not calendar-converted.
 */
export function resolveTimeParts(
  date: CalendarDate | null | undefined,
): { hour: number; minute: number; second: number } {
  if (hasTimeParts(date)) {
    return {
      hour: date!.hour!,
      minute: date!.minute!,
      second: date!.second ?? 0,
    };
  }
  return getLocalTimeParts();
}

export function buildSteppedRange(max: number, step: number): number[] {
  const safeStep = Math.max(1, step);
  const values: number[] = [];
  for (let i = 0; i <= max; i += safeStep) {
    values.push(i);
  }
  return values;
}

/** Ensures the current value is present when step does not align (e.g. minute 07, step 5). */
export function buildSteppedRangeWithCurrent(
  max: number,
  step: number,
  current: number,
): number[] {
  const values = buildSteppedRange(max, step);
  if (!values.includes(current)) {
    values.push(current);
    values.sort((a, b) => a - b);
  }
  return values;
}

export function mergeDateWithTime(
  dateParts: Pick<CalendarDate, "year" | "month" | "day">,
  time: { hour: number; minute: number; second?: number },
  showTime: boolean,
  showSeconds: boolean,
): CalendarDate {
  if (!showTime) {
    return { ...dateParts };
  }

  const result: CalendarDate = {
    ...dateParts,
    hour: time.hour,
    minute: time.minute,
  };

  if (showSeconds) {
    result.second = time.second ?? 0;
  }

  return result;
}

export function buildTodayDate(
  today: CalendarDate,
  showTime: boolean,
  showSeconds: boolean,
): CalendarDate {
  if (!showTime) {
    return { year: today.year, month: today.month, day: today.day };
  }

  return mergeDateWithTime(
    { year: today.year, month: today.month, day: today.day },
    {
      hour: today.hour ?? getLocalTimeParts().hour,
      minute: today.minute ?? getLocalTimeParts().minute,
      second: today.second ?? getLocalTimeParts().second,
    },
    true,
    showSeconds,
  );
}
