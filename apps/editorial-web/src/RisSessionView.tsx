import {useState} from "react";
import {OriginalLink} from "./ActionIcon.js";
type Row=Record<string,any>;
export const topTitle=(a:Row)=>String(a.title??"").replace(/\s+Beschluss:\s*.+$/i,"");
export const topStatus=(a:Row)=>a.observed_treatment ||
  String(a.title??"").match(/\s+Beschluss:\s*(.+)$/i)?.[1] ||
  ({withdrawn:"Abgesetzt",deferred:"Vertagt",treated:"Behandelt",announced:"Angekündigt"} as Row)[a.treatment_status] || "Nicht angegeben";
type Props={
  data:Row;
};
const date=(v:unknown)=>v?new Date(String(v)).toLocaleDateString("de-DE"):"Datum unbekannt";
const outcome=(s:unknown)=>({
  accepted:"angenommen",rejected:"abgelehnt",no_vote:"keine Abstimmung",
  unknown:"nicht eindeutig ermittelt",
} as Row)[String(s)]??"nicht eindeutig ermittelt";
export function RisSessionView({data}:Props){
  const [infoOpen,setInfoOpen]=useState(false);
  const session:Row=data.session??{};
  const agenda:Row[]=[...(data.agenda??[])].sort((a,b)=>Number(a.number)-Number(b.number));
  const documents:Row[]=(data.documents??[]).filter((document:Row)=>document.status!=="rejected");
  const votes:Row[]=data.topVotes??[];
  const when=date(session.session_date);
  const docTitle=(d:Row)=>d.kind==="minutes"?"Niederschrift"
    :d.kind==="unknown" && !d.agenda_id?"Tagesordnung"
    :d.kind==="proposal"?"Beschlussvorlage"
    :d.kind==="attachment"?"Anlage"
    :d.kind==="decision"?"Beschlussdokument"
    :"Tagesordnung";
  const docs=(items:Row[])=>items.length?(
    <ul className="ris-document-list">
      {items.map(d=><li key={String(d.id??d.document_id)}>
        <OriginalLink url={d.source_url} label={docTitle(d)+" im RIS öffnen"} text={<><strong>{docTitle(d)}</strong> – {when}
          {(d.kind!=="unknown" && d.agenda_id && (d.reference||d.original_title))
            ?" – "+String(d.reference??d.original_title):""}
        </>}/>
      </li>)}
    </ul>
  ):null;
  const minutes=documents.filter(d=>d.kind==="minutes" && !d.agenda_id);
  const meetingDocuments=documents.filter(d=>!d.agenda_id).sort((a,b)=>Number(a.kind==="minutes")-Number(b.kind==="minutes"));
  return <div className="ris-simplified ris-source-readonly">
    <div className="source-navigation-row ris-detail-heading">
      <h1>{String(session.committee_name??"Gemeinderat")} · {when}</h1>
      <button className="ris-info-icon" type="button" aria-label="Info zur RIS-Übernahme"
        aria-expanded={infoOpen} onClick={()=>setInfoOpen(x=>!x)}>ⓘ</button>
    </div>
    {infoOpen&&<section className="panel" role="note" aria-label="RIS-Geschäftsregel">
      <strong>Verbindliche RIS-Geschäftsregel</strong>
      <p>RIS-Daten werden ausschließlich aus dem amtlichen Ratsinformationssystem
        übernommen und in FIB niemals redaktionell bearbeitet oder ergänzt.</p>
      <p>Zu jedem Tagesordnungspunkt entsteht automatisch ein FIB-Ereignis.
        Seine amtlichen Dokumente sowie die Sitzungsniederschrift werden
        als Fundstellen verknüpft. Das Abstimmungsergebnis wird aus der
        Niederschrift übernommen, sobald es verlässlich ermittelbar ist.
        Der Beschlusswortlaut wird nicht nach FIB kopiert. Zur Sitzung
        selbst werden keine Ereignisse angelegt.</p>
    </section>}
    <section className="panel card-headed">
      <div className="section-heading"><h2>Sitzungsübersicht</h2></div>
      <div className="ris-overview-links">
        <OriginalLink url={session.source_url} label="Sitzung im RIS öffnen"
          text={<><strong>Ratsinformationssystem</strong> – {when}</>}/>
        {docs(meetingDocuments)}
      </div>
    </section>
    <section className="panel card-headed">
      <div className="section-heading"><h2>{agenda.length} öffentliche TOPs</h2></div>
      {agenda.map((a:Row)=>{
        const topDocs=documents.filter(d=>d.agenda_id===a.id);
        const topVotes=votes.filter(v=>v.agenda_id===a.id);
        const minutesLink=minutes[0] && <OriginalLink url={minutes[0].source_url}
          label={"Niederschrift vom "+when+" im RIS öffnen"} text={"Niederschrift – "+when}/>;
        return <article className="ris-top-item" key={a.id}>
          <h3>TOP {a.number} · {topTitle(a)}</h3>
          {docs(topDocs)}
          <div className="ris-minutes-outcomes">
            <strong>Beschlussergebnis</strong>
            {topVotes.length?topVotes.map(v=><p className="ris-result-line" key={v.vote_index}>
              {topVotes.length>1?"Abstimmung "+v.vote_index+": ":""}
              {v.result==="no_vote" && topStatus(a)!=="Nicht angegeben" ? topStatus(a) : outcome(v.result)}
              {(v.yes_count!==null && v.yes_count!==undefined)
                ?" · Ja "+v.yes_count:""}
              {(v.no_count!==null && v.no_count!==undefined)
                ?" · Nein "+v.no_count:""}
              {(v.abstention_count!==null && v.abstention_count!==undefined)
                ?" · Enthaltungen "+v.abstention_count:""}
            </p>)
            :<p className="ris-result-line meta">{topStatus(a)==="Nicht angegeben"
              ? "Kein Abstimmungsergebnis verfügbar." : topStatus(a)}</p>}
            {minutesLink}
          </div>
        </article>;
      })}
    </section>
  </div>;
}
