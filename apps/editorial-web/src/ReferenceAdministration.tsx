import {useEffect, useState, type FormEvent} from 'react';
import {supabase} from './supabase.js';

type Kind = 'place'|'infrastructure'|'actor'|'facility'|'subject';
type Relation = 'located_in'|'crosses'|'connects'|'serves'|'functional_link'|'thematic_link';
type Link = {
  id:string; revision:number; status:'proposed'|'confirmed'|'rejected'|'withdrawn';
  subject_label:string; subject_kind:Kind; object_label:string; object_kind:Kind;
  relation_kind:Relation; evidence_url:string; rationale:string; created_at:string;
};
const kinds:{value:Kind;label:string}[]=[
  {value:'place',label:'Ort / Region'},{value:'infrastructure',label:'Infrastruktur'},
  {value:'actor',label:'Akteur'},{value:'facility',label:'Einrichtung'},{value:'subject',label:'Fachlicher Bezug'},
];
const relations:{value:Relation;label:string}[]=[
  {value:'located_in',label:'liegt in / an'},{value:'crosses',label:'verläuft durch'},
  {value:'connects',label:'verbindet'},{value:'serves',label:'erschließt / versorgt'},
  {value:'functional_link',label:'steht in funktionalem Zusammenhang mit'},
  {value:'thematic_link',label:'steht in thematischem Zusammenhang mit'},
];
const relationLabel=(kind:Relation)=>relations.find(r=>r.value===kind)?.label??kind;
const statusLabel=(status:Link['status'])=>({
  proposed:'Vorgeschlagen',confirmed:'Bestätigt',rejected:'Abgelehnt',withdrawn:'Zurückgenommen'
})[status];

