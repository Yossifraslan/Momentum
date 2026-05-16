import type { Habit } from "../types/index";

interface WeeklySummaryProps {
  habits: Habit[];
}

export default function WeeklySummary({ habits }: WeeklySummaryProps) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const total = habits.length;
  const completed = days.reduce(
    (sum, date) =>
      sum +
      habits.filter((h) => (h.completedDates ?? []).includes(date)).length,
    0,
  );
  const possible = total * 7;
  const rate = possible === 0 ? 0 : Math.round((completed / possible) * 100);

  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Adjust so index 0 = 6 days ago
  const adjustedDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString().split("T")[0],
      label: DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1],
    };
  });

  const emoji =
    rate >= 80 ? "🔥" : rate >= 50 ? "💪" : rate >= 20 ? "📈" : "🌱";

  const message =
    rate >= 80
      ? "Incredible week! You're on fire."
      : rate >= 50
        ? "Solid effort this week. Keep going!"
        : rate >= 20
          ? "Getting there. Every day counts."
          : "A new week is a fresh start. You got this!";

  return (
    <div className="panel" style={{ marginBottom: "20px" }}>
      <div className="panel-title">Weekly Summary</div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: "2.5rem" }}>{emoji}</div>
        <div>
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              marginBottom: "3px",
            }}
          >
            {completed}/{possible} habits completed
          </div>
          <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>
            {message}
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "2rem",
            color: rate >= 50 ? "var(--green)" : "var(--muted)",
          }}
        >
          {rate}%
        </div>
      </div>

      {/* Day bars */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
        }}
      >
        {adjustedDays.map(({ date, label }) => {
          const dayCompleted = habits.filter((h) =>
            (h.completedDates ?? []).includes(date),
          ).length;
          const dayRate = total === 0 ? 0 : dayCompleted / total;

          return (
            <div
              key={date}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "60px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.07)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: `${dayRate * 100}%`,
                    background:
                      dayRate >= 0.8
                        ? "#22c55e"
                        : dayRate >= 0.5
                          ? "#3b82f6"
                          : "#7c3aed",
                    borderRadius: "8px",
                    transition: "height .5s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              </div>
              <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>
                {label}
              </div>
              <div style={{ fontSize: ".72rem", fontWeight: 600 }}>
                {dayCompleted}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
