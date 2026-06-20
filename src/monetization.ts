/**
 * MONETIZATION LAYER
 * ------------------
 * This file is the single place that talks to ads and in-app purchases.
 * The rest of the app only imports from here, so you can swap the mock
 * implementation for real SDKs without touching any screens.
 *
 * Right now it ships with a MOCK implementation so the app runs instantly
 * in Expo Go (where native ad/purchase SDKs are not available).
 *
 * ============================================================
 *  GOING LIVE — what to replace (see TODO markers below)
 * ============================================================
 *
 * 1) ADS — Google AdMob
 *    npx expo install react-native-google-mobile-ads
 *    - Create an AdMob account, register the app, create ad units.
 *    - Add your app IDs to app.json under the plugin config.
 *    - Requires a *development build* (not Expo Go):  eas build --profile development
 *    Docs: https://docs.page/invertase/react-native-google-mobile-ads
 *
 * 2) PURCHASES — RevenueCat (easiest) wraps StoreKit (iOS) + Play Billing (Android)
 *    npx expo install react-native-purchases
 *    - Create products in App Store Connect AND Google Play Console:
 *        habitloop_remove_ads   (one-time / non-consumable)
 *        habitloop_premium_yearly  (auto-renewing subscription)
 *        habitloop_premium_monthly (auto-renewing subscription)
 *    - Map them to RevenueCat "entitlements": `ads_removed` and `premium`.
 *    Docs: https://www.revenuecat.com/docs/getting-started
 *
 * Pricing suggestions (adjust per market):
 *    Remove ads:     $2.99 one-time
 *    Premium yearly: $19.99/yr  (best value, push this one)
 *    Premium monthly:$2.99/mo
 */

import type { Entitlements } from './types';

// The free plan caps habits; premium removes the cap.
export const FREE_HABIT_LIMIT = 3;

export type Product = {
  id: string;
  title: string;
  price: string; // display string, e.g. "$2.99"
  period?: string; // e.g. "year", "month"
  unlocks: 'adsRemoved' | 'premium';
  highlight?: boolean;
};

// These would normally be fetched from the store so prices are localized.
export const PRODUCTS: Product[] = [
  {
    id: 'habitloop_premium_yearly',
    title: 'Premium — Yearly',
    price: '$19.99',
    period: 'year',
    unlocks: 'premium',
    highlight: true,
  },
  {
    id: 'habitloop_premium_monthly',
    title: 'Premium — Monthly',
    price: '$2.99',
    period: 'month',
    unlocks: 'premium',
  },
  {
    id: 'habitloop_remove_ads',
    title: 'Remove Ads (one-time)',
    price: '$2.99',
    unlocks: 'adsRemoved',
  },
];

/**
 * Purchase a product.
 *
 * MOCK: instantly grants the entitlement so you can test the full flow.
 *
 * TODO (real): call Purchases.purchaseStoreProduct(...) and then read the
 * customer's entitlements from the returned customerInfo.
 */
export async function purchase(product: Product, current: Entitlements): Promise<Entitlements> {
  // --- BEGIN MOCK ---
  await new Promise((r) => setTimeout(r, 600)); // simulate store sheet
  const next = { ...current };
  if (product.unlocks === 'premium') {
    next.premium = true;
    next.adsRemoved = true; // premium implies no ads
  } else {
    next.adsRemoved = true;
  }
  return next;
  // --- END MOCK ---

  // TODO (real) example with react-native-purchases:
  // const { customerInfo } = await Purchases.purchaseProduct(product.id);
  // return entitlementsFromCustomerInfo(customerInfo);
}

/**
 * Restore previous purchases (required by both app stores).
 *
 * TODO (real): const info = await Purchases.restorePurchases();
 *              return entitlementsFromCustomerInfo(info);
 */
export async function restore(current: Entitlements): Promise<Entitlements> {
  await new Promise((r) => setTimeout(r, 600));
  return current; // MOCK: nothing to restore
}

/**
 * Whether banner/interstitial ads should be shown.
 * Ads are off if the user removed ads OR has premium.
 */
export function shouldShowAds(ent: Entitlements): boolean {
  return !ent.adsRemoved && !ent.premium;
}
