import Link from "next/link";import {PACKAGES} from "@/lib/constants";
export default function PackageCards(){
 return <div className="grid">{PACKAGES.map((p,i)=><article className="card" key={p.id} style={{animationDelay:`${i*90}ms`}}>
  <div className="tier">Collection {String(i+1).padStart(2,"0")}</div><h3>{p.name}</h3><div className="price">₹{p.price.toLocaleString("en-IN")}</div>
  <div className="commission">Affiliate commission ₹{p.commission.toLocaleString("en-IN")} / approved sale</div>
  <ul className="items">{p.includes.map(x=><li key={x}>{x}</li>)}</ul>
  <Link className="btn ghost" href={`/join?package=${p.id}`}>Choose Collection →</Link>
 </article>)}</div>;
}