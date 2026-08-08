import {collection,doc,getDoc,getDocs,serverTimestamp,setDoc,updateDoc} from "firebase/firestore";import {db} from "./firebase";
export async function allDocs(name:string){const s=await getDocs(collection(db,name));return s.docs.map(d=>({id:d.id,...d.data()}))}
export async function setPackage(id:string,data:Record<string,unknown>){await setDoc(doc(db,"packageCatalog",id),{...data,updatedAt:serverTimestamp()},{merge:true})}
export async function setMemberState(uid:string,disabled:boolean){await updateDoc(doc(db,"members",uid),{disabled,updatedAt:serverTimestamp()})}
export async function rejectPayment(uid:string){await updateDoc(doc(db,"payments",uid),{status:"rejected",updatedAt:serverTimestamp()});await updateDoc(doc(db,"members",uid),{paymentStatus:"rejected",updatedAt:serverTimestamp()})}
export async function rejectWithdrawal(id:string,note:string){await updateDoc(doc(db,"withdrawals",id),{status:"rejected",adminNote:note,updatedAt:serverTimestamp()})}
