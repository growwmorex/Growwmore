"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {PACKAGES} from "@/lib/constants";

export default function BundleCards({selectable=false}:{selectable?:boolean}){
  const viewportRef=useRef<HTMLDivElement|null>(null);
  const [index,setIndex]=useState(0);
  const [paused,setPaused]=useState(false);

  function go(next:number){
    const total=PACKAGES.length;
    const normalized=(next+total)%total;
    setIndex(normalized);
    const viewport=viewportRef.current;
    const card=viewport?.querySelector<HTMLElement>(`[data-package-index="${normalized}"]`);
    card?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
  }

  useEffect(()=>{
    if(paused)return;
    const id=window.setInterval(()=>go(index+1),5200);
    return ()=>window.clearInterval(id);
  },[index,paused]);

  return <div className="bundleCarousel packagePreviewCarousel" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onTouchStart={()=>setPaused(true)}>
    <div className="carouselTopbar">
      <div className="carouselCounter"><span>{String(index+1).padStart(2,"0")}</span><small>/ {String(PACKAGES.length).padStart(2,"0")}</small></div>
      <div className="carouselControls" aria-label="Package carousel controls">
        <button type="button" aria-label="Previous package" onClick={()=>go(index-1)}>←</button>
        <button type="button" aria-label="Next package" onClick={()=>go(index+1)}>→</button>
      </div>
    </div>

    <div className="carouselViewport" ref={viewportRef}>
      {PACKAGES.map((p,i)=><article
        className={`bundleBook compactBundle ${i===index?"activeBundle":""}`}
        key={p.id}
        data-package-index={i}
        onClick={()=>setIndex(i)}
        onPointerMove={(e)=>{
          const r=e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx",`${e.clientX-r.left}px`);
          e.currentTarget.style.setProperty("--my",`${e.clientY-r.top}px`);
          e.currentTarget.style.setProperty("--rx",`${((e.clientY-r.top)/r.height-.5)*-5}deg`);
          e.currentTarget.style.setProperty("--ry",`${((e.clientX-r.left)/r.width-.5)*5}deg`);
        }}
        onPointerLeave={(e)=>{
          e.currentTarget.style.setProperty("--rx","0deg");
          e.currentTarget.style.setProperty("--ry","0deg");
        }}
      >
        <div className="bookSpine"><span>0{i+1}</span><small>GROWWMORE</small></div>
        <div className="bookBody">
          <div className="tier">{p.label}</div>
          <h3>{p.name}</h3>
          <p className="bookNote">{p.note}</p>
          <div className="price">₹{p.price.toLocaleString("en-IN")}</div>
          <div className="commission">₹{p.commission.toLocaleString("en-IN")} commission / eligible approved referral</div>
          <ul className="items compactItems">{p.includes.slice(0,3).map(x=><li key={x}>{x}</li>)}</ul>
          {selectable
            ? <Link className="btn compactChoose" href={`/payment?package=${p.id}`}>Choose bundle →</Link>
            : <Link className="textLink" href="/join">Create account to choose →</Link>}
        </div>
      </article>)}
    </div>

    <div className="carouselDots" aria-label="Choose package preview">
      {PACKAGES.map((p,i)=><button key={p.id} type="button" aria-label={`Show ${p.name}`} className={i===index?"active":""} onClick={()=>go(i)}/>)}
    </div>
  </div>
}
