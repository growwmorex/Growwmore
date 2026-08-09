"use client";
import {useEffect,useState} from "react";
import {onAuthStateChanged,reload} from "firebase/auth";
import {getDoc} from "firebase/firestore";
import {auth} from "@/lib/firebase";
import {memberRef,type Member} from "@/lib/user";
import {withFirestoreRetry} from "@/lib/firestoreRetry";
import {isAdminEmail} from "@/lib/constants";
import {useRouter} from "next/navigation";
import Nav from "@/components/Nav";
import LuxuryBackground from "@/components/LuxuryBackground";
import ProductSelectionCards from "@/components/ProductSelectionCards";

export default function Products(){
 const router=useRouter(),[ready,setReady]=useState(false),[verified,setVerified]=useState(false),[msg,setMsg]=useState("");
 useEffect(()=>onAuthStateChanged(auth,async u=>{
  if(!u)return router.replace("/login");
  if(isAdminEmail(u.email))return router.replace("/admin-gateway");
  try{
   const snap=await withFirestoreRetry(()=>getDoc(memberRef(u.uid)));
   if(snap.exists()){
    const m=snap.data() as Member;
    if(m.paymentStatus==="approved")return router.replace("/dashboard");
    if(m.packageId)return router.replace("/payment");
   }
   await reload(u).catch(()=>undefined);
   setVerified(u.emailVerified||u.providerData.some(x=>x.providerId==="google.com"));
   setReady(true);
  }catch{setMsg("We could not load your account securely. Refresh once and try again.");setReady(true)}
 }),[router]);
 if(!ready)return <main className="shell center"><LuxuryBackground/>Preparing your private product room…</main>;
 return <main className="shell productRoomPage"><LuxuryBackground/><Nav/><section className="productRoomHero"><div className="eyebrow">Private product selection</div><h1>Choose the collection you actually want to own.</h1><p>Five curated handmade resin collections are available. Review the actual products, purchase value and published future referral commission before continuing to checkout.</p><div className="productRoomTrust"><span>Real physical products</span><span>One collection per account</span><span>Manual payment verification</span><span>Dashboard after approval</span></div></section>{msg&&<div className="panel notice">{msg}</div>}{!verified?<div className="panel"><h3>Email verification required</h3><p className="sub">Verify your email first, then return here. Google accounts are treated as verified.</p></div>:<ProductSelectionCards/>}</main>
}