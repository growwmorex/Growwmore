"use client";
import {useEffect,useState} from "react";
import AdminNav from "@/components/AdminNav";
import {useAdmin} from "@/hooks/useAdmin";
import {allDocs,setMemberState} from "@/lib/admin";
import {PACKAGES} from "@/lib/constants";

export default function Members(){
 const ready=useAdmin(),[rows,setRows]=useState<any[]>([]),[q,setQ]=useState("");
 async function load(){setRows(await allDocs("members"))}
 useEffect(()=>{if(ready)load()},[ready]);

 const filtered=rows.filter(x=>`${x.fullName} ${x.email} ${x.phone} ${x.uid||x.id}`.toLowerCase().includes(q.toLowerCase()));

 if(!ready)return <main className="shell"><div className="panel">Loading…</div></main>;

 return <main className="shell"><AdminNav/><div className="dash adminCompactDash">
   <div className="eyebrow">Member CRM</div>
   <h2 className="dashTitle">Members</h2>
   <div className="field"><input placeholder="Search email, name, phone or UID…" value={q} onChange={e=>setQ(e.target.value)}/></div>

   <div className="adminMemberGrid">
     {filtered.map(x=><article className="adminMemberCard" key={x.id}>
       <div className="adminIdentity">
         <span>EMAIL IDENTITY</span>
         <strong>{x.email||"No email"}</strong>
         <small>{x.fullName||"Growwmore Member"} · UID {x.uid||x.id}</small>
       </div>
       <div className="adminMemberMeta">
         <div><span>Package</span><b>{PACKAGES.find(p=>p.id===x.packageId)?.name||"Not selected"}</b></div>
         <div><span>Payment</span><b className={`statusText status-${x.paymentStatus}`}>{x.paymentStatus||"—"}</b></div>
         <div><span>Earnings</span><b>₹{Number(x.totalEarning||0).toLocaleString("en-IN")}</b></div>
         <div><span>Phone</span><b>{x.phone||"—"}</b></div>
       </div>
       <button className="btn ghost adminMemberControl" onClick={async()=>{await setMemberState(x.id,!x.disabled);await load()}}>{x.disabled?"Enable member":"Disable member"}</button>
     </article>)}
   </div>
 </div></main>;
}
