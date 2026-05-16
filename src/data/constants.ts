import type { HabitForm, Settings } from '../types/index';

export const COLORS = [
  { label: 'Violet', hex: '#7c3aed' },
  { label: 'Blue',   hex: '#3b82f6' },
  { label: 'Green',  hex: '#22c55e' },
  { label: 'Pink',   hex: '#ec4899' },
  { label: 'Orange', hex: '#f97316' },
  { label: 'Amber',  hex: '#eab308' },
];

export const CATEGORIES = [
  'Health',
  'Fitness',
  'Study',
  'Productivity',
  'Mindfulness',
];

export const ICONS: Record<string, string> = {
  Health:       '💧',
  Fitness:      '🏋️',
  Study:        '📚',
  Productivity: '💻',
  Mindfulness:  '🧘',
};

export const QUOTES = [
  'Small progress is still progress.',
  'Consistency beats intensity.',
  'Discipline creates freedom.',
  'One step every day matters.',
  'Your future self will thank you.',
  'The secret is to start.',
  'Focus on progress, not perfection.',
  'Show up every day, no matter what.',
  'Great things never come from comfort zones.',
  'Push yourself, because no one else will.',
];

export const DEFAULT_FORM: HabitForm = {
  name:          '',
  category:      'Health',
  reminder:      '08:00',
  color:         COLORS[0].hex,
  dailyReminder: true,
  targetDates:   [],
  notes:         '',
};

export const DEFAULT_SETTINGS: Settings = {
  notifications:    true,
  soundEffects:     true,
  weekStartsMonday: true,
  showStreak:       true,
  theme:            'violet',
  onboarded:        false,
};

export const THEMES = {
  violet: { label: 'Violet', accent: '#7c3aed', light: '#a78bfa' },
  cyan:   { label: 'Cyan',   accent: '#06b6d4', light: '#67e8f9' },
  yellow: { label: 'Yellow', accent: '#ca8a04', light: '#fde047' },
  green:  { label: 'Green',  accent: '#16a34a', light: '#86efac' },
};

export const ONBOARDING_STEPS = [
  {
    emoji: '🎯',
    title: 'Set your goals',
    desc:  'Choose habits that matter to you — health, fitness, study, or mindfulness.',
  },
  {
    emoji: '➕',
    title: 'Create your first habit',
    desc:  'Give it a name, pick a reminder time, and choose whether it repeats daily.',
  },
  {
    emoji: '🔥',
    title: 'Build your streak',
    desc:  'Mark habits done every day to build streaks and track your progress over time.',
  },
];