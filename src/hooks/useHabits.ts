import { useState, useEffect } from "react";
import type { Habit, HabitForm, Settings } from "../types/index";
import { QUOTES, DEFAULT_FORM, DEFAULT_SETTINGS } from "../data/constants";
import confetti from "canvas-confetti";

export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

export function calcStreak(dates: string[]): number {
  if (!dates.length) return 0;
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const ds = d.toISOString().split("T")[0];
    if (dates.includes(ds)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function playCompleteSound() {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(523, ctx.currentTime);
    oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch {
    // Sound not supported
  }
}

function fireConfetti(color: string) {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: [color, "#ffffff", "#a78bfa"],
  });
}

const STORAGE_ACCOUNTS = "momentum-accounts";
const STORAGE_USER = "momentum-current-user";
const STORAGE_HABITS = "momentum-habits";
const STORAGE_SETTINGS = "momentum-settings";

export function useAuth() {
  const [authed, setAuthed] = useState<boolean>(() => {
    return !!localStorage.getItem(STORAGE_USER);
  });
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [accounts, setAccounts] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_ACCOUNTS) || "{}");
    } catch {
      return {};
    }
  });
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_USER);
  });
  const [authErr, setAuthErr] = useState("");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });

  useEffect(() => {
    localStorage.setItem(STORAGE_ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  const handleAuth = () => {
    const { email, password } = authForm;
    if (!email || !password) {
      setAuthErr("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setAuthErr("Please enter a valid email.");
      return;
    }
    if (password.length < 4) {
      setAuthErr("Password must be at least 4 characters.");
      return;
    }

    const hash = simpleHash(password);

    if (authMode === "register") {
      if (accounts[email] !== undefined) {
        setAuthErr("Account already exists. Please log in.");
        return;
      }
      const updated = { ...accounts, [email]: hash };
      setAccounts(updated);
      localStorage.setItem(STORAGE_ACCOUNTS, JSON.stringify(updated));
      localStorage.setItem(STORAGE_USER, email);
      setCurrentUser(email);
      setAuthed(true);
      setAuthErr("");
    } else {
      if (accounts[email] === undefined) {
        setAuthErr("No account found. Please register first.");
        return;
      }
      if (accounts[email] !== hash) {
        setAuthErr("Incorrect password.");
        return;
      }
      localStorage.setItem(STORAGE_USER, email);
      setCurrentUser(email);
      setAuthed(true);
      setAuthErr("");
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_USER);
    setAuthed(false);
    setCurrentUser(null);
    setAuthForm({ email: "", password: "" });
    setAuthErr("");
  };

  const switchMode = () => {
    setAuthMode((prev) => (prev === "login" ? "register" : "login"));
    setAuthErr("");
  };

  return {
    authed,
    authMode,
    currentUser,
    authErr,
    authForm,
    setAuthForm,
    handleAuth,
    logout,
    switchMode,
  };
}

export function useHabits(soundEffects: boolean) {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_HABITS) || "[]");
      return saved.map((h: any) => ({
        streak: 0,
        longestStreak: 0,
        completedDates: [],
        completionTimes: [],
        completionRate: 0,
        dailyReminder: true,
        targetDates: [],
        notes: "",
        ...h,
      }));
    } catch {
      return [];
    }
  });
  const [quote, setQuote] = useState("");
  const [form, setForm] = useState<HabitForm>(DEFAULT_FORM);

  useEffect(() => {
    localStorage.setItem(STORAGE_HABITS, JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!form.name.trim()) return;
    const newHabit: Habit = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      reminder: form.reminder,
      color: form.color,
      dailyReminder: form.dailyReminder ?? true,
      targetDates: form.targetDates ?? [],
      notes: form.notes ?? "",
      streak: 0,
      longestStreak: 0,
      completedDates: [],
      completionTimes: [],
      completionRate: 0,
      lastAppliedSuggestionDate: undefined,
    };
    setHabits((prev) => [...prev, newHabit]);
    setForm(DEFAULT_FORM);
  };

  const editHabit = (
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
  ) => {
    setHabits((prev) => {
      const newHabits = prev.map((h) =>
        h.id === id ? { ...h, ...updated } : h,
      );
      localStorage.setItem(STORAGE_HABITS, JSON.stringify(newHabits));
      return newHabits;
    });
  };

  const toggleComplete = (id: number) => {
    const today = getToday();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        let dates = [...(h.completedDates ?? [])];
        let times = [...(h.completionTimes ?? [])];
        if (dates.includes(today)) {
          dates = dates.filter((d) => d !== today);
          times = times.slice(0, -1);
        } else {
          dates.push(today);
          times.push(new Date().getHours());
          setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
          if (soundEffects) playCompleteSound();
          fireConfetti(h.color ?? "#7c3aed");
        }
        const streak = calcStreak(dates);
        const longestStreak = Math.max(h.longestStreak ?? 0, streak);
        const completionRate = Math.min(
          100,
          Math.round((dates.length / 30) * 100),
        );
        return {
          ...h,
          completedDates: dates,
          completionTimes: times,
          streak,
          longestStreak,
          completionRate,
        };
      }),
    );
  };

  const deleteHabit = (id: number) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const clearAllHabits = () => {
    setHabits([]);
    setQuote("");
    setForm(DEFAULT_FORM);
  };

  const applySuggestion = (habitId: number, reminderTime: string) => {
    const today = getToday();
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? { ...h, reminder: reminderTime, lastAppliedSuggestionDate: today }
          : h,
      ),
    );
  };

  return {
    habits,
    quote,
    form,
    setForm,
    addHabit,
    editHabit,
    toggleComplete,
    deleteHabit,
    clearAllHabits,
    applySuggestion,
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS);
      return saved
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
        : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof Omit<Settings, "theme" | "onboarded">) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setTheme = (theme: Settings["theme"]) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const completeOnboarding = () => {
    setSettings((prev) => ({ ...prev, onboarded: true }));
  };

  return { settings, toggleSetting, setTheme, completeOnboarding };
}
