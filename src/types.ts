// Core data types for Habit Loop.

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: number;
  // Map of "YYYY-MM-DD" -> true for days the habit was completed.
  completedDates: Record<string, true>;
};

// What the user has unlocked. In production these flags are driven by the
// in-app-purchase / subscription receipts (see src/monetization.ts).
export type Entitlements = {
  // One-time "remove ads" purchase.
  adsRemoved: boolean;
  // Active premium subscription (unlimited habits, stats, themes).
  premium: boolean;
};
