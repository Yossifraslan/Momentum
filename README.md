# Momentum

## Demo Link
https://momentum-six-lime.vercel.app/

## Overview

Momentum is a smart habit tracker that helps users build consistency through daily tracking, streak analysis, and energy-aware scheduling. Built in one week for the Shortcut Asia Internship Challenge 2026.

## Approach

My goal was to map out the two primary user flows (creating new habits and completing them each day) and to design my data model prior to building the user interface (UI). I felt it was more crucial to go deeper into a few of the proposed features than to rush and create multiple shallow features — this included building a useful energy scheduler and heatmap.

## Tech Stack

- **React 18 + TypeScript**: fully typed, component-based user interface
- **Vite**: fast development server and build tool
- **CSS Variables**: 4 accent colours for theming and dark/light mode
- **canvas-confetti**: completion celebration visual
- **localStorage**: persistence of habit data, settings and authentication data stored on client side (device)

## Why these tools

These technologies were selected as React and TypeScript are both the predominant technologies for creating frontend products and are reliable. I did not use UI libraries such as Tailwind or MUI to showcase my CSS skillset and create a smaller file size. I chose to use Vite instead of CRA due to its significantly better cold start times and HMR.

## Key Technical Decisions

1. **Custom hooks architecture**: `useAuth`, `useHabits`, `useSettings` separate all state logic from UI, making components clean and testable.
2. **Energy scheduler as a pure module**: `energyScheduler.ts` contains only pure functions with no React dependencies. It takes habit data and returns analysis results, making it portable and easy to unit test.
3. **String UUIDs for habit IDs**: using `crypto.randomUUID()` instead of `Date.now()` prevents ID collisions and aligns with database UUID conventions if migrated to a backend.
4. **Streak recalculation from source**: rather than incrementing/decrementing a counter, the streak is always recalculated from the full `completedDates` array. This prevents drift if a user unchecks a habit or data is modified.

## Key Feature Flows

- **Habit Completion Flow**
  - User clicks `Mark Done`
  - `toggleComplete(id)`
  - recalculate streak from dates array
  - update `completionRate`
  - fire confetti + sound
  - save to `localStorage`
  - re-render

- **Energy Scheduling Flow**
  - User completes habits at various times
  - `completionTimes[]` records hour
  - `analyzeEnergyWindows()` scores each hour 0–100
  - `suggestSchedule()` matches habit category to energy level
  - user applies suggestion
  - reminder time updated

## What I'd improve with more time

- Supabase backend with real OTP email auth and per-user cloud storage
- Push notifications for reminders using the Web Notifications API
- Unit tests for the energy scheduler and streak calculation logic
- PWA support so it installs like a native app on mobile