import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Calendar } from "../Calendar/Calendar";
import type { CalendarDate } from "../../core/calendar.types";
import { CalendarIcon } from "./CalendarIcon";
import { formatCalendarDate } from "./formatCalendarDate";
import type { DatePickerProps } from "./DatePicker.types";
import styles from "./DatePicker.module.css";

function joinClassNames(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

function isSameCalendarDay(
  a: CalendarDate | null | undefined,
  b: CalendarDate,
): boolean {
  return (
    a !== null &&
    a !== undefined &&
    a.year === b.year &&
    a.month === b.month &&
    a.day === b.day
  );
}

export function DatePicker({
  calendar = "gregorian",
  locale = "en",
  value,
  defaultValue = null,
  onChange,
  weekStartsOn = 0,
  showTime = false,
  showSeconds = false,
  timeStep = 1,
  placeholder = "",
  disabled = false,
  readOnly = false,
  clearable = false,
  className,
  inputClassName,
  popoverClassName,
}: DatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<CalendarDate | null>(
    defaultValue,
  );
  const selected = isControlled ? value : internalValue;

  const canOpen = !disabled && !readOnly;
  const isRtl = locale === "fa";

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (event: globalThis.MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const displayValue = selected
    ? formatCalendarDate(selected, { showTime, showSeconds })
    : "";

  const openPopover = () => {
    if (canOpen) {
      setOpen(true);
    }
  };

  const handleCalendarChange = (date: CalendarDate) => {
    const dayChanged = !isSameCalendarDay(selected, date);

    if (!isControlled) {
      setInternalValue(date);
    }
    onChange?.(date);

    if (dayChanged) {
      setOpen(false);
    }
  };

  const handleClear = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (!canOpen) return;

    if (!isControlled) {
      setInternalValue(null);
    }
    onChange?.(null);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={joinClassNames(styles.root, className)}
    >
      <div className={styles.inputRow}>
        <div className={styles.inputWrapper}>
          {isRtl && (
            <button
              type="button"
              className={joinClassNames(styles.iconButton, styles.iconButtonRtl)}
              onClick={openPopover}
              disabled={!canOpen}
              tabIndex={-1}
              aria-label="Open calendar"
            >
              <CalendarIcon />
            </button>
          )}

          <input
            type="text"
            readOnly
            value={displayValue}
            placeholder={placeholder}
            disabled={disabled}
            onClick={openPopover}
            className={joinClassNames(
              styles.input,
              isRtl ? styles.inputWithIconRtl : styles.inputWithIconLtr,
              canOpen && styles.inputInteractive,
              disabled && styles.inputDisabled,
              readOnly && !disabled && styles.inputReadOnly,
              inputClassName,
            )}
            aria-haspopup="dialog"
            aria-expanded={open}
          />

          {!isRtl && (
            <button
              type="button"
              className={joinClassNames(styles.iconButton, styles.iconButtonLtr)}
              onClick={openPopover}
              disabled={!canOpen}
              tabIndex={-1}
              aria-label="Open calendar"
            >
              <CalendarIcon />
            </button>
          )}
        </div>

        {clearable && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            disabled={!canOpen || !selected}
            aria-label="Clear date"
            title="Clear"
          >
            ×
          </button>
        )}
      </div>

      {open && canOpen && (
        <div
          className={joinClassNames(styles.popover, popoverClassName)}
          role="dialog"
          aria-label="Choose date"
        >
          <Calendar
            calendar={calendar}
            locale={locale}
            value={selected}
            onChange={handleCalendarChange}
            weekStartsOn={weekStartsOn}
            showTime={showTime}
            showSeconds={showSeconds}
            timeStep={timeStep}
          />
        </div>
      )}
    </div>
  );
}
