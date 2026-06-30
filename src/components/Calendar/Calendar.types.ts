import type {
  CalendarDate,
  CalendarType,
  Locale,
  WeekStartsOn,
} from "../../core/calendar.types";

export interface CalendarProps {
  calendar?: CalendarType;
  locale?: Locale;
  value?: CalendarDate | null;
  defaultValue?: CalendarDate | null;
  onChange?: (date: CalendarDate) => void;
  weekStartsOn?: WeekStartsOn;
  className?: string;

  showTime?: boolean;
  showSeconds?: boolean;
  timeStep?: number;
}
