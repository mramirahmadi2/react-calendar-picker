import { useEffect, useState, type ReactNode } from "react";
import { Calendar } from "./components/Calendar/Calendar";
import { DatePicker } from "./components/DatePicker/DatePicker";
import { formatCalendarDate } from "./components/DatePicker/formatCalendarDate";
import type { CalendarDate, WeekStartsOn } from "./core/calendar.types";
import "./App.css";

type Theme = "light" | "dark";

function formatSelected(date: CalendarDate | null, showTime = false): string {
  if (!date) return "—";
  return formatCalendarDate(date, { showTime, showSeconds: false });
}

interface DemoCardProps {
  title: string;
  badge: string;
  selected: string;
  children: ReactNode;
  className?: string;
}

function DemoCard({ title, badge, selected, children, className }: DemoCardProps) {
  return (
    <article className={className ? `demoCard ${className}` : "demoCard"}>
      <header className="demoCardHeader">
        <h3>{title}</h3>
        <span className="demoBadge">{badge}</span>
      </header>
      {children}
      <p className="demoSelected">Selected: {selected}</p>
    </article>
  );
}

function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const [weekStartsOn, setWeekStartsOn] = useState<WeekStartsOn>(0);

  const [gregCal, setGregCal] = useState<CalendarDate | null>(null);
  const [jalaliCal, setJalaliCal] = useState<CalendarDate | null>(null);
  const [gregCalTime, setGregCalTime] = useState<CalendarDate | null>(null);
  const [jalaliCalTime, setJalaliCalTime] = useState<CalendarDate | null>(null);

  const [gregPicker, setGregPicker] = useState<CalendarDate | null>(null);
  const [jalaliPicker, setJalaliPicker] = useState<CalendarDate | null>(null);
  const [gregPickerTime, setGregPickerTime] = useState<CalendarDate | null>(null);
  const [jalaliPickerTime, setJalaliPickerTime] = useState<CalendarDate | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="demo">
      <header className="demoHero">
        <h1>React Calendar Picker</h1>
        <p className="demoSubtitle">
          Lightweight Gregorian &amp; Jalali calendar components for React — no UI
          library required.
        </p>
      </header>

      <div className="demoToolbar">
        <div className="demoToolbarGroup">
          <span className="demoToolbarLabel">Theme</span>
          <button
            type="button"
            className={theme === "light" ? "demoBtn demoBtnActive" : "demoBtn"}
            onClick={() => setTheme("light")}
          >
            Light
          </button>
          <button
            type="button"
            className={theme === "dark" ? "demoBtn demoBtnActive" : "demoBtn"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
        </div>

        <div className="demoToolbarGroup">
          <span className="demoToolbarLabel">Week starts on</span>
          {(
            [
              { label: "Sat", value: 0 },
              { label: "Sun", value: 1 },
              { label: "Mon", value: 2 },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={
                weekStartsOn === opt.value ? "demoBtn demoBtnActive" : "demoBtn"
              }
              onClick={() => setWeekStartsOn(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <section className="demoSection">
        <h2 className="demoGroupTitle">Calendar</h2>
        <div className="demoGrid">
          <DemoCard
            title="Gregorian"
            badge="date only"
            selected={formatSelected(gregCal)}
          >
            <Calendar
              calendar="gregorian"
              locale="en"
              value={gregCal}
              onChange={setGregCal}
              weekStartsOn={weekStartsOn}
            />
          </DemoCard>

          <DemoCard
            title="Jalali"
            badge="date only"
            selected={formatSelected(jalaliCal)}
          >
            <Calendar
              calendar="jalali"
              locale="fa"
              value={jalaliCal}
              onChange={setJalaliCal}
              weekStartsOn={weekStartsOn}
            />
          </DemoCard>

          <DemoCard
            title="Gregorian"
            badge="with time"
            selected={formatSelected(gregCalTime, true)}
          >
            <Calendar
              calendar="gregorian"
              locale="en"
              value={gregCalTime}
              onChange={setGregCalTime}
              weekStartsOn={weekStartsOn}
              showTime
            />
          </DemoCard>

          <DemoCard
            title="Jalali"
            badge="with time"
            selected={formatSelected(jalaliCalTime, true)}
          >
            <Calendar
              calendar="jalali"
              locale="fa"
              value={jalaliCalTime}
              onChange={setJalaliCalTime}
              weekStartsOn={weekStartsOn}
              showTime
            />
          </DemoCard>
        </div>
      </section>

      <section className="demoSection">
        <h2 className="demoGroupTitle">DatePicker</h2>
        <div className="demoGrid">
          <DemoCard
            title="Gregorian"
            badge="date only"
            selected={formatSelected(gregPicker)}
          >
            <DatePicker
              calendar="gregorian"
              locale="en"
              value={gregPicker}
              onChange={setGregPicker}
              weekStartsOn={weekStartsOn}
              placeholder="YYYY/MM/DD"
            />
          </DemoCard>

          <DemoCard
            title="Jalali"
            badge="date only"
            selected={formatSelected(jalaliPicker)}
          >
            <DatePicker
              calendar="jalali"
              locale="fa"
              value={jalaliPicker}
              onChange={setJalaliPicker}
              weekStartsOn={weekStartsOn}
              placeholder="YYYY/MM/DD"
            />
          </DemoCard>

          <DemoCard
            title="Gregorian"
            badge="with time"
            selected={formatSelected(gregPickerTime, true)}
          >
            <DatePicker
              calendar="gregorian"
              locale="en"
              value={gregPickerTime}
              onChange={setGregPickerTime}
              weekStartsOn={weekStartsOn}
              showTime
              placeholder="YYYY/MM/DD HH:mm"
            />
          </DemoCard>

          <DemoCard
            title="Jalali"
            badge="with time"
            selected={formatSelected(jalaliPickerTime, true)}
          >
            <DatePicker
              calendar="jalali"
              locale="fa"
              value={jalaliPickerTime}
              onChange={setJalaliPickerTime}
              weekStartsOn={weekStartsOn}
              showTime
              placeholder="YYYY/MM/DD HH:mm"
            />
          </DemoCard>
        </div>
      </section>

      <section className="demoSection">
        <h2 className="demoGroupTitle">External theme override</h2>
        <p className="demoHint">
          Host apps can theme components with CSS variables on a wrapper — no{" "}
          <code>theme</code> prop needed.
        </p>
        <div className="demoGrid demoGridNarrow">
          <DemoCard
            title="Jalali DatePicker"
            badge="custom CSS vars"
            selected="—"
            className="hostThemeOverride"
          >
            <DatePicker
              calendar="jalali"
              locale="fa"
              placeholder="YYYY/MM/DD"
            />
          </DemoCard>
        </div>
      </section>

      <footer className="demoFooter">
        <p>
          Source &amp; docs: see <code>README.md</code> in the repository.
        </p>
      </footer>
    </div>
  );
}

export default App;
