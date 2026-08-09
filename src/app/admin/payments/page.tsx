"use client";
import {useEffect,useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth,db} from "@/lib/firebase";
import {collection,getDocs,doc,getDoc,query,runTransaction,serverTimestamp,where} from "firebase/firestore";
import {useRouter} from "next/navigation";
import {PACKAGES,isAdminEmail} from "@/lib/constants";
import AdminNav from "@/components/AdminNav";

type Pay={id:string;uid:string;email:string;packageId:string;amount:number;utr:string;status:string};

export default function AdminPayments(){
 const router=useRouter(),[rows,setRows]=useState<Pay[]>([]),[msg,setMsg]=useState("");

 async function load(){
   const s=await getDocs(collection(db,"payments"));
   setRows(s.docs.map(x=>({id:x.id,...x.data()} as Pay)).filter(x=>x.status==="pending"));
 }

 useEffect(()=>onAuthStateChanged(auth,u=>{
   if(!u||!isAdminEmail(u.email))return router.push("/login");
   load();
 }),[router]);

 async function approve(pay:Pay){
   setMsg("Processing…");
   try{
     const ms=await getDoc(doc(db,"members",pay.uid));
     if(!ms.exists())throw new Error("Member missing");
     const md=ms.data();
     let refDoc:any=null;

     if(md.referredBy){
       let q=query(collection(db,"members"),where("referralCode","==",md.referredBy));
       let qs=await getDocs(q);
       if(qs.empty){
         q=query(collection(db,"members"),where("email","==",md.referredBy));
         qs=await getDocs(q);
       }
       refDoc=qs.docs[0]||null;
     }

     const pkg=PACKAGES.find(x=>x.id===md.packageId);
     const amount=pkg?.commission||0;

     await runTransaction(db,async tx=>{
       const pref=doc(db,"payments",pay.id);
       const mref=doc(db,"members",pay.uid);
       const directoryRef=doc(db,"memberDirectory",pay.email);
       const latest=await tx.get(mref);

       if(!latest.exists())throw new Error("Member missing");

       if(latest.data().paymentStatus!=="approved"){
         tx.update(mref,{paymentStatus:"approved",approvedAt:serverTimestamp(),updatedAt:serverTimestamp()});
       }

       tx.update(pref,{status:"approved",approvedAt:serverTimestamp()});

       tx.set(directoryRef,{
         email:pay.email,
         uid:pay.uid,
         fullName:latest.data().fullName||"",
         phone:latest.data().phone||"",
         paymentStatus:"approved",
         packageId:latest.data().packageId||pay.packageId,
         updatedAt:serverTimestamp()
       },{merge:true});

       if(refDoc&&amount>0){
         const rr=await tx.get(refDoc.ref);
         const ledgerRef=doc(db,"commissionTransactions",`ref_${pay.uid}`);
         if(rr.exists()){
           const rrData=rr.data() as Record<string,any>;
           tx.update(refDoc.ref,{totalEarning:Number(rrData.totalEarning||0)+amount,updatedAt:serverTimestamp()});
           tx.set(ledgerRef,{
             referrerUid:refDoc.id,
             referrerEmail:rrData.email||"",
             sourceMemberUid:pay.uid,
             sourceEmail:pay.email,
             packageId:md.packageId,
             amount,
             type:"referral_commission",
             status:"credited",
             createdAt:serverTimestamp()
           });
         }
       }
     });

     setMsg(`Approved ${pay.email}. Member status, payment status and email directory are synchronized.`);
     await load();
   }catch(e){
     setMsg(e instanceof Error?e.message:"Approval failed");
   }
 }

 return <main className="shell"><AdminNav/><div className="dash adminCompactDash">
   <div className="eyebrow">Payment center</div>
   <h2 className="dashTitle">Pending approvals</h2>
   {msg&&<div className="notice">{msg}</div>}
   <div className="adminMobileCards">
     {rows.map(r=><article className="adminPaymentCard" key={r.id}>
       <div className="adminIdentity"><span>USER EMAIL</span><strong>{r.email}</strong><small>UID · {r.uid}</small></div>
       <div className="adminPaymentMeta"><div><span>Package</span><b>{PACKAGES.find(p=>p.id===r.packageId)?.name||r.packageId}</b></div><div><span>Amount</span><b>₹{Number(r.amount||0).toLocaleString("en-IN")}</b></div><div><span>UTR</span><b>{r.utr}</b></div></div>
       <button className="btn adminApproveBtn" onClick={()=>approve(r)}>Approve & unlock dashboard →</button>
     </article>)}
   </div>
   {!rows.length&&<p className="sub">No pending payments.</p>}
 </div></main>;
}
