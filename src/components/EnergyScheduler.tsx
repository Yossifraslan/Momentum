import { useState, useMemo } from "react";
import type { Habit } from "../types/index";
import {
  analyzeEnergyWindows,
  getEnergyInsights,
  suggestSchedule,
  formatHour,
} from "../lib/energyScheduler";

interface EnergySchedulerProps {
  habits: Habit[];
  onApplySuggestion: (habitId: number, time: string) => void;
}

export default function EnergyScheduler({
  habits,
  onApplySuggestion,
}: EnergySchedulerProps) {
  const [activeTab, setActiveTab] = useState<
    "chart" | "suggestions" | "insights"
  >("chart");

  const windows = useMemo(() => analyzeEnergyWindows(habits), [habits]);
  const insights = useMemo(() => getEnergyInsights(habits), [habits]);
  const today = new Date().toISOString().split("T")[0];
  const suggestions = useMemo(() => suggestSchedule(habits), [habits]);

  const hasData = habits.some((h) => (h.completionTimes ?? []).length > 0);

  const energyColor = (energy: "peak" | "moderate" | "low") =>
    energy === "peak"
      ? "#22c55e"
      : energy === "moderate"
        ? "#f97316"
        : "rgba(255,255,255,0.1)";

  const confidenceColor = (c: "high" | "medium" | "low") =>
    c === "high" ? "#4ade80" : c === "medium" ? "#fb923c" : "#94a3b8";

  const handleApply = (habitId: number, time: string) => {
    onApplySuggestion(habitId, time);
  };

  const tabStyle = (tab: string) => ({
    padding: "5px 12px",
    borderRadius: "8px",
    border: "none",
    background: activeTab === tab ? "var(--accent)" : "transparent",
    color: activeTab === tab ? "#fff" : "var(--muted)",
    fontSize: ".75rem" as const,
    fontFamily: "DM Sans, sans-serif",
    fontWeight: activeTab === tab ? 600 : 400,
    cursor: "pointer" as const,
    transition: "all .2s",
    textTransform: "capitalize" as const,
  });

  return (
    <div className="panel" style={{ marginBottom: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div>
          <div className="panel-title" style={{ marginBottom: "2px" }}>
            ⚡ Energy-Aware Scheduling
          </div>
          <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>
            {hasData
              ? "Based on your completion history"
              : "Complete habits to unlock personalized scheduling"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "4px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "10px",
            padding: "3px",
          }}
        >
          {(["chart", "suggestions", "insights"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={tabStyle(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* CHART TAB */}
      {activeTab === "chart" && (
        <div>
          {!hasData ? (
            <NoDataPlaceholder />
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "4px",
                  height: "100px",
                  marginBottom: "8px",
                }}
              >
                {windows.map((w) => (
                  <div
                    key={w.hour}
                    title={`${formatHour(w.hour)}: ${w.score} energy score`}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: `${Math.max(w.score, 4)}%`,
                        background: energyColor(w.energy),
                        borderRadius: "4px 4px 0 0",
                        transition: "height .5s ease",
                        opacity: w.score === 0 ? 0.3 : 1,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div
                style={{ display: "flex", gap: "4px", marginBottom: "16px" }}
              >
                {windows.map((w, i) => (
                  <div
                    key={w.hour}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: ".6rem",
                      color: "var(--muted)",
                    }}
                  >
                    {i % 3 === 0 ? formatHour(w.hour) : ""}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {[
                  { label: "Peak energy", color: "#22c55e" },
                  { label: "Moderate energy", color: "#f97316" },
                  { label: "Low energy", color: "rgba(255,255,255,0.1)" },
                ].map((l) => (
                  <div
                    key={l.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: ".75rem",
                      color: "var(--muted)",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "3px",
                        background: l.color,
                      }}
                    />
                    {l.label}
                  </div>
                ))}
              </div>

              {insights.peakHours.length > 0 && (
                <div
                  style={{
                    marginTop: "14px",
                    padding: "12px 16px",
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: "12px",
                    fontSize: ".82rem",
                  }}
                >
                  <span style={{ color: "#4ade80", fontWeight: 600 }}>
                    🔋 Your peak hours:{" "}
                  </span>
                  <span style={{ color: "var(--muted)" }}>
                    {insights.peakHours.slice(0, 3).map(formatHour).join(", ")}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* SUGGESTIONS TAB */}
      {activeTab === "suggestions" && (
        <div>
          {habits.length === 0 ? (
            <NoDataPlaceholder message="Create habits to get scheduling suggestions" />
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {suggestions.map((s) => (
                <div
                  key={s.habit.id}
                  style={{
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: "4px",
                      height: "40px",
                      borderRadius: "999px",
                      background: s.habit.color,
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: ".9rem",
                        marginBottom: "2px",
                        fontFamily: "Syne, sans-serif",
                      }}
                    >
                      {s.habit.name}
                    </div>
                    <div
                      style={{
                        fontSize: ".75rem",
                        color: "var(--muted)",
                        lineHeight: 1.4,
                      }}
                    >
                      {s.reason}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "6px",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        color: energyColor(s.energyMatch),
                      }}
                    >
                      {formatHour(parseInt(s.suggestedTime.split(":")[0]))}
                    </div>
                    <div
                      style={{
                        fontSize: ".65rem",
                        color: confidenceColor(s.confidence),
                        padding: "2px 8px",
                        borderRadius: "999px",
                        border: `1px solid ${confidenceColor(s.confidence)}40`,
                        background: `${confidenceColor(s.confidence)}15`,
                      }}
                    >
                      {s.confidence} confidence
                    </div>
                  </div>

                  {s.habit.lastAppliedSuggestionDate === today ? (
                    <div
                      style={{
                        fontSize: ".78rem",
                        color: "#4ade80",
                        fontWeight: 600,
                      }}
                    >
                      ✓ Applied
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(s.habit.id, s.suggestedTime)}
                      style={{
                        padding: "7px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--accent)",
                        background: "rgba(124,58,237,0.1)",
                        color: "var(--accent)",
                        fontSize: ".78rem",
                        fontFamily: "DM Sans, sans-serif",
                        cursor: "pointer",
                        transition: "all .2s",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      Apply →
                    </button>
                  )}
                </div>
              ))}

              {!hasData && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "rgba(249,115,22,0.08)",
                    border: "1px solid rgba(249,115,22,0.2)",
                    borderRadius: "12px",
                    fontSize: ".78rem",
                    color: "#fb923c",
                  }}
                >
                  ⚠️ Suggestions are based on category patterns. Complete more
                  habits to get personalized timing.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* INSIGHTS TAB */}
      {activeTab === "insights" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "10px",
          }}
        >
          <InsightTile
            icon="📅"
            label="Best Day"
            value={insights.totalDataPoints > 0 ? insights.bestDay : "—"}
            sub="Most completions"
            color="#4ade80"
          />
          <InsightTile
            icon="😴"
            label="Rest Day"
            value={insights.totalDataPoints > 0 ? insights.worstDay : "—"}
            sub="Fewest completions"
            color="#f87171"
          />
          <InsightTile
            icon="🎯"
            label="Consistency"
            value={`${insights.consistency}%`}
            sub="Days active this week"
            color="#60a5fa"
          />
          <InsightTile
            icon="📊"
            label="Data Points"
            value={`${insights.totalDataPoints}`}
            sub="Habit completions logged"
            color="#a78bfa"
          />
          {insights.peakHours.length > 0 && (
            <InsightTile
              icon="⚡"
              label="Peak Window"
              value={formatHour(insights.peakHours[0])}
              sub="Your top energy hour"
              color="#22c55e"
            />
          )}
          {insights.lowHours.length > 0 && (
            <InsightTile
              icon="🌙"
              label="Low Window"
              value={formatHour(insights.lowHours[0])}
              sub="Avoid scheduling here"
              color="#94a3b8"
            />
          )}
        </div>
      )}
    </div>
  );
}

function InsightTile({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
      }}
    >
      <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>{icon}</div>
      <div
        style={{
          fontSize: ".72rem",
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: ".08em",
          marginBottom: "3px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: "1.3rem",
          color,
          marginBottom: "2px",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>{sub}</div>
    </div>
  );
}

function NoDataPlaceholder({ message }: { message?: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "28px 16px",
        color: "var(--muted)",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "8px" }}>⚡</div>
      <div style={{ fontSize: ".88rem" }}>
        {message ??
          "Complete habits throughout the day to build your energy profile"}
      </div>
    </div>
  );
}
