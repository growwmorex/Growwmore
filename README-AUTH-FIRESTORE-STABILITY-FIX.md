# Growwmore Auth + Firestore Stability Fix

Included:
- Retry wrapper for transient Firestore/browser lifecycle errors.
- Waits briefly for the page to become visible again before retrying.
- Handles "database is closing", "database is hidden", offline/unavailable/network/IndexedDB transient errors.
- Applies retry logic to member creation, member lookup and profile updates.
- Prevents raw internal Firestore error strings from being shown to users.
- Stabilizes Google sign-in → member creation → route transition.
- Stabilizes dashboard member loading after browser tab/background transitions.

This does not bypass Firebase security rules or authentication.
