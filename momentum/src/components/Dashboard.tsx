import { useState } from "react";
import type { Habit, HabitForm as HabitFormType } from "../types/index";
import HabitCard from "./HabitCard";
import HabitForm from "./HabitForm";
import Heatmap from "./Heatmap";
import WeeklySummary from "./WeeklySummary";
import MilestoneBanner from "./MilestoneBanner";
import EnergyScheduler from "./EnergyScheduler";

interface DashboardProps {
  habits: Habit[];
  quote: string;
  form: HabitFormType;
  showStreak: boolean;
  setForm: (form: HabitFormType) => void;
  onAdd: () => void;
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
  onApplySuggestion: (habitId: number, time: string) => void;
}

const CATEGORIES_ALL = [
  "All",
  "Health",
  "Fitness",
  "Study",
  "Productivity",
  "Mindfulness",
];

const DAILY_QUOTES = [
  "Small progress is still progress.",
  "Consistency beats intensity.",
  "Discipline creates freedom.",
  "One step every day matters.",
  "Your future self will thank you.",
  "The secret is to start.",
  "Focus on progress, not perfection.",
  "Show up every day, no matter what.",
];

function exportToCSV(habits: Habit[]) {
  const headers = [
    "Name",
    "Category",
    "Streak",
    "Longest Streak",
    "Completion Rate",
    "Total Completions",
    "Daily Reminder",
  ];
  const rows = habits.map((h) => [
    h.name,
    h.category,
    h.streak ?? 0,
    h.longestStreak ?? 0,
    `${h.completionRate ?? 0}%`,
    (h.completedDates ?? []).length,
    h.dailyReminder ? "Yes" : "No",
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `momentum-habits-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Dashboard({
  habits,
  quote,
  form,
  showStreak,
  setForm,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  onApplySuggestion,
}: DashboardProps) {
  const [filter, setFilter] = useState("All");

  const today = new Date().toISOString().split("T")[0];
  const completedToday = habits.filter((h) =>
    (h.completedDates ?? []).includes(today),
  ).length;
  const total = habits.length;
  const overall = total === 0 ? 0 : Math.round((completedToday / total) * 100);

  const totalComp = habits.reduce(
    (s, h) => s + (h.completedDates ?? []).length,
    0,
  );
  const morningComp = habits.reduce(
    (s, h) => s + (h.completionTimes ?? []).filter((t) => t < 12).length,
    0,
  );

  const insight =
    totalComp === 0
      ? "Complete habits to unlock insights 🔍"
      : morningComp > totalComp / 2
        ? "You thrive in the morning 🌞"
        : "You hit your stride later in the day 🌙";

  const bestHabit = habits.length
    ? habits.reduce((a, b) => ((a.streak ?? 0) >= (b.streak ?? 0) ? a : b))
    : null;
  const dailyQuote = DAILY_QUOTES[new Date().getDate() % DAILY_QUOTES.length];
  const filtered =
    filter === "All" ? habits : habits.filter((h) => h.category === filter);

  return (
    <div className="page-enter">
      <MilestoneBanner habits={habits} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div className="page-title" style={{ marginBottom: 0 }}>
          Dashboard
        </div>
        {total > 0 && (
          <button className="export-btn" onClick={() => exportToCSV(habits)}>
            ⬇️ Export CSV
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Today's Progress</div>
          <div className="stat-value">{overall}%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${overall}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed Today</div>
          <div className="stat-value">
            {completedToday}
            <span style={{ fontSize: "1.4rem", opacity: 0.4 }}>/{total}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Quote of the Day</div>
          <div className="stat-text" style={{ fontStyle: "italic" }}>
            {quote || dailyQuote}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Smart Insight</div>
          <div className="stat-text">{insight}</div>
        </div>
      </div>

      {total > 0 && <WeeklySummary habits={habits} />}

      {/* Energy Scheduler */}
      <EnergyScheduler habits={habits} onApplySuggestion={onApplySuggestion} />

      <div className="panel">
        <div className="panel-title">Create Habit</div>
        <HabitForm form={form} setForm={setForm} onAdd={onAdd} />
      </div>

      <div className="panel">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div className="panel-title" style={{ marginBottom: 0 }}>
            Your Habits
            {total > 0 && (
              <span
                style={{
                  marginLeft: "10px",
                  fontSize: ".75rem",
                  color: "var(--muted)",
                  fontWeight: 400,
                }}
              >
                {completedToday}/{total} done today
              </span>
            )}
          </div>
        </div>

        {/* Category filter */}
        {total > 0 && (
          <div className="filter-row">
            {CATEGORIES_ALL.map((c) => (
              <button
                key={c}
                className={`filter-chip ${filter === c ? "active" : ""}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {total === 0 ? (
          <div className="empty-state">
            <div className="empty-emoji">👀</div>
            <div className="empty-title">No habits yet</div>
            <div className="empty-sub">
              Create your first habit to start building momentum.
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-emoji">🔍</div>
            <div className="empty-title">No {filter} habits</div>
            <div className="empty-sub">Try a different category filter.</div>
          </div>
        ) : (
          <div className="habit-table">
            {filtered.map((h) => (
              <HabitCard
                key={h.id}
                habit={h}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                showStreak={showStreak}
              />
            ))}
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="panel">
          <div className="panel-title">Activity Heatmap</div>
          <Heatmap habits={habits} />
        </div>
      )}

      <div className="panel">
        <div className="panel-title">Smart Insights</div>
        <div className="insights-grid">
          <div className="insight-card bl">
            <div className="insight-label">Best Consistency</div>
            <div className="insight-text">
              {bestHabit
                ? `${bestHabit.name} leads with a ${bestHabit.streak ?? 0}-day streak.`
                : "Create habits to unlock insights."}
            </div>
          </div>
          <div className="insight-card pu">
            <div className="insight-label">Weekly Focus</div>
            <div className="insight-text">
              Consistency improves when habits are done before noon.
            </div>
          </div>
          <div className="insight-card gr">
            <div className="insight-label">Productivity Tip</div>
            <div className="insight-text">
              Stack similar habits together to boost your completion rate.
            </div>
          </div>
        </div>
      </div>

      <footer>Momentum · Built with React + TypeScript + Vite</footer>
    </div>
  );
}
