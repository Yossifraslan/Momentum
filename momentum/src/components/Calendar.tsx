import { useState } from "react";
import type { Habit } from "../types/index";
import { ICONS } from "../data/constants";

interface CalendarProps {
  habits: Habit[];
}

export default function Calendar({ habits }: CalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    now.toISOString().split("T")[0],
  );

  const today = now.toISOString().split("T")[0];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  // Build calendar cells
  const cells: { date: string; day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrev - i);
    cells.push({
      date: d.toISOString().split("T")[0],
      day: daysInPrev - i,
      current: false,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({
      date: date.toISOString().split("T")[0],
      day: d,
      current: true,
    });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    cells.push({
      date: date.toISOString().split("T")[0],
      day: d,
      current: false,
    });
  }

  // Filter habits relevant to a given date
  function habitsForDate(date: string) {
    return habits.filter((h) => {
      if (h.dailyReminder) return true;
      return h.targetDates.includes(date);
    });
  }

  const selectedHabits = selectedDate ? habitsForDate(selectedDate) : [];

  return (
    <div>
      <div className="page-title">Calendar</div>

      {/* Month nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button className="toggle-btn" onClick={prevMonth}>
          ← Prev
        </button>
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
        >
          {MONTH_NAMES[month]} {year}
        </span>
        <button className="toggle-btn" onClick={nextMonth}>
          Next →
        </button>
      </div>

      {/* Day labels */}
      <div className="calendar-grid">
        {DAY_LABELS.map((d) => (
          <div key={d} className="cal-day-label">
            {d}
          </div>
        ))}

        {cells.map((cell, i) => {
          const relevantHabits = habitsForDate(cell.date);
          const completedCount = relevantHabits.filter((h) =>
            h.completedDates.includes(cell.date),
          ).length;
          const isToday = cell.date === today;
          const isSelected = cell.date === selectedDate;

          return (
            <div
              key={i}
              className={`cal-cell ${isToday ? "today" : ""} ${!cell.current ? "other-month" : ""}`}
              style={
                isSelected
                  ? {
                      borderColor: "#7c3aed",
                      background: "rgba(124,58,237,0.1)",
                    }
                  : {}
              }
              onClick={() => setSelectedDate(cell.date)}
            >
              <span className="cal-date">{cell.day}</span>
              {completedCount > 0 && <div className="cal-dot" />}
            </div>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedDate && (
        <div className="cal-selected-day">
          <div className="cal-selected-title">
            📅{" "}
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-MY", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {selectedHabits.length === 0 ? (
            <div style={{ color: "var(--muted)", fontSize: ".88rem" }}>
              No habits scheduled for this day.
            </div>
          ) : (
            selectedHabits.map((h) => (
              <div key={h.id} className="cal-habit-item">
                <div
                  style={{
                    width: "4px",
                    height: "32px",
                    borderRadius: "999px",
                    background: h.color,
                    flexShrink: 0,
                  }}
                />
                <span className="cal-status">
                  {h.completedDates.includes(selectedDate) ? "✅" : "⬜"}
                </span>
                <span style={{ flex: 1 }}>
                  {ICONS[h.category] || "⭐"} {h.name}
                </span>
                <span style={{ color: "var(--muted)", fontSize: ".78rem" }}>
                  {h.dailyReminder ? "🔁 Daily" : "📌 Specific dates"} ·{" "}
                  {h.reminder}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
