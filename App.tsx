// Root component. Simple state-based navigation (no extra nav dependency).
import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StoreProvider, useStore } from './src/store';
import { ThemeProvider, useTheme } from './src/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';
import StatsScreen from './src/screens/StatsScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import AdBanner from './src/components/AdBanner';

function Root() {
  const { ready, isPremium } = useStore();
  const theme = useTheme();
  const [showAdd, setShowAdd] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  if (!ready) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  function openStats() {
    if (isPremium) setShowStats(true);
    else setShowPaywall(true);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <HomeScreen
        onAdd={() => setShowAdd(true)}
        onStats={openStats}
        onUpgrade={() => setShowPaywall(true)}
      />
      <AdBanner />

      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowAdd(false)}>
        <AddHabitScreen onClose={() => setShowAdd(false)} />
      </Modal>

      <Modal visible={showStats} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowStats(false)}>
        <StatsScreen onClose={() => setShowStats(false)} />
      </Modal>

      <Modal visible={showPaywall} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowPaywall(false)}>
        <PaywallScreen onClose={() => setShowPaywall(false)} />
      </Modal>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <Root />
      </StoreProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
