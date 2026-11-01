// Read-only RIS diagnosis: public pages only, no database or auth.
const origin = 'https://buergerinfo-feldkirchen.digitalfabrix.de';
const entry = origin + '/do0040.asp?smcmode=32832';
const limit = 16;
function links(html, base) {
  return [...html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)]
    .map(m => { try { const u = new URL(m[1].replace(/&amp;/g,'&'),base); return u.origin===origin ? u : null; } catch { return null; } })
    .filter(Boolean);
}
function canonical(u) {
  const name = u.pathname.toLowerCase();
  const key = /^\/si\d+\.asp$/.test(name)?'__ksinr':/^\/vo\d+\.asp$/.test(name)?'__kvonr':null;
  const value=key&&u.searchParams.get(key);
  return value && /^\d+$/.test(value) ? origin+name+'?'+key+'='+value : null;
}
async function page(url) {
  const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(20000)});
  if(!r.ok) throw Error('HTTP '+r.status+' '+url);
  return r.text();
}
const candidates=new Set(), seen=new Set(), pages=[entry];
try {
  while (pages.length && seen.size<limit) {
    const u=pages.shift(); if(seen.has(u)) continue; seen.add(u);
    const html=await page(u);
    for(const link of links(html,u)) {
      const c=canonical(link); if(c && c.includes('/vo')) candidates.add(c);
      if(link.pathname.toLowerCase()==='/do0040.asp' && /^\d{7}$/.test(link.searchParams.get('smcadat')??'') && !seen.has(link.href) && !pages.includes(link.href)) pages.push(link.href);
    }
  }
  console.log('Gepruefte Freigabeseiten:',seen.size,'Vorlagenkandidaten:',candidates.size);
  let missing=0, checked=0;
  for(const u of [...candidates].slice(0,60)) {
    checked++;
    try {
      const html=await page(u);
      const sessions=[...new Set(links(html,u).map(canonical).filter(v=>v&&v.includes('/si')))];
      if(!sessions.length){missing++;console.log('OHNE SITZUNG:',u);}
    } catch(e) {console.log('ABRUFFEHler:',u,String(e.message));}
  }
  console.log('Vorlagen geprueft:',checked,'ohne direkten Sitzungslink:',missing);
  console.log('Keine Daten geaendert. Die Untersuchung ist keine Vollstaendigkeitspruefung.');
} catch(e){console.error('DIAGNOSE FEHLGESCHLAGEN:',String(e.message));process.exitCode=1;}
