# Apply Growwmore Final Luxury Fix

Overlay this ZIP into the current Growwmore repository root.

After overlay:

```bash
npm install
npm run typecheck
npm run build
firebase deploy --only firestore:rules --project growwmore-1d808
```

Firebase Console → Authentication → Sign-in method:
- Enable Email/Password
- Enable Google
- Ensure the Vercel production domain is listed under Authorized domains

Then push the changed files to GitHub; Vercel will redeploy from `main`.

Founder access supports:
- sydri63@gmail.com
- syedafsharkhadri63@gmail.com (legacy safety access)
