"use client";

import Nav from "@/components/Nav";
import LuxuryBackground from "@/components/LuxuryBackground";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { memberRef, type Member } from "@/lib/user";
import { withFirestoreRetry } from "@/lib/firestoreRetry";
import { BRAND, PACKAGES, isAdminEmail } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const search = useSearchParams();
  const packageId = search.get("package") || "";

  const [member, setMember] = useState<Member | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let stopMember:undefined|(()=>void);
    let stopPayment:undefined|(()=>void);

    const stopAuth=onAuthStateChanged(auth, user => {
      stopMember?.();
      stopPayment?.();

      if (!user) {
        router.replace("/login");
        return;
      }

      if (isAdminEmail(user.email)) {
        router.replace("/admin-gateway");
        return;
      }

      const googleVerified=user.providerData.some(p=>p.providerId==="google.com");
      if(!user.emailVerified&&!googleVerified){
        router.replace("/products");
        return;
      }

      stopMember=onSnapshot(memberRef(user.uid), snap => {
        if(!snap.exists()){
          setLoading(false);
          router.replace("/products");
          return;
        }

        const data=snap.data() as Member;

        if(data.paymentStatus==="approved"){
          setMember(data);
          setLoading(false);
          router.replace("/dashboard");
          return;
        }

        if(!packageId&&!data.packageId){
          setLoading(false);
          router.replace("/products");
          return;
        }

        setMember(data);
        setLoading(false);
      },()=>{
        setLoading(false);
        setMessage("We could not watch your payment status. Refresh once and try again.");
      });

      stopPayment=onSnapshot(doc(db,"payments",user.uid), async snap => {
        if(!snap.exists()) return;
        const payment=snap.data() as {status?:string};

        // If founder approved the payment document directly in Firebase Console,
        // safely synchronize the member document. Firestore rules allow this only
        // when the corresponding payment is already approved.
        if(payment.status==="approved"){
          try{
            await withFirestoreRetry(()=>updateDoc(memberRef(user.uid),{
              paymentStatus:"approved",
              approvedAt:serverTimestamp(),
              updatedAt:serverTimestamp()
            }));
          }catch{
            // If Admin OS already updated the member document, the member listener
            // will receive the approved state and redirect without needing this write.
          }
        }
      });
    });

    return ()=>{
      stopAuth();
      stopMember?.();
      stopPayment?.();
    };
  },[router,packageId]);

  const selected=
    PACKAGES.find(item=>item.id===packageId) ||
    PACKAGES.find(item=>item.id===member?.packageId);

  if(loading){
    return <main className="shell center"><LuxuryBackground/>Preparing your secure Growwmore checkout…</main>;
  }

  if(!selected){
    return <main className="shell center"><LuxuryBackground/><div className="panel"><div className="eyebrow">Package required</div><h2>Select a package first.</h2><p className="sub">Your checkout needs a valid Growwmore package before payment can continue.</p><button className="btn" onClick={()=>router.replace("/products")}>Return to package selection →</button></div></main>;
  }

  async function submitPayment(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(!auth.currentUser||!member||submitting)return;
    const chosen=selected;
    if(!chosen)return;

    const form=new FormData(e.currentTarget);
    const utr=String(form.get("utr")||"").trim();
    if(utr.length<6){setMessage("Enter a valid UTR / transaction reference.");return;}

    setSubmitting(true);
    setMessage("");

    try{
      await withFirestoreRetry(()=>updateDoc(memberRef(auth.currentUser!.uid),{
        paymentStatus:"pending",
        packageId:chosen.id,
        packagePrice:chosen.price,
        commission:chosen.commission,
        utr,
        updatedAt:serverTimestamp()
      }));

      await withFirestoreRetry(()=>setDoc(doc(db,"payments",auth.currentUser!.uid),{
        uid:auth.currentUser!.uid,
        email:auth.currentUser!.email,
        packageId:chosen.id,
        amount:chosen.price,
        utr,
        status:"pending",
        createdAt:serverTimestamp()
      }));

      setMessage("Payment reference submitted successfully. Founder verification is now pending.");
    }catch(error){
      setMessage(error instanceof Error?error.message:"Payment submission failed. Please try again.");
    }finally{
      setSubmitting(false);
    }
  }

  const pending=member?.paymentStatus==="pending";

  return <main className="shell checkoutPage compactCheckoutPage">
    <LuxuryBackground/><Nav/>

    <section className="checkoutHero premiumCheckoutHero compactCheckoutHero">
      <div className="eyebrow">Secure Growwmore checkout</div>
      <h1>Your collection is selected.<br/>Complete payment safely.</h1>
      <p>Pay the exact amount using the official Growwmore UPI details, then submit your UTR for founder verification.</p>
      <div className="checkoutTrustRow"><span>Official UPI only</span><span>Live approval status</span><span>No OTP/PIN requested</span><span>Dashboard after approval</span></div>
    </section>

    <section className="premiumCheckoutGrid compactCheckoutGrid">
      <article className="checkoutOrderCard premiumCheckoutCard compactPremiumCard">
        <div className="checkoutStep">01 · ORDER</div>
        <div className="checkoutProductHero compactProductHero">
          <div className="checkoutProductMark">G</div>
          <div><span>{selected.label}</span><h2>{selected.name}</h2><p>{selected.note}</p></div>
        </div>

        <div className="checkoutIncludedBox compactIncludedBox">
          <div className="checkoutIncludedHead"><span>WHAT YOU RECEIVE</span><small>{selected.includes.length} item(s)</small></div>
          {selected.includes.map((item,index)=><div className="checkoutIncludedItem" key={item}><b>{String(index+1).padStart(2,"0")}</b><span>{item}</span></div>)}
        </div>

        <div className="checkoutPriceBlock"><div><span>Total payable</span><small>Selected package</small></div><strong>₹{selected.price.toLocaleString("en-IN")}</strong></div>
        <div className="checkoutCommissionNote"><span>Published future referral commission</span><b>₹{selected.commission.toLocaleString("en-IN")}</b><small>For eligible approved referrals after activation.</small></div>

        {!pending&&<button className="btn ghost checkoutChangeBtn" type="button" onClick={()=>router.push("/products")}>← Change package</button>}
      </article>

      <article className="checkoutPaymentCard premiumCheckoutCard compactPremiumCard">
        <div className="checkoutStep">02 · PAYMENT</div>
        <div className="premiumQrPanel compactQrPanel">
          <div className="qrGlow"><img src="/upi-payment-qr.png" alt="Growwmore official UPI payment QR code"/></div>
          <div className="qrText"><span>SCAN WITH ANY UPI APP</span><h3>Pay ₹{selected.price.toLocaleString("en-IN")}</h3></div>
        </div>

        <div className="paymentDetailList">
          <div><span>UPI ID</span><b>{BRAND.upiId}</b></div>
          <div><span>PAYMENT NUMBER</span><b>{BRAND.paymentPhone}</b></div>
          <div><span>SUPPORT</span><b>{BRAND.supportPhone}</b></div>
          <div><span>EMAIL</span><b>{BRAND.supportEmail}</b></div>
        </div>

        <div className="securityNotice"><b>Payment safety</b><p>Growwmore never asks for your UPI PIN, OTP, CVV, banking password or screen-sharing access.</p></div>
      </article>
    </section>

    {!pending?
      <form className="panel checkoutSubmit premiumCheckoutSubmit compactSubmit" onSubmit={submitPayment}>
        <div className="checkoutStep">03 · CONFIRM TRANSACTION</div>
        <h2>Submit your payment reference.</h2>
        <p className="sub">Enter the UTR / transaction reference generated by your payment app.</p>
        <div className="field"><label>UTR / TRANSACTION REFERENCE</label><input name="utr" required minLength={6} maxLength={100} autoComplete="off" placeholder="Example: 425678912345"/></div>
        <div className="checkoutSubmitFooter"><small>Dashboard unlocks automatically when payment status becomes approved.</small><button className="btn" disabled={submitting}>{submitting?"Submitting…":"Submit for verification →"}</button></div>
      </form>
      :
      <section className="panel pendingPanel premiumPendingPanel compactPending">
        <div className="pendingIcon"><span/></div>
        <div className="eyebrow">Live verification status</div>
        <h2>Waiting for founder approval.</h2>
        <p>You do not need to refresh this page. The dashboard opens automatically as soon as the approved status reaches your account.</p>
        <div className="pendingOrderSummary"><div><span>Package</span><b>{selected.name}</b></div><div><span>Amount</span><b>₹{selected.price.toLocaleString("en-IN")}</b></div><div><span>Status</span><b>Pending</b></div></div>
      </section>
    }

    {message&&<div className="checkoutMessage">{message}</div>}
  </main>;
}
