# Habit Loop 🔁

A simple, polished **daily habit tracker** for iPhone & Android, built with
**Expo / React Native** (one codebase, both stores).

It's designed to make money two ways (both already wired into the code):

- **Remove Ads** — one-time purchase
- **Premium** — monthly/yearly subscription (unlimited habits, stats, no ads)

> The app runs **today** with a built-in *mock* for ads and purchases so you can
> test the full experience in Expo Go. Switching to real money is a config step —
> see [Going live](#going-live-real-money).

---

## What it does

- Add habits with an emoji + color, check them off each day
- Streaks (🔥) and a last-7-days view per habit
- Free plan: **3 habits** + a banner ad
- Premium: **unlimited habits**, a **Stats** screen (30-day completion %, best streak), no ads
- Light/dark mode, data saved on-device (AsyncStorage)

---

## Run it on your phone (5 minutes)

You do **not** need a Mac to try it.

1. Install **Node.js** (already set up here) and the **Expo Go** app from the
   App Store / Play Store on your phone.
2. In this folder, run:
   ```bash
   npm install      # first time only
   npm start
   ```
3. A QR code appears in the terminal. Open **Expo Go** and scan it
   (iPhone: scan with the Camera app). The app loads on your phone.

To open in a browser instead: `npm run web`.

---

## Project structure

```
App.tsx                  # root + simple screen navigation
src/
  types.ts               # Habit + Entitlements types
  theme.ts               # colors, emojis, light/dark palettes
  ThemeContext.tsx       # active theme (follows device dark mode)
  storage.ts             # save/load via AsyncStorage
  monetization.ts        # ⭐ ads + purchases live here (mock + TODOs)
  store.tsx              # app state: habits, streaks, entitlements
  components/
    HabitCard.tsx        # one habit row
    AdBanner.tsx         # banner ad slot
  screens/
    HomeScreen.tsx       # habit list
    AddHabitScreen.tsx   # create a habit
    StatsScreen.tsx      # premium stats
    PaywallScreen.tsx    # upgrade / buy screen
```

---

## Going live (real money)

Everything money-related is isolated in **`src/monetization.ts`**, marked with
`TODO (real)`. The short version:

**1. Ads — Google AdMob**
```bash
npx expo install react-native-google-mobile-ads
```
Create an AdMob account + ad units, then swap the placeholder in
`src/components/AdBanner.tsx` for a real `<BannerAd />`.

**2. Purchases & subscriptions — RevenueCat**
```bash
npx expo install react-native-purchases
```
Create these products in **App Store Connect** and **Google Play Console**,
then map them to RevenueCat entitlements `ads_removed` / `premium`:
- `habitloop_remove_ads` (one-time)
- `habitloop_premium_monthly`, `habitloop_premium_yearly` (subscriptions)

**3. Build real installable apps (needs a free Expo account):**
```bash
npm install -g eas-cli
eas login
eas build --profile development --platform all   # for testing ads/IAP
eas build --profile production --platform all     # for the stores
```

> Native ads/purchases do **not** work in Expo Go — you need a *development
> build* (the `eas build` step above) to test them on a device.

**4. Publish**
- Apple: $99/year Apple Developer Program → submit via `eas submit`
- Google: $25 one-time Play Console fee → submit via `eas submit`

---

## Honest expectations

The code is the easy 20%. Most of the money comes from **a good idea + getting
users** (App Store keywords, a TikTok/short-form presence, paid ads done
carefully). Ship something small, watch what real users do, and iterate.
