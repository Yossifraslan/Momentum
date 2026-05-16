import type { HabitForm as HabitFormType } from "../types/index";
import { COLORS, CATEGORIES } from "../data/constants";

interface HabitFormProps {
  form: HabitFormType;
  setForm: (form: HabitFormType) => void;
  onAdd: () => void;
}

export default function HabitForm({ form, setForm, onAdd }: HabitFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const toggleTargetDate = (date: string) => {
    const exists = (form.targetDates ?? []).includes(date);
    setForm({
      ...form,
      targetDates: exists
        ? form.targetDates.filter((d) => d !== date)
        : [...(form.targetDates ?? []), date],
    });
  };

  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().split("T")[0],
      label:
        i === 0
          ? "Today"
          : i === 1
            ? "Tomorrow"
            : d.toLocaleDateString("en-MY", {
                weekday: "short",
                day: "numeric",
              }),
    };
  });

  return (
    <div>
      <div className="form-grid">
        <div className="field full">
          <input
            type="text"
            placeholder="Habit name e.g. Drink 8 glasses of water"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && onAdd()}
          />
        </div>
        <div className="field">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <input
            type="time"
            value={form.reminder}
            onChange={(e) => setForm({ ...form, reminder: e.target.value })}
          />
        </div>
      </div>

      <div
        style={{
          fontSize: ".78rem",
          color: "var(--muted)",
          marginBottom: "6px",
        }}
      >
        Colour
      </div>
      <div className="color-row">
        {COLORS.map((c) => (
          <div
            key={c.hex}
            className={`color-dot ${form.color === c.hex ? "sel" : ""}`}
            style={{ background: c.hex }}
            title={c.label}
            onClick={() => setForm({ ...form, color: c.hex })}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "14px",
          fontSize: ".88rem",
        }}
      >
        <input
          type="checkbox"
          id="daily-reminder"
          checked={form.dailyReminder}
          onChange={(e) =>
            setForm({ ...form, dailyReminder: e.target.checked })
          }
          style={{
            width: "16px",
            height: "16px",
            accentColor: "var(--accent)",
            cursor: "pointer",
          }}
        />
        <label htmlFor="daily-reminder" style={{ cursor: "pointer" }}>
          Repeat daily
        </label>
      </div>

      {!form.dailyReminder && (
        <div style={{ marginBottom: "14px" }}>
          <div
            style={{
              fontSize: ".78rem",
              color: "var(--muted)",
              marginBottom: "8px",
            }}
          >
            Select target dates
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {nextDays.map(({ date, label }) => (
              <button
                key={date}
                onClick={() => toggleTargetDate(date)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: "1px solid",
                  fontSize: ".78rem",
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  background: (form.targetDates ?? []).includes(date)
                    ? form.color
                    : "rgba(255,255,255,0.05)",
                  borderColor: (form.targetDates ?? []).includes(date)
                    ? form.color
                    : "var(--border)",
                  color: (form.targetDates ?? []).includes(date)
                    ? "#fff"
                    : "var(--muted)",
                  transition: "all .2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "8px" }}>
            <input
              type="date"
              min={today}
              onChange={(e) => {
                if (e.target.value) toggleTargetDate(e.target.value);
                e.target.value = "";
              }}
              style={{ fontSize: ".82rem" }}
            />
          </div>
        </div>
      )}

      {/* Notes */}
      <div style={{ marginBottom: "14px" }}>
        <textarea
          placeholder="Add a note (optional) e.g. why this habit matters to you"
          value={form.notes ?? ""}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={2}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            color: "var(--text)",
            fontFamily: "DM Sans, sans-serif",
            fontSize: ".88rem",
            outline: "none",
            resize: "vertical",
            transition: "border-color .2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      <button className="btn-primary" onClick={onAdd}>
        + Add Habit
      </button>
    </div>
  );
}
