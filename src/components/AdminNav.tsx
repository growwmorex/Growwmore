"use client";
import Link from "next/link";import {usePathname,useRouter} from "next/navigation";import {signOut} from "firebase/auth";import {auth} from "@/lib/firebase";
const links=[["/admin","Overview"],["/admin/payments","Payments"],["/admin/members","Members"],["/admin/packages","Packages"],["/admin/referrals","Referrals"],["/admin/withdrawals","Withdrawals"],["/admin/finance","Finance"]];
export default function AdminNav(){const p=usePathname(),r=useRouter();return <><nav className="nav"><Link className="brand" href="/admin">GROWWMORE <b>ADMIN OS</b></Link><button className="btn ghost" onClick={()=>signOut(auth).then(()=>r.push("/"))}>Sign out</button></nav><div className="dashTabs">{links.map(([h,l])=><Link className={p===h?"active":""} href={h} key={h}>{l}</Link>)}</div></>}
