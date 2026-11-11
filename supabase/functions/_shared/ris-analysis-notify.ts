/** Post-import notification only. It cannot change the import's result or transaction. */
export async function notifyRisAnalysis(base:string|undefined,token:string|undefined,request=fetch) {
  if(!base || !token || token.length<32)return;
  try {
    await request(base+'/functions/v1/fib-ris-analysis',{
      method:'POST',headers:{'content-type':'application/json','x-fib-ris-scheduler':token},
      body:'{}',redirect:'error',signal:AbortSignal.timeout(90000),
    });
  } catch { /* The separate durable worker retries on the next invocation. */ }
}
