"use client";
import {useEffect,useState} from "react";import {onAuthStateChanged} from "firebase/auth";import {auth} from "@/lib/firebase";import {isAdminEmail} from "@/lib/constants";import {useRouter} from "next/navigation";
export function useAdmin(){const [ready,setReady]=useState(false),router=useRouter();useEffect(()=>onAuthStateChanged(auth,u=>{if(!u||!isAdminEmail(u.email)){router.replace("/login");return}setReady(true)}),[router]);return ready}
