# Growwmore Mobile Redirect Auth Final Fix

The previous lifecycle patch still used `signInWithPopup()` on mobile. That is the key remaining problem.

This patch:
- Uses Firebase `signInWithRedirect()` on mobile/coarse-pointer browsers.
- Keeps `signInWithPopup()` on desktop.
- Uses `browserLocalPersistence`.
- Completes redirect with `getRedirectResult()` after the full page returns.
- Stores only Growwmore's small auth intent/referral context in localStorage.
- Starts Firestore member bootstrap only after redirect completion on a fresh active page.
- Keeps email/password on the same persistent auth configuration.

Why this is different:
Mobile redirect replaces the page instead of backgrounding the original tab behind an OAuth popup, so Firestore is initialized fresh after Google returns.
