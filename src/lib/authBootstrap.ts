import type { User } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { ensureMember, memberRef, type Member } from "./user";
import { isAdminEmail } from "./constants";
import { withFirestoreRetry } from "./firestoreRetry";
export type BootstrapOptions={fullName?:string;phone?:string;referredBy?:string|null};
export async function bootstrapAuthenticatedUser(user:User,options:BootstrapOptions={}){const member=await ensureMember(user,options.fullName||user.displayName||"",options.phone||"",options.referredBy||null);const snap=await withFirestoreRetry(()=>getDoc(memberRef(user.uid)),3);const current=(snap.exists()?snap.data():member) as Member;let destination="/collections";if(isAdminEmail(user.email))destination="/admin-gateway";else if(current.paymentStatus==="approved")destination="/dashboard";else if(current.packageId)destination="/payment";return {member:current,destination};}
