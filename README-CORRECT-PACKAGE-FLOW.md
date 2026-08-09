# Correct Growwmore package flow

This correction preserves the homepage package carousel.

## Exact flow
Homepage
→ Create Account
→ Google/email signup
→ `/auth/complete`
→ `/products` private Package Selection page
→ choose one of ₹5,000 / ₹8,000 / ₹10,000 / ₹12,000 / ₹15,000
→ `/payment?package=...`
→ submit UTR
→ founder approval
→ Dashboard

## Homepage
The existing package carousel stays on the homepage as a preview only.
This patch adds manual Previous/Next arrows, dots and auto-advance so a user can move backward after the carousel advances.

## Important
Do not route a newly created user back to the homepage package carousel.
The authenticated selection destination remains `/products`.
