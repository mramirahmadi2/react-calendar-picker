import { GregorianCalendar } from "./calendars/gregorian.calendar";
import { JalaliCalendar } from "./calendars/jalali.calendar";

import type { CalendarEngine, CalendarType } from "./calendar.types";

export function createCalendar(type: CalendarType): CalendarEngine {
  switch (type) {
    case "jalali":
      return new JalaliCalendar();

    case "gregorian":
    default:
      return new GregorianCalendar();
  }
}
