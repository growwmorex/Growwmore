"use client";
import Link from "next/link";
import {PACKAGES} from "@/lib/constants";
export default function BundleCards({selectable=false}:{selectable?:boolean}){
 const cards=[...PACKAGES,...PACKAGES];
 return <div className="bundleCarousel" aria-label="Growwmore collections"><div className="bundleTrack">{cards.map((p,i)=><article className="bundleBook compactBundle" key={`${p.id}-${i}`}
  onPointerMove={(e)=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty("--mx",`${e.clientX-r.left}px`);e.currentTarget.style.setProperty("--my",`${e.clientY-r.top}px`);e.currentTarget.style.setProperty("--rx",`${((e.clientY-r.top)/r.height-.5)*-5}deg`);e.currentTarget.style.setProperty("--ry",`${((e.clientX-r.left)/r.width-.5)*5}deg`)}}
  onPointerLeave={(e)=>{e.currentTarget.style.setProperty("--rx","0deg");e.currentTarget.style.setProperty("--ry","0deg")}}>
   <div className="bookSpine"><span>0{(i%PACKAGES.length)+1}</span><small>GROWWMORE</small></div><div className="bookBody"><div className="tier">{p.label}</div><h3>{p.name}</h3><p className="bookNote">{p.note}</p><div className="price">₹{p.price.toLocaleString("en-IN")}</div><div className="commission">₹{p.commission.toLocaleString("en-IN")} commission / eligible approved referral</div><ul className="items compactItems">{p.includes.slice(0,3).map(x=><li key={x}>{x}</li>)}</ul>{selectable?<Link className="btn compactChoose" href={`/payment?package=${p.id}`}>Choose bundle →</Link>:<Link className="textLink" href="/join">Create account to choose →</Link>}</div>
  </article>)}</div></div>
}
