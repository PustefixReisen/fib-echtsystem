import assert from 'node:assert/strict';
import {calendarMonth,calendarSessions} from '../../supabase/functions/_shared/ris-calendar.ts';
const host='https://buergerinfo-feldkirchen.digitalfabrix.de';
assert.equal(calendarMonth(2026,10),host+'/si0040.asp?__cjahr=2026&__cmonat=10&__canz=1&__cselect=0');
assert.throws(()=>calendarMonth(2026,13),/invalid_calendar_period/);
const html=`<html><body>
<a href="si0057.asp?__ksinr=1030" title="Gemeinderat 01.10.2026">Sitzung</a>
<a href="si0057.asp?__ksinr=1031">Sitzung</a>
<a href="si0057.asp?__ksinr=1078">Sonstiger Termin</a>
<a href="si0057.asp?__ksinr=1032&amp;x=1">Gemeinderat 29.10.2026</a>
<a href="/si0057.asp?__ksinr=1032">Doppelt</a>
<a href="vo0050.asp?__kvonr=8644">Vorlage ohne Sitzungsbezug</a>
<a href="https://evil.example/si0057.asp?__ksinr=123">Fremde Quelle</a>
</body></html>`;
assert.deepEqual(calendarSessions(html),[1030,1031,1078,1032].map(id=>host+'/si0057.asp?__ksinr='+id));
console.log('RIS monthly calendar session discovery: OK');
