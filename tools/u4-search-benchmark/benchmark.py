#!/usr/bin/env python3
"""Reproducible A/B/C search benchmark. Requires OPENAI_API_KEY and SERPER_API_KEY."""
import json,os,sys,pathlib,urllib.request,datetime
CLASSIC=[
"Feldkirchen bei München Oktober 2026 Nachrichten","Feldkirchen München Landkreis Oktober 2026 Meldungen",
"Feldkirchen bei München Oktober 2026 Verkehr Infrastruktur","Feldkirchen bei München Oktober 2026 Gemeinderat Entwicklung",
"Feldkirchen bei München Oktober 2026 Kultur Vereine","Feldkirchen Kirchheim Aschheim Oktober 2026 Neuigkeiten",
"München Ost Oktober 2026 Verkehr Auswirkungen Gemeinden","Landkreis München Ost Oktober 2026 Projekte Wirtschaft",
"Feldkirchen bei München Oktober 2026 Umwelt Energie","Feldkirchen München Oktober 2026 Veranstaltungen Gesellschaft"]
HORIZON="Feldkirchen bei München (85622), 01.–28.10.2026 Veröffentlichungen; direkte und belegbare indirekte örtliche Bezüge, Verkehr, Infrastruktur, Kultur, Vereine, Umwelt. Nicht Feldkirchen in Niederbayern. Keine bekannten Fälle oder URLs nennen."
def post(url,headers,obj):
 r=urllib.request.Request(url,data=json.dumps(obj).encode(),headers={"Content-Type":"application/json",**headers},method="POST")
 with urllib.request.urlopen(r,timeout=60) as f:return json.load(f)
def plan(model,key,purpose,n,observations=None):
 prompt=HORIZON+"\n"+purpose+"\nAntworte NUR JSON mit dem Feld queries, exakt "+str(n)+" einzigartige Suchanfragen."
 if observations:prompt+="\nNur bisherige Snippets dieses Arms: "+json.dumps(observations,ensure_ascii=False)[:12000]
 r=post("https://api.openai.com/v1/chat/completions",{"Authorization":"Bearer "+key},{"model":model,"messages":[{"role":"system","content":"Entwickle Suchpläne, ohne bekannte Zielartikel oder Ergebnisse anderer Suchstrategien."},{"role":"user","content":prompt}],"response_format":{"type":"json_object"}})
 q=json.loads(r["choices"][0]["message"]["content"])["queries"]
 if len(q)!=n or len(set(q))!=n:raise ValueError("Invalid number of unique queries")
 return q,r.get("usage",{})
def search(key,q):
 r=post("https://google.serper.dev/search",{"X-API-KEY":key},{"q":q,"gl":"de","hl":"de","num":10})
 return [{"url":v.get("link",""),"title":v.get("title",""),"snippet":v.get("snippet",""),"position":v.get("position")} for v in r.get("organic",[])[:10]]
def main():
 if len(sys.argv)<2 or sys.argv[1]=="--dry-run":
  print(json.dumps({"classic":CLASSIC,"arms":["A","B","C"],"repeats":2,"queries_per_arm":10},ensure_ascii=False,indent=2));return
 out=pathlib.Path(sys.argv[1]);out.mkdir(parents=True,exist_ok=True)
 if list(out.iterdir()):raise ValueError("Output directory must be empty")
 ok,sk=os.environ["OPENAI_API_KEY"],os.environ["SERPER_API_KEY"]
 model=os.environ.get("FIB_BENCHMARK_MODEL","gpt-4.1-mini")
 for repeat in (1,2):
  for arm in "ABC":
   hits=[];usage=[];nq=0
   file=out/(arm+"-"+str(repeat)+".jsonl")
   phases=([CLASSIC] if arm=="A" else [None] if arm=="B" else [None,None,None])
   for phase in range(len(phases)):
    if arm!="A":
     n=10 if arm=="B" else [3,3,4][phase]
     purpose="Erzeuge einen einmaligen breiten Suchplan." if arm=="B" else ["Starte mit breiten Suchrichtungen.","Ergänze Suchrichtungen anhand bisheriger Resultate.","Vertiefe bisherige Lücken."][phase]
     queries,u=plan(model,ok,purpose,n,[{"title":x["title"],"snippet":x["snippet"]} for x in hits[-30:]] if phase else None)
     usage.append(u)
    else:queries=phases[phase]
    with file.open("a",encoding="utf-8") as f:
     for q in queries:
      result=search(sk,q);nq+=1;hits.extend(result)
      f.write(json.dumps({"time":datetime.datetime.now(datetime.timezone.utc).isoformat(),"query":q,"number":nq,"hits":result},ensure_ascii=False)+"\n")
   (out/(arm+"-"+str(repeat)+"-usage.json")).write_text(json.dumps({"model":model,"model_usage":usage,"queries":nq,"raw_results":len(hits),"unique_urls":len(set(v["url"] for v in hits))},indent=2),encoding="utf-8")
   print(arm,repeat,nq,len(hits),flush=True)
 print("No relevance or recall claims: human reference review required.")
if __name__=="__main__":main()
