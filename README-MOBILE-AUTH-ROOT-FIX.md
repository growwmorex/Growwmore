# Growwmore Mobile Auth Root Fix

- Waits for the original Growwmore tab to become visible/focused after Google account selection.
- Firestore member bootstrap starts only after the page is active again.
- Centralizes member creation/read/routing.
- Narrows retries to genuine lifecycle/network errors.
- Permission-denied is no longer misclassified as a temporary browser pause.
- Email/password login uses the same stable bootstrap flow.
