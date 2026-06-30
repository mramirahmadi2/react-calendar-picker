// Public API — stable exports for library consumers.
//
// TODO (npm publish): point package.json "exports"."." to compiled dist entry
// and ship component CSS from the library build.

export { Calendar } from "./components/Calendar/Calendar";
export type { CalendarProps } from "./components/Calendar/Calendar.types";

export { DatePicker } from "./components/DatePicker/DatePicker";
export type { DatePickerProps } from "./components/DatePicker/DatePicker.types";

export { createCalendar } from "./core/calendar.factory";
export { GregorianCalendar } from "./core/calendars/gregorian.calendar";
export { JalaliCalendar } from "./core/calendars/jalali.calendar";

export type {
  CalendarType,
  Locale,
  CalendarDate,
  WeekStartsOn,
  CalendarEngine,
  DateRange,
} from "./core/calendar.types";

// ---------------------------------------------------------------------------
// Experimental — NOT stable API. Subject to breaking changes.
// ---------------------------------------------------------------------------
export {
  createExperimentalHijriCalendar,
  type ExperimentalCalendarType,
  type ExperimentalHijriOptions,
} from "./core/experimental/hijri.factory";
export { ExperimentalHijriCalendar } from "./core/experimental/hijri.calendar";
