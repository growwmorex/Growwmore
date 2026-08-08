"use client";
import {useEffect,useState} from "react";import {onAuthStateChanged} from "firebase/auth";import {getDoc} from "firebase/firestore";import {auth} from "@/lib/firebase";import {Member,memberRef} from "@/lib/user";import {useRouter} from "next/navigation";
export function useMember(){const [member,setMember]=useState<Member|null>(null),[loading,setLoading]=useState(true),router=useRouter();
 useEffect(()=>onAuthStateChanged(auth,async u=>{if(!u){setLoading(false);return router.replace("/login")}const s=await getDoc(memberRef(u.uid));if(!s.exists()){setLoading(false);return router.replace("/join")}const d=s.data() as Member;if(d.paymentStatus!=="approved"){setLoading(false);return router.replace("/payment")}setMember(d);setLoading(false)}),[router]);
 return {member,loading};
}
