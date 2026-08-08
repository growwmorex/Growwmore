"use client";
import Link from "next/link";
import {PACKAGES} from "@/lib/constants";
export default function BundleCards({selectable=false}:{selectable?:boolean}){
 return <div className="bundleShelf">{PACKAGES.map((p,i)=><article className="bundleBook" key={p.id}
  onPointerMove={(e)=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty("--mx",`${e.clientX-r.left}px`);e.currentTarget.style.setProperty("--my",`${e.clientY-r.top}px`);e.currentTarget.style.setProperty("--rx",`${((e.clientY-r.top)/r.height-.5)*-7}deg`);e.currentTarget.style.setProperty("--ry",`${((e.clientX-r.left)/r.width-.5)*7}deg`)}}
  onPointerLeave={(e)=>{e.currentTarget.style.setProperty("--rx","0deg");e.currentTarget.style.setProperty("--ry","0deg")}}>
   <div className="bookSpine"><span>0{i+1}</span><small>GROWWMORE</small></div><div className="bookBody"><div className="tier">{p.label}</div><h3>{p.name}</h3><p className="bookNote">{p.note}</p><div className="price">₹{p.price.toLocaleString("en-IN")}</div><div className="commission">Commission per eligible approved referral: ₹{p.commission.toLocaleString("en-IN")}</div><ul className="items">{p.includes.map(x=><li key={x}>{x}</li>)}</ul>{selectable?<Link className="btn" href={`/payment?package=${p.id}`}>Choose this bundle →</Link>:<Link className="textLink" href="/join">Create account to choose →</Link>}</div>
  </article>)}</div>
}
