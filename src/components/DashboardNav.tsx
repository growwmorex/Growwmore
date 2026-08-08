"use client";
import Link from "next/link";import {usePathname,useRouter} from "next/navigation";import {signOut} from "firebase/auth";import {auth} from "@/lib/firebase";
const links=[["/dashboard","Overview"],["/dashboard/referrals","Referrals"],["/dashboard/wallet","Wallet"],["/dashboard/withdrawals","Withdrawals"],["/dashboard/profile","Profile"]];
export default function DashboardNav(){const path=usePathname(),router=useRouter();return <><nav className="nav"><Link className="brand" href="/dashboard">GROWW<b>MORE</b></Link><button className="btn ghost" onClick={()=>signOut(auth).then(()=>router.push("/"))}>Sign out</button></nav><div className="dashTabs">{links.map(([href,label])=><Link className={path===href?"active":""} key={href} href={href}>{label}</Link>)}</div></>}
