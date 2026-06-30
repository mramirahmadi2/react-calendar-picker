import { useEffect, useState } from "react";
import { createCalendar } from "../core/calendar.factory";
import type { CalendarDate, CalendarType } from "../core/calendar.types";

export function useLiveClock(type: CalendarType): CalendarDate {
  const [date, setDate] = useState(() => createCalendar(type).today());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(createCalendar(type).today());
    }, 1000);

    return () => clearInterval(timer);
  }, [type]);

  return date;
}
