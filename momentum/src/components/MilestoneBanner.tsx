import { useEffect, useState } from "react";
import type { Habit } from "../types/index";

interface MilestoneBannerProps {
  habits: Habit[];
}

const MILESTONES = [3, 7, 14, 30, 60, 100];

export default function MilestoneBanner({ habits }: MilestoneBannerProps) {
  const [banner, setBanner] = useState<string | null>(null);
  const [shown, setShown] = useState<Set<string>>(new Set());

  useEffect(() => {
    for (const habit of habits) {
      const streak = habit.streak ?? 0;
      for (const m of MILESTONES) {
        const key = `${habit.id}-${m}`;
        if (streak === m && !shown.has(key)) {
          setShown((prev) => new Set([...prev, key]));
          setBanner(`🔥 ${habit.name} hit a ${m}-day streak!`);
          setTimeout(() => setBanner(null), 3500);
          return;
        }
      }
    }
  }, [habits]);

  if (!banner) return null;

  return <div className="milestone-banner">{banner}</div>;
}
