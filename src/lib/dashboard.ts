import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";

export type WithdrawalStatus = "pending" | "approved" | "paid" | "rejected";
export type Withdrawal = {
  id:string; uid:string; email:string; amount:number; method:"upi"|"bank";
  upiId?:string; accountName?:string; accountNumber?:string; ifsc?:string;
  status:WithdrawalStatus; createdAt?:unknown; updatedAt?:unknown;
};

export async function getMyReferrals(referralCode:string){
  const q=query(collection(db,"members"),where("referredBy","==",referralCode));
  const s=await getDocs(q);
  return s.docs.map(d=>({id:d.id,...d.data()}));
}

export async function getMyWithdrawals(uid:string){
  const q=query(collection(db,"withdrawals"),where("uid","==",uid));
  const s=await getDocs(q);
  return s.docs.map(d=>({id:d.id,...d.data()} as Withdrawal));
}

export async function requestWithdrawal(input:Omit<Withdrawal,"id"|"status"|"createdAt"|"updatedAt">){
  const ref=doc(collection(db,"withdrawals"));
  await setDoc(ref,{...input,status:"pending",createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
  return ref.id;
}

export async function updatePayoutProfile(uid:string,data:Record<string,string>){
  await updateDoc(doc(db,"members",uid),{payoutProfile:data,updatedAt:serverTimestamp()});
}
