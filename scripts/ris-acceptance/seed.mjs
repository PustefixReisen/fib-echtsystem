// Prepare only the private acceptance database, through the same authenticated handlers.
import pg from 'pg';
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
const root=process.env.RUNNER_TEMP;
const f=JSON.parse(readFileSync(join(root,'ris-e2e.json'),'utf8'));
const u=new URL(f.runtime);
if(u.hostname!=='127.0.0.1'||u.port!=='54323'||u.pathname!=='/fib_u4_test'||u.username!=='fib_app')throw Error('Nur isolierter Runtime-Login zulässig.');
const db=new pg.Client({connectionString:f.runtime});await db.connect();
const first=async(q,p=[])=> (await db.query(q,p)).rows[0];
const rationale='Vorbereiteter lokaler Abnahmebestand aus dokumentiertem RIS-Textauszug; keine persönliche Nutzerabnahme.';
async function api(body,name='fib-editorial-write'){
 const r=await fetch('http://127.0.0.1:54321/functions/v1/'+name,{method:'POST',headers:{'content-type':'application/json',apikey:f.anon,authorization:'Bearer '+f.users.admin.token},body:JSON.stringify(body)});
 if(!r.ok)throw Error('Abnahmevorbereitung: '+(body.action??name)+' HTTP '+r.status);
 return r.json();
}
try{
 for(let i=0;i<12;i++){
  await api({commit:true},'fib-u4-ris-pilot');
  if((await first('select count(*) n from fib.ris_document_versions')).n==='6')break;
 }
 if((await first('select count(*) n from fib.ris_sessions')).n!=='2')throw Error('Sitzungsbestand unvollständig.');
 await api({commit:true},'fib-u4-pilot');
 const session=await first("select id from fib.ris_sessions where source_url like '%=1031'");
 const d=await first("select d.*,v.extracted_text from fib.ris_documents d join fib.ris_document_versions v on v.id=d.latest_version_id where d.source_url like '%id=75785'");
 const link=await first('select id from fib.ris_document_links where document_id=$1 and agenda_id is null',[d.id]);
 const source=await first("select id from fib.sources where name='RIS Feldkirchen'");
 await api({action:'ris_review_document',linkId:link.id,versionId:d.latest_version_id,kind:'minutes',status:'confirmed',rationale});
 const finding=await api({action:'ris_accept_finding',versionId:d.latest_version_id,sourceId:source.id,title:'Niederschrift 15.10.2026 – vorbereiteter Abnahmebestand'});
 const event=await api({action:'source_create_event',findingId:finding.findingId,title:'Beschlüsse 15.10.2026 – vorbereiteter Abnahmebestand',rationale,approval:true,requestId:randomUUID()});
 // Use the documented reduced reference quotes even with a full private original PDF.
 // unpdf may normalize whitespace differently; only copy a matching exact runtime excerpt.
 const full=d.extracted_text;
 const find=(prefix,suffix)=>{
   const a=full.indexOf(prefix),b=full.indexOf(suffix,a);
   if(a<0||b<a||full.indexOf(prefix,a+prefix.length)>=0)throw Error('Originaltext weicht von Referenz ab; keine Beschlusspunkte erfunden.');
   return full.slice(a,b+suffix.length);
 };
 const cases=[
  ['2','zurueckgezogen','no_vote',null,null,find('Der Antrag wurde zurückgezogen','auf eine Abstimmung verzichtet.')],
  ['3','1','rejected',7,13,find('Der Gemeinderat beschließt einen Entwurf','im Haushalt 2027 vorzusehen.')],
  ['6','1','accepted',17,2,find('Der Gemeinderat beurteilt die vorliegende Voranfrage','Bereich des Plangebietes sowie die Anpassung der baulichen Parameter.')],
  ['6','2','accepted',19,0,find('Die Verwaltung wird beauftragt, aufgrund der relevanten Anpassungen','zu erarbeiten.')]
 ];
 for(const [number,key,result,yes,no,wording] of cases){
  const top=await first('select id from fib.ris_agenda_items where session_id=$1 and number=$2',[session.id,number]);
  await api({action:'acquire_lock',objectType:'event',objectId:event.eventId},'fib-coordination');
  try{
   await api({action:'ris_link_event',agendaId:top.id,eventId:event.eventId,role:'decision',rationale});
   // Store a bounded exact quote including the following vote, not the entire original minutes.
   const a=full.indexOf(wording),after=full.slice(a+wording.length);
   const end=number==='2'?'abgesetzt':number==='3'?'Nein 13':key==='1'?'Nein 2':'Nein 0';
   const voteEnd=after.indexOf(end);
   if(voteEnd<0||voteEnd>4000)throw Error('Wortgetreuer Abstimmungsbeleg fehlt.');
   const quote=full.slice(a,a+wording.length+voteEnd+end.length);
   const suggestion=await api({action:'ris_suggest',agendaId:top.id,versionId:d.latest_version_id,kind:'decision',origin:'editor',payload:{eventId:event.eventId,pointKey:key,wording,evidenceQuote:quote,result,yes,no,abstention:null}});
   await api({action:'ris_review_suggestion',suggestionId:suggestion.suggestionId,status:'confirmed',rationale});
  }finally{await api({action:'release_lock',objectType:'event',objectId:event.eventId},'fib-coordination');}
 }
 if((await first('select count(*) n from fib.messages')).n!=='0')throw Error('Unerwartete Meldung.');
 writeFileSync(join(root,'Pruefbestand.txt'),'Lokaler Startbestand: 1032 TOP 2/3 ungeprüft, keine tatsächlichen Beschlüsse.\n1031 TOP 2/3/6: vier vorbereitete Prüfbeschlüsse mit dokumentierten Originaltextauszügen; Genehmigung und Verfahrensstand unbekannt.\nParkraumkonzept: Quellenbeobachtung zur eigenen Übernahme; bestehender Prüf-Vorgang und Prüf-Thema vorhanden.\nDie Vorbereitungsentscheidungen sind keine persönliche Nutzerabnahme. Deine Bearbeitungen bleiben bei Wiederaufnahme erhalten.\n',{mode:0o600});
 console.log('Drei lokale Referenzfälle vorbereitet; keine Meldung oder Veröffentlichung angelegt.');
}finally{await db.end();}
