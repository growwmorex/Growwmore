"use client";
import {useState} from "react";
import {PACKAGES} from "@/lib/constants";
import {useRouter} from "next/navigation";

export default function ProductSelectionCards(){
 const router=useRouter();
 const [selected,setSelected]=useState<(typeof PACKAGES)[number]|null>(null);
 return <div className="productSelectionShell">
  <div className="productSelectionGrid">
   {PACKAGES.map((p,index)=><article key={p.id} className={`productSelectionCard ${selected?.id===p.id?"selected":""}`}>
    <div className="productCardTop"><span>0{index+1}</span><span>{p.label}</span></div>
    <div className="productCardVisual"><div className="productCardMonogram">G</div><div><small>CURATED HANDMADE COLLECTION</small><strong>{p.name}</strong></div></div>
    <div className="productCardBody">
     <div className="productPriceRow"><strong>₹{p.price.toLocaleString("en-IN")}</strong><span>one-time product purchase</span></div>
     <p>{p.note}</p>
     <div className="productIncludes"><span>WHAT'S INCLUDED</span>{p.includes.map(x=><div key={x}>✦ {x}</div>)}</div>
     <div className="productCommission">Published referral commission after activation: <b>₹{p.commission.toLocaleString("en-IN")}</b></div>
     <button className="btn productSelectBtn" onClick={()=>setSelected(p)}>{selected?.id===p.id?"Selected ✓":"Select this collection"}</button>
    </div>
   </article>)}
  </div>
  {selected&&<div className="floatingCart"><div className="cartSummary"><span>YOUR SELECTION</span><strong>{selected.name}</strong><small>{selected.label} · ₹{selected.price.toLocaleString("en-IN")}</small></div><button className="btn cartCheckoutBtn" onClick={()=>router.push(`/payment?package=${selected.id}`)}>Continue to secure payment →</button></div>}
 </div>
}