# Growwmore Premium Payment Checkout

This patch upgrades only the payment experience and keeps the working auth/package flow intact.

Flow:
Homepage → Create Account → `/auth/complete` → `/products` package selection → `/payment?package=...` → UTR submission → Founder approval → Dashboard.

Included:
- Selected package summary
- Full included-product list
- Total payable
- Future published referral commission
- Official UPI QR
- UPI ID
- Payment number
- Support phone
- Support email
- Security warning
- Change Package button before submission
- UTR form
- Double-submit protection
- Firestore retry on writes
- Pending founder-verification state
- Approved accounts redirect directly to Dashboard
