// A single habit row: emoji, name, streak, last-7-days dots, and a check button.
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { Habit } from '../types';
import { useStore, todayKey, currentStreak } from '../store';
import { useTheme } from '../ThemeContext';

function last7Keys(): string[] {
  const keys: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.push(todayKey(d));
  }
  return keys;
}

export default function HabitCard({ habit, onLongPress }: { habit: Habit; onLongPress: () => void }) {
  const { toggleToday } = useStore();
  const theme = useTheme();
  const doneToday = !!habit.completedDates[todayKey()];
  const streak = currentStreak(habit);

  return (
    <Pressable
      onLongPress={onLongPress}
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={[styles.emojiWrap, { backgroundColor: habit.color + '22' }]}>
        <Text style={styles.emoji}>{habit.emoji}</Text>
      </View>

      <View style={styles.middle}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {habit.name}
        </Text>
        <View style={styles.dots}>
          {last7Keys().map((k) => (
            <View
              key={k}
              style={[
                styles.dot,
                { borderColor: theme.border },
                habit.completedDates[k] && { backgroundColor: habit.color, borderColor: habit.color },
              ]}
            />
          ))}
          <Text style={[styles.streak, { color: theme.subtext }]}>
            {streak > 0 ? `🔥 ${streak}` : 'Start today'}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => toggleToday(habit.id)}
        hitSlop={10}
        style={[
          styles.check,
          { borderColor: habit.color },
          doneToday && { backgroundColor: habit.color },
        ]}
      >
        <Text style={[styles.checkMark, { color: doneToday ? '#fff' : habit.color }]}>✓</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  emojiWrap: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 22 },
  middle: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1.5 },
  streak: { fontSize: 12, marginLeft: 6, fontWeight: '600' },
  check: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { fontSize: 18, fontWeight: '900' },
});
