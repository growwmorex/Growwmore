"use client";
import Nav from "@/components/Nav";
import Link from "next/link";
import LuxuryBackground from "@/components/LuxuryBackground";
import {useRouter,useSearchParams} from "next/navigation";
import {useEffect,useRef,useState} from "react";
import {createUserWithEmailAndPassword,sendEmailVerification,updateProfile} from "firebase/auth";
import {auth} from "@/lib/firebase";
import {isAdminEmail} from "@/lib/constants";
import {friendlyAuthError} from "@/lib/authErrors";
import {friendlyFirestoreError,isTransientFirestoreError} from "@/lib/firestoreRetry";
import {bootstrapAuthenticatedUser} from "@/lib/authBootstrap";
import {beginGoogleAuth,completeGoogleRedirect,consumeRedirectContext,prepareAuthPersistence} from "@/lib/googleAuthFlow";

export default function Join(){
 const router=useRouter(),q=useSearchParams(),[err,setErr]=useState(""),[busy,setBusy]=useState(false),handled=useRef(false);
 const referral=q.get("ref")||"";

 useEffect(()=>{
   if(handled.current)return;
   handled.current=true;
   (async()=>{
     try{
       const result=await completeGoogleRedirect();
       if(!result)return;
       const context=consumeRedirectContext();
       setBusy(true);
       const target=await bootstrapAuthenticatedUser(result.user,{referredBy:context.referral||referral||null});
       router.replace(target);
     }catch(x){
       setErr(isTransientFirestoreError(x)?friendlyFirestoreError(x):friendlyAuthError(x));
     }finally{
       setBusy(false);
     }
   })();
 },[referral,router]);

 async function google(){
   setBusy(true);setErr("");
   try{
     const result=await beginGoogleAuth("join",referral);
     if(result){
       const target=await bootstrapAuthenticatedUser(result.user,{referredBy:referral||null});
       router.replace(target);
     }
   }catch(x){
     setErr(isTransientFirestoreError(x)?friendlyFirestoreError(x):friendlyAuthError(x));
     setBusy(false);
   }
 }

 async function submit(e:React.FormEvent<HTMLFormElement>){
   e.preventDefault();setBusy(true);setErr("");
   const f=new FormData(e.currentTarget);
   try{
     await prepareAuthPersistence();
     const fullName=String(f.get("name")||""),email=String(f.get("email")||""),password=String(f.get("password")||""),phone=String(f.get("phone")||""),ref=String(f.get("ref")||"").trim()||null;
     const cred=await createUserWithEmailAndPassword(auth,email,password);
     await updateProfile(cred.user,{displayName:fullName});
     const target=await bootstrapAuthenticatedUser(cred.user,{fullName,phone,referredBy:ref});
     if(!isAdminEmail(email))await sendEmailVerification(cred.user);
     router.replace(target);
   }catch(x){
     setErr(isTransientFirestoreError(x)?friendlyFirestoreError(x):friendlyAuthError(x));
   }finally{setBusy(false)}
 }

 return <main className="shell"><LuxuryBackground/><Nav/><div className="authWrap"><form className="panel authPanel" onSubmit={submit}>
 <div className="eyebrow">Join Growwmore</div><h1>Create your account.</h1><p className="sub">Your bundle is selected on the next page — account creation stays clean and simple.</p>
 <button type="button" className="googleBtn" onClick={google} disabled={busy}><span>G</span> {busy?"Connecting securely…":"Continue with Google"}</button>
 <div className="divider"><span>or continue with email</span></div>
 <div className="field"><label>FULL NAME</label><input name="name" required/></div><div className="field"><label>EMAIL</label><input name="email" type="email" required/></div>
 <div className="field"><label>PHONE</label><input name="phone" inputMode="numeric" required/></div><div className="field"><label>PASSWORD</label><input name="password" type="password" minLength={6} required/></div>
 <div className="field"><label>REFERRAL CODE / REFERRER ID (OPTIONAL)</label><input name="ref" defaultValue={referral}/></div>
 <p className="microcopy">Email registrations receive a verification email. By creating an account you accept the Terms, Privacy Policy, Referral Terms and No-Refund Policy.</p>
 {err&&<div className="error">{err}</div>}<div className="authLinks"><Link href="/forgot-password">Forgot password?</Link><Link href="/login">Already a member? Sign in</Link></div>
 <button className="btn wide" disabled={busy}>{busy?"Creating account…":"Create account →"}</button>
 </form></div></main>
}