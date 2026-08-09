import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";
import { isAdminEmail } from "./constants";
import { withFirestoreRetry } from "./firestoreRetry";

export type Member = {
  uid:string; email:string; fullName:string; phone:string; referralCode:string;
  referredBy:string|null; paymentStatus:"not_submitted"|"pending"|"approved"|"rejected";
  packageId:string|null; packagePrice:number; utr:string|null; commission:number;
  totalEarning:number; withdrawnAmount:number; photoDataUrl?:string; payoutProfile?:Record<string,string>;
  disabled?:boolean; createdAt?:unknown; updatedAt?:unknown; approvedAt?:unknown;
};

export const memberRef = (uid:string) => doc(db,"members",uid);
export const memberDirectoryRef = (email:string) => doc(db,"memberDirectory",email);

async function ensureEmailDirectory(user:User, member:Member){
  const email=user.email||member.email;
  if(!email) return;
  const ref=memberDirectoryRef(email);
  const snap=await withFirestoreRetry(()=>getDoc(ref));
  if(snap.exists()) return;
  await withFirestoreRetry(()=>setDoc(ref,{
    email,
    uid:user.uid,
    fullName:member.fullName||user.displayName||"Growwmore Member",
    phone:member.phone||"",
    paymentStatus:member.paymentStatus,
    packageId:member.packageId,
    createdAt:serverTimestamp(),
    updatedAt:serverTimestamp()
  }));
}

export async function ensureMember(user:User, fullName="", phone="", referredBy:string|null=null) {
  const ref=memberRef(user.uid);
  const snap=await withFirestoreRetry(()=>getDoc(ref));
  const admin=isAdminEmail(user.email);

  if (snap.exists()) {
    const existing=snap.data() as Member;
    if(admin && existing.paymentStatus!=="approved"){
      await withFirestoreRetry(()=>updateDoc(ref,{paymentStatus:"approved",approvedAt:serverTimestamp(),updatedAt:serverTimestamp()}));
      const approved={...existing,paymentStatus:"approved"} as Member;
      await ensureEmailDirectory(user,approved).catch(()=>undefined);
      return approved;
    }
    await ensureEmailDirectory(user,existing).catch(()=>undefined);
    return existing;
  }

  const referralCode=("GM"+user.uid.replace(/[^a-zA-Z0-9]/g,"").slice(0,8)).toUpperCase();
  const member:Member={
    uid:user.uid,email:user.email||"",fullName:fullName||user.displayName||"Growwmore Member",phone,
    referralCode,referredBy,paymentStatus:admin?"approved":"not_submitted",packageId:null,packagePrice:0,
    utr:null,commission:0,totalEarning:0,withdrawnAmount:0,photoDataUrl:user.photoURL||"",
    createdAt:serverTimestamp(),updatedAt:serverTimestamp()
  };

  await withFirestoreRetry(()=>setDoc(ref,member));
  await ensureEmailDirectory(user,member).catch(()=>undefined);
  return member;
}

export async function updateMemberProfile(uid:string, values:{fullName:string;phone:string;photoDataUrl:string}){
  await withFirestoreRetry(()=>updateDoc(memberRef(uid),{...values,updatedAt:serverTimestamp()}));
}
