import type {
  CalendarDate,
  CalendarType,
  Locale,
  WeekStartsOn,
} from "../../core/calendar.types";

export interface DatePickerProps {
  calendar?: CalendarType;
  locale?: Locale;
  value?: CalendarDate | null;
  defaultValue?: CalendarDate | null;
  onChange?: (date: CalendarDate | null) => void;
  weekStartsOn?: WeekStartsOn;

  showTime?: boolean;
  showSeconds?: boolean;
  timeStep?: number;

  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;

  className?: string;
  inputClassName?: string;
  popoverClassName?: string;
}
