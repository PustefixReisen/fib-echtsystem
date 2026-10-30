// U4 diagnostic only. No database writes or credentials.
// Execute: node scripts/u4-source-smoke.mjs
const targets = [
  ["Gemeinde Nachrichten","https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen"],
  ["RIS Sitzung 29.10.2026","https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1032&smcmode=32832"],
  ["RIS Dokumentfreigaben","https://buergerinfo-feldkirchen.digitalfabrix.de/do0040.asp?smcmode=32832"]
];
let failures = 0;
for(const [name,url] of targets){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),15000);
  try {
    const res=await fetch(url,{signal:controller.signal,headers:{"User-Agent":"FIB-SourceMonitor-IntegrationTest/0.1 (contact via project GitHub)",Accept:"text/html,application/xhtml+xml"}});
    const contentType=res.headers.get("content-type")||"";
    const body=await res.text();
    const anchors=[...body.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)].length;
    const valid=res.ok && contentType.includes("html") && anchors>0;
    if(!valid) failures++;
    console.log(JSON.stringify({name,status:res.status,contentType,bytes:body.length,anchors,valid,finalUrl:res.url,issue:valid?null:"Bad status/type/no links"}));
  }catch(e){failures++;console.log(JSON.stringify({name,error:String(e)}));}
  finally{clearTimeout(timer)}
}
if(failures) {console.error(failures+" source checks failed; sources must remain candidate");process.exitCode=1;}
