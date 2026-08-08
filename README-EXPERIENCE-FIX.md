# Growwmore Experience Fix

This delta was built against the latest uploaded Growwmore main source.

## Included
- New Black Olive / Marble / Mineral Green / Porcelain visual system
- Hierarchical homepage sections instead of one repeated card treatment
- Read-more cards for detailed content without overloading each card
- Existing local loop video + rotating Pexels stock-image layers
- `src/lib/stockMedia.ts` central stock-media registry
- More detailed hero, vision, model, artist-first policy and trust sections
- More robust email/Google login messaging
- `/forgot-password` Firebase password-reset screen
- Forgot-password links on login and signup
- Member referral link generated from current live origin
- Copy referral link
- WhatsApp, Facebook, X share links + Instagram/Snapchat launch actions
- Consistent palette throughout auth, collections, cards and dashboard

## Stock media
Remote Pexels images are loaded in the browser. The registry includes attribution metadata. The existing local `public/growwmore-luxury-loop.mp4` remains the looping video layer.

## Apply
Overlay the contents of this ZIP on the current repo, then run:
`npm run typecheck`
`npm run build`
