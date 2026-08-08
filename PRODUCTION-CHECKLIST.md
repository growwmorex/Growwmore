# Growwmore Production Checklist

1. Create/confirm Firebase project `growwmore-1d808`.
2. Enable Email/Password Authentication.
3. Create Firestore database in production mode.
4. Deploy `firestore.rules` using Firebase CLI.
5. Add all `NEXT_PUBLIC_FIREBASE_*` values to Vercel Production/Preview/Development environments.
6. Create the founder login in Firebase Authentication using the configured admin email.
7. Deploy to Vercel and verify `/`, `/join`, `/login`, `/payment`, `/dashboard`, `/admin`.
8. Submit a low-risk test transaction reference; verify admin approval unlocks the member dashboard.
9. Verify referral commission credit only after an eligible referred payment is approved.
10. Verify withdrawal request → founder review → paid status updates the wallet atomically.
11. Test mobile navigation and legal/support pages.
12. Never commit private service-account keys or passwords.

Firestore collections are created automatically when their first document is written:
`members`, `payments`, `withdrawals`, `packageCatalog`.
