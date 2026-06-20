// Global app state: habits + entitlements, persisted to AsyncStorage.
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Habit, Entitlements } from './types';
import * as storage from './storage';
import * as iap from './monetization';
import { habitColors, habitEmojis } from './theme';

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function dayKey(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return todayKey(d);
}

// Current consecutive-day streak ending today (or yesterday).
export function currentStreak(habit: Habit): number {
  let streak = 0;
  // Allow the streak to count if today isn't done yet but yesterday was.
  const startedToday = habit.completedDates[dayKey(0)];
  let offset = startedToday ? 0 : 1;
  while (habit.completedDates[dayKey(offset)]) {
    streak += 1;
    offset += 1;
  }
  return streak;
}

type Store = {
  ready: boolean;
  habits: Habit[];
  entitlements: Entitlements;
  isPremium: boolean;
  canAddHabit: boolean;
  addHabit: (name: string, emoji?: string, color?: string) => void;
  toggleToday: (id: string) => void;
  deleteHabit: (id: string) => void;
  buy: (product: iap.Product) => Promise<void>;
  restore: () => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entitlements, setEntitlements] = useState<Entitlements>({ adsRemoved: false, premium: false });

  useEffect(() => {
    (async () => {
      const [h, e] = await Promise.all([storage.loadHabits(), storage.loadEntitlements()]);
      setHabits(h);
      setEntitlements(e);
      setReady(true);
    })();
  }, []);

  // Persist on change (after initial load).
  useEffect(() => {
    if (ready) storage.saveHabits(habits);
  }, [habits, ready]);
  useEffect(() => {
    if (ready) storage.saveEntitlements(entitlements);
  }, [entitlements, ready]);

  const canAddHabit = entitlements.premium || habits.length < iap.FREE_HABIT_LIMIT;

  const addHabit = useCallback((name: string, emoji?: string, color?: string) => {
    const habit: Habit = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      emoji: emoji || habitEmojis[Math.floor(Math.random() * habitEmojis.length)],
      color: color || habitColors[Math.floor(Math.random() * habitColors.length)],
      createdAt: Date.now(),
      completedDates: {},
    };
    setHabits((prev) => [...prev, habit]);
  }, []);

  const toggleToday = useCallback((id: string) => {
    const key = todayKey();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const completed = { ...h.completedDates };
        if (completed[key]) delete completed[key];
        else completed[key] = true;
        return { ...h, completedDates: completed };
      })
    );
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const buy = useCallback(
    async (product: iap.Product) => {
      const next = await iap.purchase(product, entitlements);
      setEntitlements(next);
    },
    [entitlements]
  );

  const restore = useCallback(async () => {
    const next = await iap.restore(entitlements);
    setEntitlements(next);
  }, [entitlements]);

  const value: Store = {
    ready,
    habits,
    entitlements,
    isPremium: entitlements.premium,
    canAddHabit,
    addHabit,
    toggleToday,
    deleteHabit,
    buy,
    restore,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
