import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getRedirectResult,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  type UserCredential
} from "firebase/auth";
import { auth } from "./firebase";

const REDIRECT_INTENT_KEY = "growwmore_google_auth_intent";
const REDIRECT_REFERRAL_KEY = "growwmore_google_auth_referral";

export function isMobileAuthBrowser() {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const mobileUA = /Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(ua);
  const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  return mobileUA || (coarse && window.innerWidth <= 1024);
}

export async function prepareAuthPersistence() {
  await setPersistence(auth, browserLocalPersistence);
}

export function saveRedirectContext(intent: "login" | "join", referral = "") {
  if (typeof window === "undefined") return;
  localStorage.setItem(REDIRECT_INTENT_KEY, intent);
  if (referral) localStorage.setItem(REDIRECT_REFERRAL_KEY, referral);
  else localStorage.removeItem(REDIRECT_REFERRAL_KEY);
}

export function consumeRedirectContext() {
  if (typeof window === "undefined") return { intent: null as "login" | "join" | null, referral: "" };
  const rawIntent = localStorage.getItem(REDIRECT_INTENT_KEY);
  const intent = rawIntent === "join" || rawIntent === "login" ? rawIntent : null;
  const referral = localStorage.getItem(REDIRECT_REFERRAL_KEY) || "";
  localStorage.removeItem(REDIRECT_INTENT_KEY);
  localStorage.removeItem(REDIRECT_REFERRAL_KEY);
  return { intent, referral };
}

export async function beginGoogleAuth(intent: "login" | "join", referral = ""): Promise<UserCredential | null> {
  await prepareAuthPersistence();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  if (isMobileAuthBrowser()) {
    saveRedirectContext(intent, referral);
    await signInWithRedirect(auth, provider);
    return null;
  }

  return signInWithPopup(auth, provider);
}

export async function completeGoogleRedirect() {
  await prepareAuthPersistence();
  return getRedirectResult(auth);
}
