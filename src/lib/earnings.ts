import {collection,getDocs,query,where} from "firebase/firestore";
import {db} from "./firebase";

export type CommissionTransaction={
 id:string;referrerUid:string;amount:number;sourceMemberUid?:string;sourceEmail?:string;packageId?:string;
 type:"referral_commission"|"manual_adjustment";status:"credited"|"reversed";createdAt?:any;note?:string;
};

function toDate(value:any){
 if(!value)return null;
 if(typeof value?.toDate==="function")return value.toDate() as Date;
 if(value instanceof Date)return value;
 const d=new Date(value);return Number.isNaN(d.getTime())?null:d;
}

export async function getCommissionTransactions(uid:string){
 const s=await getDocs(query(collection(db,"commissionTransactions"),where("referrerUid","==",uid)));
 return s.docs.map(d=>({id:d.id,...d.data()} as CommissionTransaction)).sort((a,b)=>(toDate(b.createdAt)?.getTime()||0)-(toDate(a.createdAt)?.getTime()||0));
}

export function earningWindows(rows:CommissionTransaction[]){
 const credited=rows.filter(x=>x.status==="credited");
 const now=new Date();
 const todayStart=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 const sevenStart=new Date(todayStart);sevenStart.setDate(sevenStart.getDate()-6);
 const monthStart=new Date(now.getFullYear(),now.getMonth()-1,1);
 const monthEnd=new Date(now.getFullYear(),now.getMonth(),1);
 const sum=(filter:(d:Date)=>boolean)=>credited.reduce((n,x)=>{const d=toDate(x.createdAt);return n+(d&&filter(d)?Number(x.amount||0):0)},0);
 return {
  today:sum(d=>d>=todayStart),
  last7:sum(d=>d>=sevenStart),
  lastMonth:sum(d=>d>=monthStart&&d<monthEnd),
  total:credited.reduce((n,x)=>n+Number(x.amount||0),0)
 };
}
