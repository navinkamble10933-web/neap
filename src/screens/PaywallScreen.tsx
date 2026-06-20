// Paywall: shows products and triggers purchases via the monetization layer.
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../ThemeContext';
import { PRODUCTS, Product } from '../monetization';

const FEATURES = [
  '♾️  Unlimited habits',
  '📊  Detailed stats & charts',
  '🚫  No ads',
  '🎨  More icons & colors',
];

export default function PaywallScreen({ onClose }: { onClose: () => void }) {
  const { buy, restore, entitlements } = useStore();
  const theme = useTheme();
  const [busy, setBusy] = useState<string | null>(null);

  async function handleBuy(p: Product) {
    setBusy(p.id);
    try {
      await buy(p);
      Alert.alert('Success 🎉', 'Your purchase is active. Enjoy!');
      onClose();
    } catch {
      Alert.alert('Purchase failed', 'Please try again.');
    } finally {
      setBusy(null);
    }
  }

  async function handleRestore() {
    setBusy('restore');
    await restore();
    setBusy(null);
    Alert.alert('Restore', 'Purchases restored (if any were found).');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Pressable onPress={onClose} hitSlop={10} style={styles.close}>
        <Text style={[styles.closeTxt, { color: theme.subtext }]}>✕</Text>
      </Pressable>

      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>✨</Text>
        <Text style={[styles.heroTitle, { color: theme.text }]}>Habit Loop Premium</Text>
        <Text style={[styles.heroSub, { color: theme.subtext }]}>
          Build better habits with no limits.
        </Text>
      </View>

      <View style={styles.features}>
        {FEATURES.map((f) => (
          <Text key={f} style={[styles.feature, { color: theme.text }]}>{f}</Text>
        ))}
      </View>

      <View style={styles.products}>
        {PRODUCTS.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => handleBuy(p)}
            disabled={!!busy}
            style={[
              styles.product,
              { backgroundColor: theme.card, borderColor: theme.border },
              p.highlight && { borderColor: theme.accent, borderWidth: 2 },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.productTitle, { color: theme.text }]}>{p.title}</Text>
              {p.highlight && <Text style={[styles.badge, { color: theme.accent }]}>BEST VALUE</Text>}
            </View>
            {busy === p.id ? (
              <ActivityIndicator color={theme.accent} />
            ) : (
              <Text style={[styles.price, { color: theme.text }]}>
                {p.price}
                {p.period ? `/${p.period === 'year' ? 'yr' : 'mo'}` : ''}
              </Text>
            )}
          </Pressable>
        ))}
      </View>

      {entitlements.premium && (
        <Text style={[styles.active, { color: theme.accent }]}>✓ Premium is active</Text>
      )}

      <Pressable onPress={handleRestore} disabled={!!busy} style={styles.restore}>
        <Text style={[styles.restoreTxt, { color: theme.subtext }]}>Restore purchases</Text>
      </Pressable>

      <Text style={[styles.legal, { color: theme.subtext }]}>
        Subscriptions auto-renew until cancelled. Manage in your store account.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  close: { position: 'absolute', top: 16, right: 20, padding: 8 },
  closeTxt: { fontSize: 22, fontWeight: '600' },
  hero: { alignItems: 'center', marginBottom: 24 },
  heroEmoji: { fontSize: 48, marginBottom: 8 },
  heroTitle: { fontSize: 26, fontWeight: '900' },
  heroSub: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  features: { marginBottom: 24, gap: 12, alignSelf: 'center' },
  feature: { fontSize: 16, fontWeight: '600' },
  products: { gap: 12 },
  product: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 16, borderWidth: 1 },
  productTitle: { fontSize: 16, fontWeight: '700' },
  badge: { fontSize: 11, fontWeight: '800', marginTop: 4, letterSpacing: 0.5 },
  price: { fontSize: 18, fontWeight: '800' },
  active: { textAlign: 'center', marginTop: 16, fontWeight: '700' },
  restore: { marginTop: 16, alignItems: 'center' },
  restoreTxt: { fontSize: 14, textDecorationLine: 'underline' },
  legal: { fontSize: 11, textAlign: 'center', marginTop: 20, lineHeight: 16 },
});
