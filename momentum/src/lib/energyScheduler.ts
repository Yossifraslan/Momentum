import type { Habit } from "../types/index";

export type EnergyWindow = {
  hour: number;
  label: string;
  energy: "peak" | "moderate" | "low";
  score: number;
  completionRate: number;
  habitCount: number;
};

export type HabitSuggestion = {
  habit: Habit;
  suggestedTime: string;
  reason: string;
  confidence: "high" | "medium" | "low";
  energyMatch: "peak" | "moderate" | "low";
};

export type EnergyInsight = {
  peakHours: number[];
  lowHours: number[];
  bestDay: string;
  worstDay: string;
  consistency: number;
  totalDataPoints: number;
};

const HOUR_LABELS: Record<number, string> = {
  5: "5am",
  6: "6am",
  7: "7am",
  8: "8am",
  9: "9am",
  10: "10am",
  11: "11am",
  12: "12pm",
  13: "1pm",
  14: "2pm",
  15: "3pm",
  16: "4pm",
  17: "5pm",
  18: "6pm",
  19: "7pm",
  20: "8pm",
  21: "9pm",
  22: "10pm",
};

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function analyzeEnergyWindows(habits: Habit[]): EnergyWindow[] {
  const hourCounts: Record<number, number> = {};
  for (let h = 5; h <= 22; h++) hourCounts[h] = 0;

  for (const habit of habits) {
    const times = habit.completionTimes ?? [];
    for (const t of times) {
      if (t >= 5 && t <= 22) hourCounts[t]++;
    }
  }

  const maxCount = Math.max(...Object.values(hourCounts), 1);

  return Object.entries(hourCounts)
    .map(([hour, count]) => {
      const h = parseInt(hour);
      const score = Math.round((count / maxCount) * 100);
      const energy: "peak" | "moderate" | "low" =
        score >= 60 ? "peak" : score >= 30 ? "moderate" : "low";

      return {
        hour: h,
        label: HOUR_LABELS[h] ?? `${h}:00`,
        energy,
        score,
        completionRate: score,
        habitCount: count,
      };
    })
    .sort((a, b) => a.hour - b.hour);
}

export function getEnergyInsights(habits: Habit[]): EnergyInsight {
  const windows = analyzeEnergyWindows(habits);
  const peakWindows = windows.filter((w) => w.energy === "peak");
  const lowWindows = windows.filter((w) => w.energy === "low");

  const dayCounts: Record<number, number> = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };
  let totalDataPoints = 0;

  for (const habit of habits) {
    for (const date of habit.completedDates ?? []) {
      const d = new Date(date + "T00:00:00");
      dayCounts[d.getDay()]++;
      totalDataPoints++;
    }
  }

  const sorted = Object.entries(dayCounts).sort((a, b) => b[1] - a[1]);
  const bestDay = DAY_NAMES[parseInt(sorted[0][0])];
  const worstDay = DAY_NAMES[parseInt(sorted[sorted.length - 1][0])];

  const activeDays = Object.values(dayCounts).filter((c) => c > 0).length;
  const consistency = Math.round((activeDays / 7) * 100);

  return {
    peakHours: peakWindows.map((w) => w.hour),
    lowHours: lowWindows.map((w) => w.hour),
    bestDay,
    worstDay,
    consistency,
    totalDataPoints,
  };
}

export function suggestSchedule(habits: Habit[]): HabitSuggestion[] {
  const windows = analyzeEnergyWindows(habits);
  const insights = getEnergyInsights(habits);

  const highEnergyCategories = ["Fitness", "Productivity"];
  const lowEnergyCategories = ["Mindfulness", "Health"];

  return habits.map((habit) => {
    const isHighEnergy = highEnergyCategories.includes(habit.category);
    const isLowEnergy = lowEnergyCategories.includes(habit.category);

    let targetWindows: EnergyWindow[];
    let reason: string;

    if (isHighEnergy) {
      targetWindows = windows.filter((w) => w.energy === "peak");
      reason = `${habit.category} habits perform best during your peak energy hours`;
    } else if (isLowEnergy) {
      targetWindows = windows.filter((w) => w.energy !== "low");
      reason = `${habit.category} habits fit well in your moderate energy windows`;
    } else {
      targetWindows = windows.filter((w) => w.energy !== "low");
      reason = "Scheduled during your active hours for best results";
    }

    if (!targetWindows.length) targetWindows = windows;

    const chooseWindow = (windowsToChoose: EnergyWindow[]) => {
      if (!windowsToChoose.length) return windowsToChoose[0];

      const sorted = [...windowsToChoose].sort((a, b) => b.score - a.score);
      const topCount = Math.min(3, sorted.length);
      const topWindows = sorted.slice(0, topCount);

      const consistent = (habit.completionTimes ?? []).length >= 6;
      if (!consistent) return topWindows[0];

      const totalScore = topWindows.reduce((sum, w) => sum + w.score, 0);
      let picker = Math.random() * totalScore;
      for (const window of topWindows) {
        if (picker <= window.score) return window;
        picker -= window.score;
      }
      return topWindows[0];
    };

    const best = chooseWindow(targetWindows) ?? windows[0];
    const hour = best?.hour ?? 8;
    const formatted = `${hour.toString().padStart(2, "0")}:00`;

    const confidence: "high" | "medium" | "low" =
      insights.totalDataPoints >= 20
        ? "high"
        : insights.totalDataPoints >= 7
          ? "medium"
          : "low";

    return {
      habit,
      suggestedTime: formatted,
      reason,
      confidence,
      energyMatch: best?.energy ?? "moderate",
    };
  });
}

export function formatHour(hour: number): string {
  if (hour === 12) return "12pm";
  if (hour === 0) return "12am";
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}
