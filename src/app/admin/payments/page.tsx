"use client";
import {useEffect,useState} from "react";import {onAuthStateChanged} from "firebase/auth";import {auth,db} from "@/lib/firebase";import {collection,getDocs,doc,getDoc,runTransaction,serverTimestamp} from "firebase/firestore";import {useRouter} from "next/navigation";import {BRAND,PACKAGES} from "@/lib/constants";import AdminNav from "@/components/AdminNav";
type Pay={id:string;uid:string;email:string;packageId:string;amount:number;utr:string;status:string};
export default function Admin(){const router=useRouter(),[rows,setRows]=useState<Pay[]>([]),[msg,setMsg]=useState("");
 async function load(){const s=await getDocs(collection(db,"payments"));setRows(s.docs.map(x=>({id:x.id,...x.data()} as Pay)).filter(x=>x.status==="pending"))}
 useEffect(()=>onAuthStateChanged(auth,u=>{if(!u||u.email?.toLowerCase()!==BRAND.adminEmail)return router.push("/login");load()}),[router]);
 async function approve(pay:Pay){setMsg("Processing…");try{
  await runTransaction(db,async tx=>{const pref=doc(db,"payments",pay.id),mref=doc(db,"members",pay.uid);const ms=await tx.get(mref);if(!ms.exists())throw new Error("Member missing");
   const md=ms.data();if(md.paymentStatus==="approved"){tx.update(pref,{status:"approved",approvedAt:serverTimestamp()});return}
   tx.update(mref,{paymentStatus:"approved",approvedAt:serverTimestamp(),updatedAt:serverTimestamp()});tx.update(pref,{status:"approved",approvedAt:serverTimestamp()});
   if(md.referredBy){const q=await getDocs(collection(db,"members"));const refDoc=q.docs.find(d=>d.data().referralCode===md.referredBy||d.data().email===md.referredBy);
    if(refDoc){const rd=refDoc.data(),pkg=PACKAGES.find(x=>x.id===md.packageId),amount=pkg?.commission||0;tx.update(refDoc.ref,{totalEarning:(rd.totalEarning||0)+amount,updatedAt:serverTimestamp()});}}
  });setMsg("Approved and eligible referral commission credited.");await load();
 }catch(e){setMsg(e instanceof Error?e.message:"Approval failed")}}
 return <main className="shell"><AdminNav/><div className="dash"><div className="eyebrow">Payment center</div><h2 style={{fontFamily:"Georgia,serif",fontSize:"3rem",fontWeight:400}}>Pending approvals</h2>{msg&&<div className="notice">{msg}</div>}
 <table className="table"><thead><tr><th>Email</th><th>Package</th><th>Amount</th><th>UTR</th><th>Action</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.email}</td><td>{r.packageId}</td><td>₹{r.amount}</td><td>{r.utr}</td><td><button className="btn" onClick={()=>approve(r)}>Approve</button></td></tr>)}</tbody></table>{!rows.length&&<p className="sub">No pending payments.</p>}</div></main>}
