// Simple light/dark theme + the palette used when creating habits.

export const palette = {
  blue: '#3B82F6',
  green: '#22C55E',
  orange: '#F97316',
  red: '#EF4444',
  purple: '#A855F7',
  pink: '#EC4899',
  teal: '#14B8A6',
  amber: '#F59E0B',
};

export const habitColors = Object.values(palette);

export const habitEmojis = [
  '💪', '🏃', '📚', '💧', '🧘', '🥗', '😴', '🧹',
  '✍️', '🎯', '🦷', '🚭', '💰', '🎸', '🌱', '☀️',
];

export type Theme = {
  bg: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  accent: string;
  danger: string;
};

export const lightTheme: Theme = {
  bg: '#F4F5F7',
  card: '#FFFFFF',
  text: '#111827',
  subtext: '#6B7280',
  border: '#E5E7EB',
  accent: palette.blue,
  danger: palette.red,
};

export const darkTheme: Theme = {
  bg: '#0B1120',
  card: '#1E293B',
  text: '#F1F5F9',
  subtext: '#94A3B8',
  border: '#334155',
  accent: palette.blue,
  danger: palette.red,
};
