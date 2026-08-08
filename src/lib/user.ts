import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";

export type Member = {
  uid:string; email:string; fullName:string; phone:string; referralCode:string;
  referredBy:string|null; paymentStatus:"not_submitted"|"pending"|"approved"|"rejected";
  packageId:string|null; packagePrice:number; utr:string|null; commission:number;
  totalEarning:number; withdrawnAmount:number; createdAt?:unknown; updatedAt?:unknown;
};

export const memberRef = (uid:string) => doc(db,"members",uid);

export async function ensureMember(user:User, fullName="", phone="", referredBy:string|null=null) {
  const ref=memberRef(user.uid), snap=await getDoc(ref);
  if (snap.exists()) return snap.data() as Member;
  const referralCode=("GM"+user.uid.replace(/[^a-zA-Z0-9]/g,"").slice(0,8)).toUpperCase();
  const member:Member={
    uid:user.uid,email:user.email||"",fullName:fullName||user.displayName||"",phone,
    referralCode,referredBy,paymentStatus:"not_submitted",packageId:null,packagePrice:0,
    utr:null,commission:0,totalEarning:0,withdrawnAmount:0,createdAt:serverTimestamp(),updatedAt:serverTimestamp()
  };
  await setDoc(ref,member);
  return member;
}
