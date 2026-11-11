import pg from 'pg';
import {clientOptions,options} from '../ris-shared-apps/io.mjs';
import {runRisAnalysis,type AnalysisDatabase} from '../../supabase/functions/_shared/ris-analysis-worker.ts';
// Existing protected maintenance workflow, derived products only. No PDF or AI path.
if(options.approval!=='RIS-ANALYSIS-428')throw Error('Explicit RIS-ANALYSIS-428 scope required');
const pool=new pg.Pool(clientOptions(process.env.FIB_MAINTENANCE_DATABASE_URL));
const db:AnalysisDatabase={
 unsafe:async(q,p)=>(await pool.query(q,p)).rows,
 transaction:async work=>{
  const c=await pool.connect();
  try {await c.query('begin');const result=await work({unsafe:async(q,p)=>(await c.query(q,p)).rows});await c.query('commit');return result;}
  catch(e){await c.query('rollback');throw e;}finally{c.release();}
 },
};
try {
 const total=Number((await pool.query('select count(*)::int n from fib.ris_top_events')).rows[0].n);
 let checked=0;
 for(let batch=0;batch<30;batch++) {
  const result=await runRisAnalysis(db,{documentPolicy:[],extractPages:async()=>{throw Error('Documents disabled');}});
  console.log(JSON.stringify({batch:batch+1,...result}));
  if(result.failed)throw Error('Analysis batch failed; originals unaffected');
  checked+=result.checked;
  if(result.analyzed===0 && checked>=total)break;
  if(batch===29)throw Error('Analysis continuation needed');
 }
} finally {await pool.end();}
