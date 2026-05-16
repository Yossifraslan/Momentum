import type { Habit } from "../types/index";

interface HeatmapProps {
  habits: Habit[];
}

export default function Heatmap({ habits }: HeatmapProps) {
  // Build last 30 days oldest → newest (left to right)
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="heatmap-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: ".72rem",
          color: "var(--muted)",
          marginBottom: "6px",
        }}
      >
        <span>30 days ago</span>
        <span>Today</span>
      </div>

      <div className="heatmap-grid">
        {days.map((date) => {
          const total = habits.length;
          const completed = habits.filter((h) =>
            h.completedDates.includes(date),
          ).length;
          const ratio = total === 0 ? 0 : completed / total;

          let bg = "rgba(255,255,255,0.07)";
          if (ratio > 0 && ratio <= 0.25) bg = "#14532d";
          else if (ratio > 0.25 && ratio <= 0.5) bg = "#166534";
          else if (ratio > 0.5 && ratio <= 0.75) bg = "#22c55e";
          else if (ratio > 0.75) bg = "#4ade80";

          const isToday = date === new Date().toISOString().split("T")[0];

          return (
            <div
              key={date}
              className="hcell"
              style={{
                background: bg,
                outline: isToday ? "2px solid #7c3aed" : "none",
                outlineOffset: "1px",
              }}
              title={`${date}: ${completed}/${total} habits completed`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "10px",
          fontSize: ".72rem",
          color: "var(--muted)",
        }}
      >
        <span>Less</span>
        {[
          "rgba(255,255,255,0.07)",
          "#14532d",
          "#166534",
          "#22c55e",
          "#4ade80",
        ].map((c, i) => (
          <div
            key={i}
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "3px",
              background: c,
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
