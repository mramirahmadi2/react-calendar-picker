import type { CalendarDate, CalendarEngine } from "../calendar.types";
import { gregorianToJalali, jalaliToGregorian } from "../../utils/date-converter";

export class JalaliCalendar implements CalendarEngine {
  getMonthDays(year: number, month: number): number {
    if (month <= 6) return 31;
    if (month <= 11) return 30;

    return this.isLeap(year) ? 30 : 29;
  }

  isLeap(year: number): boolean {
    const mod = year % 33;

    return [1, 5, 9, 13, 17, 22, 26, 30].includes(mod);
  }

  getFirstDayOfMonth(year: number, month: number): number {
    const g = jalaliToGregorian(year, month, 1);

    const jsDay = new Date(g.gy, g.gm - 1, g.gd).getDay();

    const map: Record<number, number> = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 0 };

    return map[jsDay];
  }

  today(): CalendarDate {
    const d = new Date();

    const j = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());

    return {
      year: j.jy,
      month: j.jm,
      day: j.jd,
      hour: d.getHours(),
      minute: d.getMinutes(),
      second: d.getSeconds(),
    };
  }

  getMonthNames(): string[] {
    return [
      "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
      "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
    ];
  }

  getWeekDays(): string[] {
    return ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  }

  fromGregorian(date: Date): CalendarDate {
    const gy = date.getFullYear();
    const gm = date.getMonth() + 1;
    const gd = date.getDate();

    if (!Number.isFinite(gy) || !Number.isFinite(gm) || !Number.isFinite(gd)) {
      return { year: 1, month: 1, day: 1 };
    }

    const j = gregorianToJalali(gy, gm, gd);

    const isValid =
      j && Number.isFinite(j.jy) && Number.isFinite(j.jm) && Number.isFinite(j.jd);

    if (!isValid) {
      return { year: gy, month: gm, day: gd };
    }

    return { year: j.jy, month: j.jm, day: j.jd };
  }

  toGregorian(date: CalendarDate): Date {
    const g = jalaliToGregorian(date.year, date.month, date.day);

    return new Date(g.gy, g.gm - 1, g.gd);
  }

  format(date: CalendarDate): string {
    return `${date.year}/${date.month}/${date.day}`;
  }
}
