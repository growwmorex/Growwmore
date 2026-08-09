# Growwmore final admin identity + live approval + compact mobile fix

## 1. UID vs email
Firebase Authentication fundamentally uses immutable UID as the secure identity key, so the canonical `members/{uid}` document is intentionally kept unchanged.

To make Firebase Console human-readable, this patch creates:
`memberDirectory/{user-email}`

That directory maps:
email → UID → name → phone → payment status → package.

Admin screens are also email-first and show UID only as secondary technical information.

## 2. Approval now updates live
The payment page uses Firestore realtime listeners.

If Admin OS approves:
- `payments/{uid}.status` becomes approved
- `members/{uid}.paymentStatus` becomes approved
- user is redirected to `/dashboard` automatically.

If the founder manually changes ONLY the payment document to approved in Firebase Console:
- the user client detects the approved payment
- Firestore rules permit the user to synchronize `members/{uid}` to approved only because the corresponding payment doc is already approved
- dashboard opens automatically.

If the founder directly changes the member paymentStatus to approved:
- realtime member listener immediately redirects to Dashboard.

## 3. Mobile UI
Package cards, checkout cards, QR area and admin cards are significantly more compact on mobile while keeping the luxury visual system.
