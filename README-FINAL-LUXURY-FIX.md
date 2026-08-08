# Growwmore Final Luxury & Flow Fix

This package is based on the uploaded latest Growwmore GitHub source.

## Included
- Aubergine + Black Olive + Champagne luxury visual system
- Animated MP4 background loop
- Detailed homepage: vision, platform explanation, artist-first model, member journey and transparency
- Cursor-reactive “book bundle” cards
- Email/password registration with Firebase verification email
- Continue with Google registration/sign-in
- Dedicated post-signup `/collections` bundle room
- Flow: Account → Collections → Payment → Admin approval → Dashboard
- Static UPI QR for `tradewithsyed@ybl` and displayed payment phone
- Founder gateway supporting both `sydri63@gmail.com` and legacy `syedafsharkhadri63@gmail.com`
- Founder gets complimentary dashboard + Admin OS entry
- Member profile name, phone and compressed-size image upload stored in member profile
- Detailed Terms, Privacy, No-Refund, Referral Terms and Commission Terms
- Hardened Firestore rules matching the revised flow

## Required Firebase Console setting
Authentication → Sign-in method:
1. Enable Email/Password
2. Enable Google
3. Add your Vercel production domain to Authentication → Settings → Authorized domains if it is not already present.

## Deploy updated rules
`firebase deploy --only firestore:rules --project growwmore-1d808`

## Test
`npm install && npm run typecheck && npm run build`

The UPI QR contains a payee URI without a fixed amount; the selected bundle amount remains displayed on the payment page.
