import { useEffect, useMemo, useState } from "react";
import { createCalendar } from "../../core/calendar.factory";
import type { CalendarDate } from "../../core/calendar.types";
import {
  buildDayCells,
  getLeadingEmptyCells,
  isSameCalendarDate,
  normalizeWeekDaysToSaturdayFirst,
  rotateWeekDays,
} from "./calendarGrid";
import {
  buildSteppedRange,
  buildSteppedRangeWithCurrent,
  buildTodayDate,
  mergeDateWithTime,
  resolveTimeParts,
} from "./calendarTime";
import type { CalendarProps } from "./Calendar.types";
import styles from "./Calendar.module.css";

type ViewMode = "days" | "months" | "years";

function joinClassNames(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

function emitChange(
  date: CalendarDate,
  isControlled: boolean,
  setInternalSelected: (date: CalendarDate | null) => void,
  onChange?: (date: CalendarDate) => void,
) {
  if (!isControlled) {
    setInternalSelected(date);
  }
  onChange?.(date);
}

export function Calendar({
  calendar = "gregorian",
  locale = "en",
  value,
  defaultValue = null,
  onChange,
  weekStartsOn = 0,
  className,
  showTime = false,
  showSeconds = false,
  timeStep = 1,
}: CalendarProps) {
  const engine = useMemo(() => createCalendar(calendar), [calendar]);
  const today = engine.today();

  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] = useState<CalendarDate | null>(
    defaultValue,
  );
  const selected = isControlled ? value : internalSelected;

  const initialView = selected ?? today;
  const [year, setYear] = useState(initialView.year);
  const [month, setMonth] = useState(initialView.month);
  const [view, setView] = useState<ViewMode>("days");

  useEffect(() => {
    if (isControlled && value) {
      setYear(value.year);
      setMonth(value.month);
    }
  }, [isControlled, value]);

  const daysInMonth = engine.getMonthDays(year, month);
  const engineStartDay = engine.getFirstDayOfMonth(year, month);
  const leadingEmpty = getLeadingEmptyCells(engineStartDay, weekStartsOn);

  const monthNames = engine.getMonthNames(locale);
  const weekDayLabels = useMemo(() => {
    const saturdayFirst = normalizeWeekDaysToSaturdayFirst(
      engine.getWeekDays(locale),
      locale,
    );
    return rotateWeekDays(saturdayFirst, weekStartsOn);
  }, [engine, locale, weekStartsOn]);

  const cells = buildDayCells(daysInMonth, leadingEmpty);

  const activeTime = resolveTimeParts(selected);

  const hourOptions = useMemo(() => buildSteppedRange(23, 1), []);
  const minuteOptions = useMemo(
    () => buildSteppedRangeWithCurrent(59, timeStep, activeTime.minute),
    [timeStep, activeTime.minute],
  );
  const secondOptions = useMemo(
    () => buildSteppedRangeWithCurrent(59, timeStep, activeTime.second),
    [timeStep, activeTime.second],
  );

  const goPrev = () => {
    if (view === "days") {
      if (month === 1) {
        setMonth(12);
        setYear((y) => y - 1);
      } else {
        setMonth((m) => m - 1);
      }
    }

    if (view === "months") setYear((y) => y - 1);
    if (view === "years") setYear((y) => y - 12);
  };

  const goNext = () => {
    if (view === "days") {
      if (month === 12) {
        setMonth(1);
        setYear((y) => y + 1);
      } else {
        setMonth((m) => m + 1);
      }
    }

    if (view === "months") setYear((y) => y + 1);
    if (view === "years") setYear((y) => y + 12);
  };

  const goPrevBig = () => {
    if (view === "days" || view === "months") {
      setYear((y) => y - 1);
    }
    if (view === "years") {
      setYear((y) => y - 12);
    }
  };

  const goNextBig = () => {
    if (view === "days" || view === "months") {
      setYear((y) => y + 1);
    }
    if (view === "years") {
      setYear((y) => y + 12);
    }
  };

  const goToday = () => {
    const t = engine.today();
    const todayDate = buildTodayDate(t, showTime, showSeconds);

    setYear(todayDate.year);
    setMonth(todayDate.month);
    setView("days");
    emitChange(todayDate, isControlled, setInternalSelected, onChange);
  };

  const handleDaySelect = (day: number) => {
    const dateParts = { year, month, day };
    const date = showTime
      ? mergeDateWithTime(
          dateParts,
          resolveTimeParts(selected),
          true,
          showSeconds,
        )
      : dateParts;

    emitChange(date, isControlled, setInternalSelected, onChange);
  };

  const handleTimeChange = (
    field: "hour" | "minute" | "second",
    rawValue: string,
  ) => {
    if (!showTime) return;

    const nextTime = { ...activeTime, [field]: Number(rawValue) };
    const dateParts = selected
      ? { year: selected.year, month: selected.month, day: selected.day }
      : { year: today.year, month: today.month, day: today.day };

    const date = mergeDateWithTime(
      dateParts,
      nextTime,
      true,
      showSeconds,
    );

    emitChange(date, isControlled, setInternalSelected, onChange);
  };

  const handleMonthSelect = (m: number) => {
    setMonth(m);
    setView("days");
  };

  const handleYearSelect = (y: number) => {
    setYear(y);
    setView("months");
  };

  const startYear = Math.floor(year / 12) * 12;
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);
  const todayLabel = calendar === "jalali" ? "برو به امروز" : "Go to Today";

  return (
    <div className={joinClassNames(styles.root, className)}>
      <div className={styles.header}>
        <button type="button" onClick={goPrevBig} className={styles.navButton}>
          ‹‹
        </button>
        <button type="button" onClick={goPrev} className={styles.navButton}>
          ‹
        </button>

        <div className={styles.headerTitle}>
          <span
            className={styles.headerMonth}
            onClick={() => setView("months")}
            onKeyDown={(e) => e.key === "Enter" && setView("months")}
            role="button"
            tabIndex={0}
          >
            {monthNames[month - 1]}
          </span>
          --
          <span
            className={styles.headerYear}
            onClick={() => setView("years")}
            onKeyDown={(e) => e.key === "Enter" && setView("years")}
            role="button"
            tabIndex={0}
          >
            {year}
          </span>
        </div>

        <button type="button" onClick={goNext} className={styles.navButton}>
          ›
        </button>
        <button type="button" onClick={goNextBig} className={styles.navButton}>
          ››
        </button>
      </div>

      {view === "days" && (
        <>
          <div className={styles.weekDays}>
            {weekDayLabels.map((label, index) => (
              <div key={`${label}-${index}`}>{label}</div>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {cells.map((day, i) => {
              if (!day) {
                return <div key={`empty-${i}`} className={styles.dayEmpty} />;
              }

              const todayFlag = isSameCalendarDate(today, year, month, day);
              const selectedFlag = isSameCalendarDate(
                selected,
                year,
                month,
                day,
              );

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleDaySelect(day)}
                  className={joinClassNames(
                    styles.dayButton,
                    todayFlag && styles.dayButtonToday,
                    selectedFlag && styles.dayButtonSelected,
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {showTime && (
            <div className={styles.timeRow}>
              <select
                className={styles.timeSelect}
                value={activeTime.hour}
                onChange={(e) => handleTimeChange("hour", e.target.value)}
                aria-label="Hour"
              >
                {hourOptions.map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className={styles.timeSeparator}>:</span>
              <select
                className={styles.timeSelect}
                value={activeTime.minute}
                onChange={(e) => handleTimeChange("minute", e.target.value)}
                aria-label="Minute"
              >
                {minuteOptions.map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </select>
              {showSeconds && (
                <>
                  <span className={styles.timeSeparator}>:</span>
                  <select
                    className={styles.timeSelect}
                    value={activeTime.second}
                    onChange={(e) =>
                      handleTimeChange("second", e.target.value)
                    }
                    aria-label="Second"
                  >
                    {secondOptions.map((s) => (
                      <option key={s} value={s}>
                        {String(s).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          )}
        </>
      )}

      {view === "months" && (
        <div className={styles.pickerGrid}>
          {monthNames.map((name, index) => {
            const monthIndex = index + 1;
            const active = monthIndex === month;

            return (
              <button
                key={name}
                type="button"
                onClick={() => handleMonthSelect(monthIndex)}
                className={joinClassNames(
                  styles.pickerButton,
                  active && styles.pickerButtonActive,
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      {view === "years" && (
        <div className={joinClassNames(styles.pickerGrid, styles.yearGrid)}>
          {years.map((y) => {
            const active = y === year;

            return (
              <button
                key={y}
                type="button"
                onClick={() => handleYearSelect(y)}
                className={joinClassNames(
                  styles.pickerButton,
                  active && styles.pickerButtonActive,
                )}
              >
                {y}
              </button>
            );
          })}
        </div>
      )}

      <button type="button" onClick={goToday} className={styles.todayButton}>
        {todayLabel}
      </button>
    </div>
  );
}
