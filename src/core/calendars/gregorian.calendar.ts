import type { CalendarDate, CalendarEngine, Locale } from "../calendar.types";

export class GregorianCalendar implements CalendarEngine {
  getMonthDays(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  getFirstDayOfMonth(year: number, month: number): number {
    const jsDay = new Date(year, month - 1, 1).getDay();
    // 0 Sun 1 Mon 2 Tue 3 Wed 4 Thu 5 Fri 6 Sat → Saturday-first grid
    const map: Record<number, number> = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 0 };

    return map[jsDay];
  }

  getMonthNames(locale: Locale = "en"): string[] {
    if (locale === "fa") {
      return [
        "ژانویه", "فوریه", "مارس", "آوریل",
        "مه", "ژوئن", "جولای", "آگوست",
        "سپتامبر", "اکتبر", "نوامبر", "دسامبر",
      ];
    }

    return [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December",
    ];
  }

  getWeekDays(locale: Locale = "en"): string[] {
    if (locale === "fa") {
      return ["ش", "ی", "د", "س", "چ", "پ", "ج"];
    }

    return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  }

  today(): CalendarDate {
    const d = new Date();

    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes(),
      second: d.getSeconds(),
    };
  }

  fromGregorian(date: Date): CalendarDate {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  toGregorian(date: CalendarDate): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  format(date: CalendarDate): string {
    return `${date.year}-${date.month}-${date.day}`;
  }
}
