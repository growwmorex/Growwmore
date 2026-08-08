export function friendlyAuthError(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error || "");
  if (raw.includes("auth/unauthorized-domain")) {
    const host = typeof window !== "undefined" ? window.location.hostname : "your-live-domain";
    return `Google sign-in is blocked for this hostname: ${host}. Add this exact hostname in Firebase Console → growwmore-1d808 → Authentication → Settings → Authorized domains. Do not include https:// or a trailing slash.`;
  }
  if (raw.includes("auth/invalid-credential")) return "Email or password is incorrect.";
  if (raw.includes("auth/too-many-requests")) return "Too many attempts. Please wait and try again.";
  if (raw.includes("auth/popup-closed-by-user")) return "Google sign-in window was closed before completion.";
  if (raw.includes("auth/popup-blocked")) return "Your browser blocked the Google sign-in popup. Allow popups and try again.";
  if (raw.includes("auth/network-request-failed")) return "Network error while contacting Firebase. Check your connection and try again.";
  return raw || "Authentication failed. Please try again.";
}
