import { ExperimentalHijriCalendar } from "./hijri.calendar";

import type { CalendarEngine } from "../calendar.types";

export type ExperimentalCalendarType = "hijri";

export interface ExperimentalHijriOptions {
  dayOffset?: number;
}

/**
 * @experimental Creates an incomplete Hijri calendar engine.
 * Do not use in production UI or the main Calendar component.
 */
export function createExperimentalHijriCalendar(
  options?: ExperimentalHijriOptions,
): CalendarEngine {
  return new ExperimentalHijriCalendar(options?.dayOffset ?? 0);
}
