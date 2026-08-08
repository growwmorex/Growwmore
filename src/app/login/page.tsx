"use client";
import Nav from "@/components/Nav";import {useState} from "react";import {signInWithEmailAndPassword} from "firebase/auth";import {auth} from "@/lib/firebase";import {getDoc} from "firebase/firestore";import {memberRef} from "@/lib/user";import {useRouter} from "next/navigation";import {BRAND} from "@/lib/constants";
export default function Login(){const [err,setErr]=useState("");const router=useRouter();
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setErr("");const f=new FormData(e.currentTarget);
 try{const c=await signInWithEmailAndPassword(auth,String(f.get("email")),String(f.get("password")));
 if(c.user.email?.toLowerCase()===BRAND.adminEmail) return router.push("/admin");
 const s=await getDoc(memberRef(c.user.uid));if(!s.exists())throw new Error("Member profile not found.");
 const d=s.data();router.push(d.paymentStatus==="approved"?"/dashboard":"/payment");}catch(x){setErr(x instanceof Error?x.message:"Login failed")}}
 return <main className="shell"><Nav/><form className="panel" onSubmit={submit}><div className="eyebrow">Secure access</div><h1>Welcome back.</h1>
 <div className="field"><label>EMAIL</label><input name="email" type="email" required/></div><div className="field"><label>PASSWORD</label><input name="password" type="password" required/></div>{err&&<div className="error">{err}</div>}<button className="btn">Login →</button></form></main>}
