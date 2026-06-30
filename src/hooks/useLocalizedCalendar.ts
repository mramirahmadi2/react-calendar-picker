import { useMemo } from "react";
import useI18n from "../i18n/useI18n";
import { useLiveClock } from "./useLiveClock";
import type { CalendarType } from "../core/calendar.types";
import { localizeNumber } from "../utils/number-localizer";

function pad(n?: number) {
  return String(n ?? 0).padStart(2, "0");
}

export function useLocalizedCalendar() {
  const { languageId } = useI18n();

  const calendarType: CalendarType = useMemo(() => {
    if (languageId === "fa") return "jalali";
    // Arabic → gregorian until experimental Hijri is production-ready
    return "gregorian";
  }, [languageId]);

  const direction = useMemo(
    () => (languageId === "fa" || languageId === "ar" ? "rtl" : "ltr"),
    [languageId],
  );

  const now = useLiveClock(calendarType);

  const dateTime = useMemo(() => {
    const formatted =
      calendarType === "jalali"
        ? `${now.year}/${now.month}/${now.day}, ${pad(now.hour)}:${pad(now.minute)}`
        : `${pad(now.month)}/${pad(now.day)}/${now.year}, ${pad(now.hour)}:${pad(now.minute)}`;

    return localizeNumber(formatted, languageId);
  }, [now, calendarType, languageId]);

  return {
    now,
    dateTime,
    calendarType,
    direction,
    languageId,
  };
}
