import { useState } from "react";
import type { Habit } from "../types/index";
import { ICONS, COLORS, CATEGORIES } from "../data/constants";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (
    id: number,
    updated: Partial<
      Pick<
        Habit,
        | "name"
        | "category"
        | "reminder"
        | "color"
        | "dailyReminder"
        | "targetDates"
        | "notes"
      >
    >,
  ) => void;
  showStreak: boolean;
}

export default function HabitCard({
  habit,
  onToggle,
  onDelete,
  onEdit,
  showStreak,
}: HabitCardProps) {
  const today = new Date().toISOString().split("T")[0];
  const completedDates = Array.isArray(habit.completedDates)
    ? habit.completedDates
    : [];
  const done = completedDates.includes(today);

  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState({
    name: habit.name ?? "",
    category: habit.category ?? "Health",
    reminder: habit.reminder ?? "08:00",
    color: habit.color ?? "#7c3aed",
    dailyReminder: habit.dailyReminder ?? true,
    notes: habit.notes ?? "",
  });

  const saveEdit = () => {
    if (!draft.name.trim()) return;
    onEdit(habit.id, draft);
    setEditing(false);
  };

  if (editing) {
    return (
      <div
        className="habit-row"
        style={{ flexDirection: "column", alignItems: "stretch", gap: "12px" }}
      >
        <div
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: ".95rem",
          }}
        >
          ✏️ Edit Habit
        </div>

        <div className="form-grid">
          <div className="field full">
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Habit name"
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
            />
          </div>
          <div className="field">
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <input
              type="time"
              value={draft.reminder}
              onChange={(e) => setDraft({ ...draft, reminder: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {COLORS.map((c) => (
            <div
              key={c.hex}
              className={`color-dot ${draft.color === c.hex ? "sel" : ""}`}
              style={{ background: c.hex }}
              title={c.label}
              onClick={() => setDraft({ ...draft, color: c.hex })}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: ".88rem",
          }}
        >
          <input
            type="checkbox"
            id={`edit-daily-${habit.id}`}
            checked={draft.dailyReminder}
            onChange={(e) =>
              setDraft({ ...draft, dailyReminder: e.target.checked })
            }
            style={{
              width: "16px",
              height: "16px",
              accentColor: "var(--accent)",
              cursor: "pointer",
            }}
          />
          <label
            htmlFor={`edit-daily-${habit.id}`}
            style={{ cursor: "pointer" }}
          >
            Repeat daily
          </label>
        </div>

        <textarea
          placeholder="Notes (optional)"
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          rows={2}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            color: "var(--text)",
            fontFamily: "DM Sans, sans-serif",
            fontSize: ".85rem",
            outline: "none",
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn-complete done" onClick={saveEdit}>
            Save
          </button>
          <button className="btn-delete" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`habit-row ${done ? "done" : ""}`}
      style={{ flexDirection: "column", alignItems: "stretch", gap: "10px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div
          className="habit-row-accent"
          style={{ background: habit.color ?? "#7c3aed" }}
        />

        <div className="habit-row-info">
          <div className="habit-row-name">
            {ICONS[habit.category] ?? "⭐"} {habit.name}
          </div>
          <div className="habit-row-meta">
            {habit.category} · {habit.reminder} ·{" "}
            {habit.dailyReminder ? "🔁 Daily" : "📌 Specific dates"}
          </div>
        </div>

        {showStreak && (
          <div className="habit-row-badges">
            <span className="badge badge-o">🔥 {habit.streak ?? 0}d</span>
            <span className="badge badge-b">🏆 {habit.longestStreak ?? 0}</span>
            <span className="badge badge-g">
              📈 {habit.completionRate ?? 0}%
            </span>
          </div>
        )}

        <div className="habit-row-actions">
          <button
            className={`btn-complete ${done ? "done" : "undone"}`}
            onClick={() => onToggle(habit.id)}
          >
            {done ? "✅ Done" : "Mark Done"}
          </button>
          <button
            className="btn-delete"
            title="Expand"
            onClick={() => setExpanded((e) => !e)}
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "var(--border)",
              color: "var(--muted)",
            }}
          >
            {expanded ? "▲" : "▼"}
          </button>
          <button
            className="btn-delete"
            title="Edit habit"
            onClick={() => setEditing(true)}
            style={{
              background: "rgba(124,58,237,0.1)",
              borderColor: "rgba(124,58,237,0.25)",
              color: "#a78bfa",
            }}
          >
            ✏️
          </button>
          <button
            className="btn-delete"
            title="Delete habit"
            onClick={() => onDelete(habit.id)}
          >
            🗑
          </button>
        </div>
      </div>

      {/* Expandable notes + progress */}
      {expanded && (
        <div
          style={{
            paddingLeft: "16px",
            borderLeft: `3px solid ${habit.color ?? "#7c3aed"}`,
            marginLeft: "4px",
          }}
        >
          {habit.notes && (
            <div
              style={{
                fontSize: ".82rem",
                color: "var(--muted)",
                marginBottom: "10px",
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              📝 {habit.notes}
            </div>
          )}
          <div
            style={{
              fontSize: ".75rem",
              color: "var(--muted)",
              marginBottom: "4px",
            }}
          >
            30-Day Progress · {habit.completionRate ?? 0}%
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${habit.completionRate ?? 0}%`,
                background: habit.color ?? "#7c3aed",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
