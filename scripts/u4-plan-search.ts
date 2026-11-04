import pg from 'pg';
import {buildU4SearchPlan,parseActiveReferenceSnapshot} from '../packages/fachservices/src/u4-search-context.js';

// Operational diagnostic: prepares query directions from the confirmed database context.
// It does not execute searches, inspect web pages or select Fundstellen.
// Execute only server-side with private FIB runtime DB credentials.
const databaseUrl=process.env.U4_DATABASE_URL;
const location=(process.argv[2]??'').trim();
if (!databaseUrl || !location) throw Error('Usage: U4_DATABASE_URL=... npx tsx scripts/u4-plan-search.ts <location>');
const pool=new pg.Pool({connectionString:databaseUrl,max:1,ssl:{rejectUnauthorized:true}});
async function main() {
  const client=await pool.connect();
  try {
    await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
    const version=await client.query('select active_revision from fib.research_context_state where singleton=true');
    const references=await client.query(`select id, revision, subject_kind, subject_label,
      relation_kind, object_kind, object_label, evidence_url, rationale
      from fib.research_active_reference_context order by id`);
    await client.query('COMMIT');
    // PG int8 is normally returned as string; normalize explicitly.
    const revision=Number(version.rows[0]?.active_revision);
    const payload=parseActiveReferenceSnapshot({
      ok:true,activeRevision:revision,
      references:references.rows,
    });
    const plan=buildU4SearchPlan(payload,location);
    console.log(JSON.stringify(plan,null,2));
  } catch(error) {
    try {await client.query('ROLLBACK');} catch { /* Preserve original error. */ }
    throw error;
  } finally {client.release();}
}
void main().catch(error=>{console.error('Unable to build U4 search plan:',error instanceof Error?error.message:'unknown');process.exitCode=1}).finally(()=>pool.end());
