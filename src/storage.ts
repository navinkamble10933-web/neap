// Thin wrapper around AsyncStorage for persisting habits + entitlements.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Habit, Entitlements } from './types';

const HABITS_KEY = 'habitloop:habits';
const ENTITLEMENTS_KEY = 'habitloop:entitlements';

export async function loadHabits(): Promise<Habit[]> {
  try {
    const raw = await AsyncStorage.getItem(HABITS_KEY);
    return raw ? (JSON.parse(raw) as Habit[]) : [];
  } catch {
    return [];
  }
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch {
    // Ignore write failures; data stays in memory for this session.
  }
}

export async function loadEntitlements(): Promise<Entitlements> {
  try {
    const raw = await AsyncStorage.getItem(ENTITLEMENTS_KEY);
    return raw ? (JSON.parse(raw) as Entitlements) : { adsRemoved: false, premium: false };
  } catch {
    return { adsRemoved: false, premium: false };
  }
}

export async function saveEntitlements(ent: Entitlements): Promise<void> {
  try {
    await AsyncStorage.setItem(ENTITLEMENTS_KEY, JSON.stringify(ent));
  } catch {
    // Ignore write failures.
  }
}
