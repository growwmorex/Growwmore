"use client";
import {useEffect,useState} from "react";import {doc,getDoc} from "firebase/firestore";import {db} from "@/lib/firebase";
export type HomeCms={visionTitle?:string;visionBody?:string;founderName?:string;founderNote?:string;announcement?:string};
const LEGACY_WRONG_NAME="Shamshar Qadri";
export default function HomepageCms({fallback}:{fallback:Required<HomeCms>}){const [d,setD]=useState<HomeCms>({});useEffect(()=>{getDoc(doc(db,"platformContent","home")).then(s=>{if(s.exists()){const next=s.data() as HomeCms;if(next.founderName===LEGACY_WRONG_NAME)next.founderName=fallback.founderName;setD(next)}}).catch(()=>{})},[fallback.founderName]);return <>
 {d.announcement||fallback.announcement?<div className="homeAnnouncement">{d.announcement||fallback.announcement}</div>:null}
 <section className="section visionSection" id="vision"><div className="sectionKicker">Our vision</div><div className="editorial"><div><h2>{d.visionTitle||fallback.visionTitle}</h2></div><p className="sub">{d.visionBody||fallback.visionBody}</p></div></section>
 <section className="section founderStrip" id="founder"><div><span className="eyebrow">Founder & purpose</span><h2>{d.founderName||fallback.founderName}</h2><div className="founderBadges"><span>Founder</span><span>Product-first</span><span>Creator focused</span></div></div><div><p>{d.founderNote||fallback.founderNote}</p><p className="founderPositive">The long-term direction is positive and practical: help handmade creators reach more buyers, give aspiring earners a transparent product-led route to participate, and keep trust, real products and verified sales at the center of the system.</p></div></section>
 </>}
