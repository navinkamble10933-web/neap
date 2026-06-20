// Main screen: list of habits, header with date, add button, premium nav.
import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../ThemeContext';
import { FREE_HABIT_LIMIT } from '../monetization';
import HabitCard from '../components/HabitCard';

type Props = {
  onAdd: () => void;
  onStats: () => void;
  onUpgrade: () => void;
};

export default function HomeScreen({ onAdd, onStats, onUpgrade }: Props) {
  const { habits, canAddHabit, isPremium, deleteHabit } = useStore();
  const theme = useTheme();

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const doneCount = habits.filter((h) => {
    const k = new Date().toISOString().slice(0, 10);
    return h.completedDates[k];
  }).length;

  function handleAdd() {
    if (!canAddHabit) {
      Alert.alert(
        'Habit limit reached',
        `The free plan allows ${FREE_HABIT_LIMIT} habits. Upgrade to Premium for unlimited habits.`,
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'See Premium', onPress: onUpgrade },
        ]
      );
      return;
    }
    onAdd();
  }

  function confirmDelete(id: string, name: string) {
    Alert.alert('Delete habit', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(id) },
    ]);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.date, { color: theme.subtext }]}>{dateLabel}</Text>
          <Text style={[styles.title, { color: theme.text }]}>
            {habits.length === 0
              ? 'Habit Loop'
              : `${doneCount}/${habits.length} done today`}
          </Text>
        </View>
        <Pressable onPress={onStats} style={[styles.iconBtn, { borderColor: theme.border }]}>
          <Text style={styles.iconTxt}>{isPremium ? '📊' : '🔒'}</Text>
        </Pressable>
      </View>

      {!isPremium && (
        <Pressable onPress={onUpgrade} style={[styles.upsell, { backgroundColor: theme.accent }]}>
          <Text style={styles.upsellTxt}>✨ Go Premium — unlimited habits, stats & no ads</Text>
        </Pressable>
      )}

      <FlatList
        data={habits}
        keyExtractor={(h) => h.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <HabitCard habit={item} onLongPress={() => confirmDelete(item.id, item.name)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No habits yet</Text>
            <Text style={[styles.emptyText, { color: theme.subtext }]}>
              Tap the + button to add your first habit and start a streak.
            </Text>
          </View>
        }
        ListFooterComponent={
          habits.length > 0 ? (
            <Text style={[styles.hint, { color: theme.subtext }]}>
              Tip: long-press a habit to delete it.
            </Text>
          ) : null
        }
      />

      <Pressable onPress={handleAdd} style={[styles.fab, { backgroundColor: theme.accent }]}>
        <Text style={styles.fabTxt}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  date: { fontSize: 13, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800', marginTop: 2 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  iconTxt: { fontSize: 20 },
  upsell: { marginHorizontal: 20, marginBottom: 8, padding: 12, borderRadius: 12 },
  upsellTxt: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  list: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  hint: { textAlign: 'center', fontSize: 12, marginTop: 4 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabTxt: { color: '#fff', fontSize: 32, fontWeight: '300', marginTop: -2 },
});
