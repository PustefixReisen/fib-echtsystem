import assert from 'node:assert/strict';
import {planRisChecks} from '../../packages/fachservices/src/u4-ris-monitor-policy.js';
const [daily,weekly]=planRisChecks('2026-10-30');
assert.deepEqual([daily.cadence,daily.startDate,daily.endDate,daily.status],['daily','2026-09-30','2026-10-30','proposed']);
assert.deepEqual([weekly.cadence,weekly.startDate,weekly.endDate,weekly.status],['weekly','2026-07-02','2026-10-30','proposed']);
assert.throws(()=>planRisChecks('2026-02-30'));
const leap=planRisChecks('2028-03-01');assert.equal(leap[0].startDate,'2028-01-31');
console.log('Two-tier RIS planning passed: no scheduler activated');
