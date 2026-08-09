# Growwmore Production Auth + Onboarding Flow Fix

Reviewed full flow: Join/Login → Firebase Auth → member bootstrap → Collections → Payment → Founder approval → Dashboard/Admin.

Production architecture:
- Google uses popup on the current origin.
- After OAuth succeeds, no Firestore call runs on the OAuth-return page.
- App immediately moves to `/auth/complete` on the same Vercel origin.
- Firebase browserLocalPersistence restores the user there.
- `/auth/complete` creates/reads member once and routes by state.
- Redirect-auth third-party storage dependency is removed.
- Email/password shares the same bootstrap.
- Collections, Payment and Dashboard enforce the same state machine.
- Payment submit is locked while writing and retries only transient Firestore failures.

Routing contract:
No user → /login
Founder → /admin-gateway
Authenticated, no bundle → /collections
Bundle selected/pending → /payment
Approved → /dashboard

No Firestore security rule relaxation is included.
