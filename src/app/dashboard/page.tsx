"use client";
import {useEffect,useMemo,useState} from "react";import DashboardNav from "@/components/DashboardNav";import ReferralShare from "@/components/ReferralShare";import {useMember} from "@/hooks/useMember";import {PACKAGES} from "@/lib/constants";import {earningWindows,getCommissionTransactions} from "@/lib/earnings";import Link from "next/link";import styles from "./DashboardHero.module.css";
const QUOTES=[
 "Small consistent actions build remarkable results.",
 "Your progress does not need to be loud to be meaningful.",
 "Focus on genuine value, serve people well, and let growth follow.",
 "Every approved sale starts with one clear conversation.",
 "Build trust first. Sustainable growth comes after it."
];
function greeting(hour:number){if(hour<12)return "Good morning";if(hour<17)return "Good afternoon";return "Good evening"}
export default function Dashboard(){
 const {member:m,loading}=useMember();const [earn,setEarn]=useState({today:0,last7:0,lastMonth:0,total:0});const [clock,setClock]=useState<{greet:string;date:string;quote:string}|null>(null);
 useEffect(()=>{const d=new Date();setClock({greet:greeting(d.getHours()),date:d.toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"}),quote:QUOTES[d.getDate()%QUOTES.length]})},[]);
 useEffect(()=>{if(m)getCommissionTransactions(m.uid).then(rows=>setEarn(earningWindows(rows))).catch(()=>setEarn(v=>({...v,total:m.totalEarning||0})))},[m]);
 if(loading||!m)return <main className="shell"><div className="panel">Loading secure dashboard…</div></main>;
 const p=PACKAGES.find(x=>x.id===m.packageId),available=Math.max(0,(m.totalEarning||0)-(m.withdrawnAmount||0));
 return <main className="shell"><DashboardNav/><div className="dash">
   <section className={styles.hero}>
     <div className={styles.avatar}>{m.photoDataUrl?<img src={m.photoDataUrl} alt={`${m.fullName||"Member"} profile`}/>:<span>{(m.fullName||"G").charAt(0).toUpperCase()}</span>}</div>
     <div className={styles.copy}><p className={styles.time}>{clock?.greet||"Welcome back"}</p><h2 className={styles.name}>{m.fullName||"Member"}.</h2><p className={styles.quote}>“{clock?.quote||QUOTES[0]}”</p><span className={styles.date}>{clock?.date||""}</span></div>
   </section>
   <div className="earningStats"><div className="stat"><span>Today earning</span><strong>₹{earn.today.toLocaleString("en-IN")}</strong></div><div className="stat"><span>Last 7 days</span><strong>₹{earn.last7.toLocaleString("en-IN")}</strong></div><div className="stat"><span>Last month</span><strong>₹{earn.lastMonth.toLocaleString("en-IN")}</strong></div><div className="stat"><span>Total earning</span><strong>₹{Math.max(earn.total,m.totalEarning||0).toLocaleString("en-IN")}</strong></div></div>
   <div className="dashboardMiniStats"><div><span>Available balance</span><b>₹{available.toLocaleString("en-IN")}</b></div><div><span>Collection</span><b>{p?.name||"—"}</b></div><div><span>Per approved referral</span><b>₹{(p?.commission||0).toLocaleString("en-IN")}</b></div></div>
   <div className="grid"><Link className="card" href="/dashboard/transactions"><div className="tier">Ledger</div><h3>Transactions</h3><p className="sub">Commission credits and payout activity in one place.</p></Link><Link className="card" href="/dashboard/team"><div className="tier">Network</div><h3>Team members</h3><p className="sub">See direct members, their status and their earnings.</p></Link><Link className="card" href="/dashboard/withdrawals"><div className="tier">Payouts</div><h3>Withdraw earnings</h3><p className="sub">Request UPI or bank payout and track status.</p></Link></div>
   <section className="referralStudio"><div className="eyebrow">Share Growwmore</div><h3>Your referral link</h3><ReferralShare code={m.referralCode}/></section>
 </div></main>
}