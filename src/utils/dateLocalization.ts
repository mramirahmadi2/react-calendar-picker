import { createCalendar } from "../core/calendar.factory";
import { createExperimentalHijriCalendar } from "../core/experimental/hijri.factory";

import type { CalendarDate, CalendarEngine } from "../core/calendar.types";

const isIsoDateString = (value: unknown): value is string => {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}([T\s].*)?$/.test(value);
};

const isCalendarDateValid = (date: CalendarDate): boolean => {
  return (
    Number.isFinite(date.year) &&
    Number.isFinite(date.month) &&
    Number.isFinite(date.day)
  );
};

function getEngineForLanguage(languageId: string): CalendarEngine {
  if (languageId === "fa") {
    return createCalendar("jalali");
  }

  if (languageId === "ar") {
    return createExperimentalHijriCalendar();
  }

  return createCalendar("gregorian");
}

function formatConvertedDate(date: Date, converted: CalendarDate): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${converted.year}/${String(converted.month).padStart(2, "0")}/${String(converted.day).padStart(2, "0")} ${hh}:${mm}:${ss}`;
}

function formatGregorianFallback(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${hh}:${mm}:${ss}`;
}

export const localizeDateValue = (value: unknown, languageId: string): unknown => {
  if (!isIsoDateString(value)) return value;

  if (languageId === "en" || !languageId) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const engine = getEngineForLanguage(languageId);
  const converted = engine.fromGregorian(date);

  if (isCalendarDateValid(converted)) {
    return formatConvertedDate(date, converted);
  }

  return formatGregorianFallback(date);
};

const isDateKey = (key: string): boolean =>
  /date|time|createdAt|updatedAt|startAt|endAt/i.test(key);

export const deepLocalizeDates = (input: unknown, languageId: string): unknown => {
  if (Array.isArray(input)) {
    return input.map((item) => deepLocalizeDates(item, languageId));
  }

  if (input !== null && typeof input === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input)) {
      if (isDateKey(key) || isIsoDateString(value)) {
        result[key] = localizeDateValue(value, languageId);
      } else {
        result[key] = deepLocalizeDates(value, languageId);
      }
    }

    return result;
  }

  return input;
};
