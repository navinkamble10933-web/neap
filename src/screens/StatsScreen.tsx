// Premium-only stats: completion rate + per-habit streaks (last 30 days).
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useStore, currentStreak, todayKey } from '../store';
import { useTheme } from '../ThemeContext';

function last30Rate(completedDates: Record<string, true>): number {
  let hits = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (completedDates[todayKey(d)]) hits++;
  }
  return Math.round((hits / 30) * 100);
}

export default function StatsScreen({ onClose }: { onClose: () => void }) {
  const { habits } = useStore();
  const theme = useTheme();

  const totalDone = habits.reduce((sum, h) => sum + Object.keys(h.completedDates).length, 0);
  const bestStreak = habits.reduce((max, h) => Math.max(max, currentStreak(h)), 0);
  const overallRate =
    habits.length === 0
      ? 0
      : Math.round(habits.reduce((s, h) => s + last30Rate(h.completedDates), 0) / habits.length);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.topbar}>
        <Text style={[styles.title, { color: theme.text }]}>📊 Stats</Text>
        <Pressable onPress={onClose} hitSlop={10}>
          <Text style={[styles.done, { color: theme.accent }]}>Done</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.row}>
          <Stat theme={theme} value={`${overallRate}%`} label="30-day rate" />
          <Stat theme={theme} value={`${bestStreak}`} label="Best streak" />
          <Stat theme={theme} value={`${totalDone}`} label="Total check-ins" />
        </View>

        <Text style={[styles.section, { color: theme.subtext }]}>BY HABIT</Text>
        {habits.map((h) => {
          const rate = last30Rate(h.completedDates);
          return (
            <View key={h.id} style={[styles.habitRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={styles.habitEmoji}>{h.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.habitName, { color: theme.text }]} numberOfLines={1}>{h.name}</Text>
                <View style={[styles.barBg, { backgroundColor: theme.border }]}>
                  <View style={[styles.barFill, { width: `${rate}%`, backgroundColor: h.color }]} />
                </View>
              </View>
              <Text style={[styles.rate, { color: theme.subtext }]}>{rate}%</Text>
            </View>
          );
        })}
        {habits.length === 0 && (
          <Text style={[styles.empty, { color: theme.subtext }]}>Add habits to see your stats here.</Text>
        )}
      </ScrollView>
    </View>
  );
}

function Stat({ theme, value, label }: { theme: any; value: string; label: string }) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.subtext }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 22, fontWeight: '800' },
  done: { fontSize: 16, fontWeight: '700' },
  body: { padding: 20, paddingTop: 4 },
  row: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 14, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 4, textAlign: 'center' },
  section: { fontSize: 12, fontWeight: '700', marginTop: 24, marginBottom: 10, letterSpacing: 0.5 },
  habitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  habitEmoji: { fontSize: 22 },
  habitName: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  barBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  rate: { fontSize: 13, fontWeight: '700', width: 40, textAlign: 'right' },
  empty: { textAlign: 'center', marginTop: 40 },
});
