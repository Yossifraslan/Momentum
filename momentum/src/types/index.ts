export interface Habit {
  id: number;
  name: string;
  category: string;
  reminder: string;
  color: string;
  streak: number;
  longestStreak: number;
  completedDates: string[];
  completionTimes: number[];
  completionRate: number;
  dailyReminder: boolean;
  targetDates: string[];
  notes: string;
  lastAppliedSuggestionDate?: string;
}

export interface HabitForm {
  name: string;
  category: string;
  reminder: string;
  color: string;
  dailyReminder: boolean;
  targetDates: string[];
  notes: string;
}

export type Page = 'dashboard' | 'calendar' | 'settings';
export type Theme = 'violet' | 'cyan' | 'yellow' | 'green';

export interface Settings {
  notifications: boolean;
  soundEffects: boolean;
  weekStartsMonday: boolean;
  showStreak: boolean;
  theme: Theme;
  onboarded: boolean;
}