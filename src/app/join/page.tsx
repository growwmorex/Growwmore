"use client";
import Nav from "@/components/Nav";import {useSearchParams,useRouter} from "next/navigation";import {useState} from "react";
import {createUserWithEmailAndPassword,updateProfile} from "firebase/auth";import {auth} from "@/lib/firebase";import {ensureMember} from "@/lib/user";import {PACKAGES} from "@/lib/constants";
export default function Join(){
 const q=useSearchParams(),router=useRouter();const [err,setErr]=useState("");const [busy,setBusy]=useState(false);
 const preset=q.get("package")||PACKAGES[0].id;
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setErr("");
  const f=new FormData(e.currentTarget);try{
   const fullName=String(f.get("name")||""),email=String(f.get("email")||""),password=String(f.get("password")||""),phone=String(f.get("phone")||""),ref=String(f.get("ref")||"").trim()||null;
   const cred=await createUserWithEmailAndPassword(auth,email,password);await updateProfile(cred.user,{displayName:fullName});await ensureMember(cred.user,fullName,phone,ref);router.push(`/payment?package=${f.get("package")}`);
  }catch(x){setErr(x instanceof Error?x.message:"Could not create account.");}finally{setBusy(false)}
 }
 return <main className="shell"><Nav/><form className="panel" onSubmit={submit}><div className="eyebrow">Membership</div><h1>Create account</h1>
 <div className="field"><label>FULL NAME</label><input name="name" required/></div><div className="field"><label>EMAIL</label><input name="email" type="email" required/></div>
 <div className="field"><label>PHONE</label><input name="phone" inputMode="numeric" required/></div><div className="field"><label>PASSWORD</label><input name="password" type="password" minLength={6} required/></div>
 <div className="field"><label>COLLECTION</label><select name="package" defaultValue={preset}>{PACKAGES.map(p=><option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>)}</select></div>
 <div className="field"><label>REFERRAL CODE / REFERRER ID (OPTIONAL)</label><input name="ref"/></div>{err&&<div className="error">{err}</div>}
 <button className="btn" disabled={busy}>{busy?"Creating…":"Continue to payment →"}</button></form></main>;
}