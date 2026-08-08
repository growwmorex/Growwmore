import Footer from "@/components/Footer";
import Nav from "@/components/Nav";import PackageCards from "@/components/PackageCards";import {BRAND} from "@/lib/constants";
export default function Home(){
 return <main className="shell"><Nav/><section className="hero"><div><div className="eyebrow">Luxury products · Product partnership</div>
 <h1>Own luxury.<br/>Grow with it.</h1><p>Growwmore is a product-based referral platform built around curated luxury resin décor collections. Purchase a collection, receive your products, and unlock your member dashboard after payment approval.</p>
 <div className="actions"><a className="btn" href="#packages">Explore Collections</a><a className="btn ghost" href="/login">Member Login</a></div></div></section>
 <section className="section" id="packages"><div className="eyebrow">Five launch collections</div><h2>Choose your collection.</h2><p className="sub">Each collection includes real resin décor products. Commission is credited only on eligible referred purchases after payment approval.</p><PackageCards/></section>
 <section className="section" id="how"><div className="eyebrow">Simple flow</div><h2>Purchase. Approval. Access.</h2><div className="grid">
 {["Create your Growwmore account and choose a luxury collection.","Pay using the displayed UPI details and submit your UTR/reference number.","Admin verifies payment. Once approved, your member dashboard and referral tools unlock."].map((x,i)=><div className="card" key={x}><div className="tier">0{i+1}</div><h3>{["Choose","Verify","Grow"][i]}</h3><p className="sub">{x}</p></div>)}</div></section>
 <footer className="footer"><span>© 2026 Growwmore</span><span>Support: {BRAND.supportPhone} · {BRAND.supportEmail}</span></footer><Footer/></main>;
}