type ApiResponse={ok:boolean;error?:string;links?:Link[];activeRevision?:number};
const defaultForm={
  subjectKind:'infrastructure' as Kind,subjectLabel:'',relationKind:'crosses' as Relation,
  objectKind:'place' as Kind,objectLabel:'',evidenceUrl:'',rationale:'',
};
export function ReferenceAdministration(){
  const [links,setLinks]=useState<Link[]>([]);
  const [activeRevision,setActiveRevision]=useState<number|null>(null);
  const [loading,setLoading]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [notice,setNotice]=useState<string|null>(null);
  const [form,setForm]=useState(defaultForm);
  const [refresh,setRefresh]=useState(0);

  useEffect(()=>{
    let ignore=false;
    setLoading(true);
    void supabase.functions.invoke<ApiResponse>('fib-reference-admin',{body:{action:'list'}})
      .then(({data,error:apiError})=>{
        if(ignore)return;
        if(apiError||!data?.ok){setError('Referenzen konnten nicht geladen werden.');return;}
        setLinks(data.links??[]);
        setActiveRevision(data.activeRevision??0);
        setError(null);
      }).finally(()=>{if(!ignore)setLoading(false);});
    return()=>{ignore=true;};
  },[refresh]);
  async function propose(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(busy)return;
    setBusy(true);setError(null);setNotice(null);
    try{
      const {data,error:apiError}=await supabase.functions.invoke<ApiResponse>('fib-reference-admin',{body:{
        action:'propose',subject:{kind:form.subjectKind,label:form.subjectLabel},
        relationKind:form.relationKind,object:{kind:form.objectKind,label:form.objectLabel},
        evidenceUrl:form.evidenceUrl,rationale:form.rationale,
      }});
      if(apiError||!data?.ok)throw Error(data?.error??'api_error');
      setForm(defaultForm);setNotice('Referenzbeziehung zur Prüfung vorgeschlagen.');
      setRefresh(n=>n+1);
    }catch{setError('Vorschlag konnte nicht gespeichert werden. Bitte Daten und Rechte prüfen.');}
    finally{setBusy(false);}
  }
  async function decide(item:Link,decision:'confirmed'|'rejected'){
    if(busy)return;
    setBusy(true);setError(null);setNotice(null);
    try{
      const {data,error:apiError}=await supabase.functions.invoke<ApiResponse>('fib-reference-admin',{
        body:{action:'decide',linkId:item.id,revision:item.revision,decision}
      });
      if(apiError||!data?.ok)throw Error(data?.error??'api_error');
      setNotice(decision==='confirmed'
        ? 'Referenzbeziehung bestätigt. Sie gehört jetzt zum aktiven Referenzkontext.'
        : 'Referenzbeziehung abgelehnt.');
      setRefresh(n=>n+1);
    }catch{setError('Entscheidung fehlgeschlagen. Eventuell wurde der Vorschlag bereits bearbeitet. Bitte neu laden.');}
    finally{setBusy(false);}
  }
  const field=(key:keyof typeof defaultForm,value:string)=>
    setForm(p=>({...p,[key]:value}));
  return <section className="stack" aria-label="Referenzsystem">
    <div className="page-heading">
      <div>
        <p className="eyebrow">Administration · Informationsgewinnung</p>
        <h1>Referenzbeziehungen</h1>
        <p>Belegte räumliche, funktionale und thematische Beziehungen für den Recherchehorizont prüfen.</p>
        {activeRevision!==null&&<p className="meta">Aktive Referenzfassung: {activeRevision}</p>}
      </div>
    </div>
    <div className="panel card-headed">
      <div className="section-heading"><h2>Neue Referenzbeziehung vorschlagen</h2></div>
      <p>Nur bestätigte Beziehungen gehen in den verbindlichen Recherchekontext ein. Ein Vorschlag verändert die aktive Suche noch nicht.</p>
      <form onSubmit={e=>void propose(e)} className="stack">
        <div className="reference-admin-grid">
          <label>Ausgangsobjekt – Art
            <select value={form.subjectKind} onChange={e=>field('subjectKind',e.target.value as Kind)}>
              {kinds.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}
            </select>
          </label>
          <label>Ausgangsobjekt – Name
            <input required maxLength={180} minLength={2} value={form.subjectLabel} onChange={e=>field('subjectLabel',e.target.value)} placeholder="z. B. Radschnellweg München–Markt Schwaben"/>
          </label>
          <label>Beziehung
            <select value={form.relationKind} onChange={e=>field('relationKind',e.target.value as Relation)}>
              {relations.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}
            </select>
          </label>
          <label>Zielobjekt – Art
            <select value={form.objectKind} onChange={e=>field('objectKind',e.target.value as Kind)}>
              {kinds.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}
            </select>
          </label>
          <label>Zielobjekt – Name
            <input required maxLength={180} minLength={2} value={form.objectLabel} onChange={e=>field('objectLabel',e.target.value)} placeholder="z. B. Feldkirchen"/>
          </label>
          <label>Beleg (HTTPS-Link)
            <input type="url" required pattern="https://.*" maxLength={2000} value={form.evidenceUrl} onChange={e=>field('evidenceUrl',e.target.value)} placeholder="https://…"/>
          </label>
        </div>
        <label>Begründung
          <textarea required minLength={8} maxLength={2000} value={form.rationale} onChange={e=>field('rationale',e.target.value)}
            placeholder="Warum gilt diese Beziehung und welche Bedeutung hat sie für die Recherche?"/>
        </label>
        <div className="button-row"><button type="submit" className="primary" disabled={busy}>Vorschlagen</button></div>
      </form>
    </div>
    <section className="panel card-headed" aria-label="Verwaltete Referenzbeziehungen">
      <div className="section-heading"><h2>Vorhandene Beziehungen</h2>
        <button type="button" onClick={()=>setRefresh(n=>n+1)} disabled={loading||busy}>Aktualisieren</button>
      </div>
      {loading&&<p role="status">Beziehungen werden geladen …</p>}
      {!loading&&!links.length&&<p>Noch keine Referenzbeziehungen vorhanden.</p>}
      <div className="stack">
        {links.map(link=><article className="reference-admin-entry" key={link.id}>
          <div><strong>{link.subject_label} – {relationLabel(link.relation_kind)} – {link.object_label}</strong>
            <p className="meta">{statusLabel(link.status)} · Revision {link.revision}</p></div>
          <p>{link.rationale}</p>
          <a href={link.evidence_url} target="_blank" rel="noopener noreferrer">Beleg öffnen</a>
          {link.status==='proposed'&&<div className="button-row">
            <button className="primary" type="button" disabled={busy} onClick={()=>void decide(link,'confirmed')}>Bestätigen</button>
            <button type="button" disabled={busy} onClick={()=>void decide(link,'rejected')}>Ablehnen</button>
          </div>}
        </article>)}
      </div>
    </section>
    {error&&<p className="status-message" role="alert">{error}</p>}
    {notice&&<p className="status-message" role="status">{notice}</p>}
  </section>;
}
