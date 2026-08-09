import { GoogleAuthProvider, browserLocalPersistence, setPersistence, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
const INTENT_KEY="growwmore_google_intent"; const REFERRAL_KEY="growwmore_google_referral";
export type GoogleIntent="login"|"join";
export async function prepareAuthPersistence(){await setPersistence(auth,browserLocalPersistence);}
export function saveGoogleContext(intent:GoogleIntent,referral=""){if(typeof window==="undefined")return;sessionStorage.setItem(INTENT_KEY,intent);if(referral)sessionStorage.setItem(REFERRAL_KEY,referral);else sessionStorage.removeItem(REFERRAL_KEY);}
export function readGoogleContext(){if(typeof window==="undefined")return {intent:"login" as GoogleIntent,referral:""};const raw=sessionStorage.getItem(INTENT_KEY);return {intent:(raw==="join"?"join":"login") as GoogleIntent,referral:sessionStorage.getItem(REFERRAL_KEY)||""};}
export function clearGoogleContext(){if(typeof window==="undefined")return;sessionStorage.removeItem(INTENT_KEY);sessionStorage.removeItem(REFERRAL_KEY);}
export async function startGooglePopup(intent:GoogleIntent,referral=""){await prepareAuthPersistence();saveGoogleContext(intent,referral);const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:"select_account"});const result=await signInWithPopup(auth,provider);window.location.replace("/auth/complete");return result.user;}
