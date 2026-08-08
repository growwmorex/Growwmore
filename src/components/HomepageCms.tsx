"use client";
import {useEffect,useState} from "react";import {doc,getDoc} from "firebase/firestore";import {db} from "@/lib/firebase";
export type HomeCms={visionTitle?:string;visionBody?:string;founderName?:string;founderNote?:string;announcement?:string};
export default function HomepageCms({fallback}:{fallback:Required<HomeCms>}){const [d,setD]=useState<HomeCms>({});useEffect(()=>{getDoc(doc(db,"platformContent","home")).then(s=>{if(s.exists())setD(s.data() as HomeCms)}).catch(()=>{})},[]);return <>
 {d.announcement||fallback.announcement?<div className="homeAnnouncement">{d.announcement||fallback.announcement}</div>:null}
 <section className="section visionSection"><div className="sectionKicker">Our vision</div><div className="editorial"><div><h2>{d.visionTitle||fallback.visionTitle}</h2></div><p className="sub">{d.visionBody||fallback.visionBody}</p></div></section>
 <section className="section founderStrip"><div><span className="eyebrow">About the founder</span><h2>{d.founderName||fallback.founderName}</h2></div><p>{d.founderNote||fallback.founderNote}</p></section>
 </>}
