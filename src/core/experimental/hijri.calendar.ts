/**
 * @experimental Incomplete Hijri calendar engine.
 * Not part of the stable public API — use createExperimentalHijriCalendar() only.
 *
 * Known limitations:
 * - getMonthDays() always returns 30
 * - getFirstDayOfMonth() always returns 0
 * - toGregorian() throws at runtime
 */
import type { CalendarDate, CalendarEngine } from "../calendar.types";

export class ExperimentalHijriCalendar implements CalendarEngine {
  private dayOffset: number;

  constructor(dayOffset: number = 0) {
    this.dayOffset = dayOffset;
  }

  private getHijriParts(date: Date) {
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    const parts = formatter.formatToParts(date);

    return {
      year: Number(parts.find((p) => p.type === "year")?.value),
      month: Number(parts.find((p) => p.type === "month")?.value),
      day: Number(parts.find((p) => p.type === "day")?.value),
    };
  }

  today(): CalendarDate {
    const now = new Date();

    const adjusted = new Date(now);
    adjusted.setDate(adjusted.getDate() + this.dayOffset);

    const hijri = this.getHijriParts(adjusted);

    return {
      year: hijri.year,
      month: hijri.month,
      day: hijri.day,
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
    };
  }

  fromGregorian(date: Date): CalendarDate {
    const adjusted = new Date(date);
    adjusted.setDate(adjusted.getDate() + this.dayOffset);

    const hijri = this.getHijriParts(adjusted);

    return {
      year: hijri.year,
      month: hijri.month,
      day: hijri.day,
    };
  }

  toGregorian(_date: CalendarDate): Date {
    throw new Error("Experimental Hijri: toGregorian() is not implemented yet");
  }

  getMonthDays(_year: number, _month: number): number {
    return 30;
  }

  getFirstDayOfMonth(_year: number, _month: number): number {
    return 0;
  }

  format(date: CalendarDate): string {
    return `${date.year}/${date.month}/${date.day}`;
  }

  getMonthNames(): string[] {
    return [
      "محرم",
      "صفر",
      "ربيع الأول",
      "ربيع الثاني",
      "جمادى الأولى",
      "جمادى الآخرة",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذو القعدة",
      "ذو الحجة",
    ];
  }

  getWeekDays(): string[] {
    return ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
  }
}
