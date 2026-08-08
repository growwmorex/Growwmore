"use client";
import {useEffect,useMemo,useState} from "react";
export default function ReferralShare({code}:{code:string}){
 const [origin,setOrigin]=useState("");
 useEffect(()=>setOrigin(window.location.origin),[]);
 const link=useMemo(()=>origin?`${origin}/join?ref=${encodeURIComponent(code)}`:"",[origin,code]);
 async function copy(){if(link)await navigator.clipboard.writeText(link)}
 function share(network:string){
   if(!link)return;
   const text=`Join Growwmore using my referral code ${code}`;
   const encoded=encodeURIComponent(link), msg=encodeURIComponent(`${text}\n${link}`);
   const urls:Record<string,string>={
    whatsapp:`https://wa.me/?text=${msg}`,
    facebook:`https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    x:`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encoded}`,
    instagram:`https://www.instagram.com/`,
    snapchat:`https://www.snapchat.com/`
   };
   window.open(urls[network],"_blank","noopener,noreferrer");
 }
 return <div className="refShare">
   <div className="refLinkBox"><small>YOUR REFERRAL LINK</small><strong>{link||"Preparing link…"}</strong><button onClick={copy} type="button">Copy link</button></div>
   <div className="shareRow">
    <button onClick={()=>share("whatsapp")}>WhatsApp</button><button onClick={()=>share("instagram")}>Instagram</button><button onClick={()=>share("snapchat")}>Snapchat</button><button onClick={()=>share("facebook")}>Facebook</button><button onClick={()=>share("x")}>X</button>
   </div>
   <p className="microcopy">Instagram and Snapchat open the app/site so you can paste the copied referral link into a DM, Story or bio. Other supported networks open a prefilled share screen.</p>
 </div>
}