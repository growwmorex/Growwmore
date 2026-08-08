export function isTransientFirestoreError(error: unknown) {
  const value=(error instanceof Error?error.message:String(error||"")).toLowerCase();
  return value.includes("database is closing")||value.includes("database is hidden")||value.includes("client is offline")||value.includes("unavailable")||value.includes("network-request-failed")||value.includes("indexeddb");
}
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
async function waitUntilVisible(){
  if(typeof document==="undefined"||document.visibilityState==="visible") return;
  await new Promise<void>(resolve=>{
    let done=false;
    const finish=()=>{if(!done&&document.visibilityState==="visible"){done=true;document.removeEventListener("visibilitychange",finish);resolve();}};
    document.addEventListener("visibilitychange",finish);
    setTimeout(()=>{if(!done){done=true;document.removeEventListener("visibilitychange",finish);resolve();}},3000);
  });
}
export async function withFirestoreRetry<T>(action:()=>Promise<T>,attempts=3):Promise<T>{
  let last:unknown;
  for(let i=0;i<attempts;i++){try{if(i>0){await waitUntilVisible();await sleep(350*(i+1));}return await action();}catch(e){last=e;if(!isTransientFirestoreError(e)||i===attempts-1)throw e;}}
  throw last;
}
export function friendlyFirestoreError(error:unknown){
  if(isTransientFirestoreError(error))return "The secure connection was interrupted while returning from Google sign-in. Please keep this tab open and try once more.";
  if(error&&typeof error==="object"){const e=error as {code?:string;message?:string};if(e.code==="permission-denied")return "Your account signed in, but Firestore blocked the member record. Please contact support.";return e.message||"Could not reach the secure database.";}
  return String(error||"Could not reach the secure database.");
}
