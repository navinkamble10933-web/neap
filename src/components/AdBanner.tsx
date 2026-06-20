// Mock ad banner. Shows a placeholder where a real AdMob banner goes.
//
// TODO (real ads): replace the View below with:
//   import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
//   <BannerAd unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-XXX/YYY'}
//             size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStore } from '../store';
import { shouldShowAds } from '../monetization';
import { useTheme } from '../ThemeContext';

export default function AdBanner() {
  const { entitlements } = useStore();
  const theme = useTheme();
  if (!shouldShowAds(entitlements)) return null;

  return (
    <View style={[styles.banner, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.subtext }]}>Ad</Text>
      <Text style={[styles.text, { color: theme.subtext }]}>
        Your AdMob banner appears here · upgrade to remove
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 56,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: '#9CA3AF',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  text: { fontSize: 12 },
});
