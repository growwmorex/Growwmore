import Link from "next/link";
export default function Nav(){
 return <nav className="nav"><Link className="brand" href="/">GROWW<b>MORE</b></Link><div className="navlinks">
 <Link className="hideMob" href="/#packages">Collections</Link><Link className="hideMob" href="/#how">How it works</Link>
 <Link href="/login">Login</Link><Link className="btn" href="/join">Join Growwmore</Link></div></nav>;
}