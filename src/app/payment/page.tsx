"use client";
import Nav from "@/components/Nav";import {useEffect,useState} from "react";import {onAuthStateChanged} from "firebase/auth";import {auth,db} from "@/lib/firebase";import {doc,getDoc,serverTimestamp,setDoc,updateDoc} from "firebase/firestore";import {memberRef,Member} from "@/lib/user";import {BRAND,PACKAGES} from "@/lib/constants";import {useSearchParams,useRouter} from "next/navigation";
export default function Payment(){const q=useSearchParams(),router=useRouter();const [m,setM]=useState<Member|null>(null);const [msg,setMsg]=useState("");const [pkg,setPkg]=useState(q.get("package")||"");
 useEffect(()=>onAuthStateChanged(auth,async u=>{if(!u)return router.push("/login");const s=await getDoc(memberRef(u.uid));if(!s.exists())return;const d=s.data() as Member;setM(d);if(d.paymentStatus==="approved")router.push("/dashboard");if(!pkg&&d.packageId)setPkg(d.packageId)}),[router,pkg]);
 const p=PACKAGES.find(x=>x.id===pkg)||PACKAGES[0];
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(!auth.currentUser)return;const f=new FormData(e.currentTarget),utr=String(f.get("utr")||"").trim();if(utr.length<6)return setMsg("Enter a valid UTR / payment reference.");
 await updateDoc(memberRef(auth.currentUser.uid),{paymentStatus:"pending",packageId:p.id,packagePrice:p.price,commission:p.commission,utr,updatedAt:serverTimestamp()});
 await setDoc(doc(db,"payments",auth.currentUser.uid),{uid:auth.currentUser.uid,email:auth.currentUser.email,packageId:p.id,amount:p.price,utr,status:"pending",createdAt:serverTimestamp()});
 setMsg("Payment submitted. Admin approval is pending.");setM({...m!,paymentStatus:"pending"});}
 return <main className="shell"><Nav/><div className="panel"><div className="eyebrow">Payment verification</div><h1>{m?.paymentStatus==="pending"?"Approval pending.":"Complete payment."}</h1>
 <div className="notice"><b>{p.name}</b><br/>Amount: ₹{p.price.toLocaleString("en-IN")}<br/><br/>UPI ID: <b>{BRAND.upiId}</b><br/>UPI-linked number: <b>{BRAND.paymentPhone}</b><br/><br/>Pay using your UPI app, then submit the UTR/reference below. Never share your UPI PIN or banking password.</div>
 {m?.paymentStatus!=="pending"&&<form onSubmit={submit}><div className="field"><label>UTR / TRANSACTION REFERENCE</label><input name="utr" required/></div><button className="btn">Submit for approval →</button></form>}
 {msg&&<p className={msg.startsWith("Payment")?"success":"error"}>{msg}</p>}<p className="sub">Support: {BRAND.supportPhone} · {BRAND.supportEmail}</p></div></main>}
