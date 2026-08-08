import type { User } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { ensureMember, memberRef } from "./user";
import { isAdminEmail } from "./constants";
import { withFirestoreRetry } from "./firestoreRetry";

const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));

export async function waitForActiveDocument(timeoutMs=5000){
  if(typeof document==="undefined") return;
  if(document.visibilityState==="visible" && document.hasFocus()){await sleep(180);return;}
  await new Promise<void>(resolve=>{
    let done=false;
    const finish=()=>{if(!done && document.visibilityState==="visible"){done=true;cleanup();resolve();}};
    const cleanup=()=>{document.removeEventListener("visibilitychange",finish);window.removeEventListener("focus",finish);};
    document.addEventListener("visibilitychange",finish);window.addEventListener("focus",finish);
    setTimeout(()=>{if(!done){done=true;cleanup();resolve();}},timeoutMs);
  });
  await sleep(300);
}

export async function bootstrapAuthenticatedUser(user:User,options?:{fullName?:string;phone?:string;referredBy?:string|null}){
  await waitForActiveDocument();
  const member=await ensureMember(user,options?.fullName||user.displayName||"",options?.phone||"",options?.referredBy||null);
  await waitForActiveDocument();
  const snap=await withFirestoreRetry(()=>getDoc(memberRef(user.uid)),3);
  const current=snap.exists()?snap.data():member;
  if(isAdminEmail(user.email)) return "/admin-gateway";
  if(current.paymentStatus==="approved") return "/dashboard";
  if(current.packageId) return "/payment";
  return "/collections";
}
