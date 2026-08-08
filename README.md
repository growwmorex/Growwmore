# Growwmore — Phase 1

Production-oriented Next.js + Firebase foundation for Growwmore.

## Included in Phase 1
- Luxury responsive marketing website using Silver / Stone / Slate / Charcoal / Graphite palette
- Five launch product collections (names/pricing/commissions from supplied references)
- Email/password Firebase Authentication
- UPI/UTR payment submission
- Payment-gated dashboard access
- Founder admin payment approval
- Direct referral commission credit on approved eligible payment
- Firestore security rules
- No supplied product-reference photos are shipped in the website

## Firebase collections created automatically
No manual collection creation is required. Firestore creates collections/documents on first write:
- `members/{uid}`
- `payments/{uid}`

## Firebase Console setup required once
1. Authentication → Sign-in method → enable Email/Password.
2. Firestore Database → create production database.
3. Create the admin Auth user `syedafsharkhadri63@gmail.com` with a strong password you control.
4. Deploy `firestore.rules` with Firebase CLI:
   `firebase deploy --only firestore:rules`

## Local / Vercel
Copy `.env.example` to `.env.local`. The supplied Firebase web configuration is already represented as environment variables. Add the same variables in Vercel Project Settings → Environment Variables.

Then:
`npm install`
`npm run typecheck`
`npm run build`
`npm run dev`

## Important
Firebase web API keys are public client identifiers by design; authorization is enforced by Firebase Auth + Firestore Security Rules. Never put service-account private keys in NEXT_PUBLIC variables.

Phase 2 should expand the authenticated member dashboard with wallet ledger, withdrawals, profile/payout settings, referral history, and real-time earnings.


## Phase 2 additions
- Auth-gated dashboard navigation
- Earnings overview
- Referral tracking
- Wallet balance
- UPI / bank withdrawal requests
- Withdrawal history
- Payout profile
- Founder withdrawal processing
- Atomic payout balance update
- Firestore `withdrawals` collection (created automatically on first request)


## Phase 3 additions
- Founder Admin OS dashboard
- Member CRM/search and account enable/disable control
- Payment approval workspace
- Package Catalog manager backed by Firestore `packageCatalog`
- Referral activity ledger
- Withdrawal processing workspace
- Finance overview
- Admin navigation and protected admin routes

`packageCatalog` is automatically created by Firestore on the first package save.


## Phase 4 — Final production layer
- Global loading/error/404 states
- Support center
- Terms, Privacy and Refund pages
- Public footer
- Security response headers
- Responsive/reduced-motion polish
- Production deployment checklist

Important: “production-ready source” still requires your own Firebase Authentication/Firestore setup and Vercel environment variables before it is actually live.
