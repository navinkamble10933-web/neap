// Modal screen to create a habit: name, emoji, color.
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../ThemeContext';
import { habitColors, habitEmojis } from '../theme';

export default function AddHabitScreen({ onClose }: { onClose: () => void }) {
  const { addHabit } = useStore();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(habitEmojis[0]);
  const [color, setColor] = useState(habitColors[0]);

  function save() {
    if (!name.trim()) return;
    addHabit(name, emoji, color);
    onClose();
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.topbar}>
        <Pressable onPress={onClose} hitSlop={10}>
          <Text style={[styles.cancel, { color: theme.subtext }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>New Habit</Text>
        <Pressable onPress={save} hitSlop={10} disabled={!name.trim()}>
          <Text style={[styles.save, { color: name.trim() ? theme.accent : theme.subtext }]}>Save</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={[styles.preview, { backgroundColor: color + '22' }]}>
          <Text style={styles.previewEmoji}>{emoji}</Text>
        </View>

        <Text style={[styles.label, { color: theme.subtext }]}>NAME</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Drink water, Read 10 pages"
          placeholderTextColor={theme.subtext}
          style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={save}
        />

        <Text style={[styles.label, { color: theme.subtext }]}>ICON</Text>
        <View style={styles.grid}>
          {habitEmojis.map((e) => (
            <Pressable
              key={e}
              onPress={() => setEmoji(e)}
              style={[
                styles.emojiCell,
                { backgroundColor: theme.card, borderColor: theme.border },
                emoji === e && { borderColor: theme.accent, borderWidth: 2 },
              ]}
            >
              <Text style={styles.emojiCellTxt}>{e}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.subtext }]}>COLOR</Text>
        <View style={styles.grid}>
          {habitColors.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={[styles.colorCell, { backgroundColor: c }, color === c && styles.colorSelected]}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: { fontSize: 17, fontWeight: '800' },
  cancel: { fontSize: 16 },
  save: { fontSize: 16, fontWeight: '700' },
  body: { padding: 20, paddingTop: 4 },
  preview: { alignSelf: 'center', width: 80, height: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  previewEmoji: { fontSize: 40 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 16, letterSpacing: 0.5 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  emojiCell: { width: 52, height: 52, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  emojiCellTxt: { fontSize: 24 },
  colorCell: { width: 44, height: 44, borderRadius: 22 },
  colorSelected: { borderWidth: 3, borderColor: '#fff', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 3, elevation: 3 },
});
