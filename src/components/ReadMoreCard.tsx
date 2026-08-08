"use client";
import {useState} from "react";
export default function ReadMoreCard({index,title,summary,details,tone="wine"}:{index:string;title:string;summary:string;details:string;tone?:"wine"|"olive"|"cream"}){
 const [open,setOpen]=useState(false);
 return <article className={`storyCard ${tone} ${open?"open":""}`}>
   <span className="cardIndex">{index}</span><h3>{title}</h3><p>{summary}</p>
   {open&&<p className="storyDetails">{details}</p>}
   <button className="readMore" type="button" onClick={()=>setOpen(v=>!v)}>{open?"Show less":"Read more"} <span>↗</span></button>
 </article>
}