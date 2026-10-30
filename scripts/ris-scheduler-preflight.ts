import pg from 'pg';

// Explicitly read-only preflight. Never creates extensions, schedules jobs,
// reads Vault secrets, or activates a function.
const url=process.env.FIB_DATABASE_URL;
if(!url){console.error('FIB_DATABASE_URL not configured; no connection made');process.exitCode=2;}
else{
 const pool=new pg.Pool({connectionString:url,max:1,connectionTimeoutMillis:5000});
 try{
  const client=await pool.connect();
  try{
   await client.query('begin read only');
   const extensions=await client.query(
    "select name,installed_version,default_version from pg_available_extensions where name=any($1::text[]) order by name",
    [['pg_cron','pg_net','supabase_vault']]);
   const schema=await client.query(
    "select to_regclass('fib.ris_scan_cursors') is not null as cursors_present, to_regclass('fib.source_scopes') is not null as scopes_present");
   // Names only, never job commands, headers, Vault values, or credentials.
   const installed=new Map(extensions.rows.map(x=>[x.name,Boolean(x.installed_version)]));
   const report={
    extensions:Object.fromEntries(['pg_cron','pg_net','supabase_vault'].map(x=>[x,installed.get(x)??false])),
    cursorTablePresent:schema.rows[0]?.cursors_present===true,
    scopeTablePresent:schema.rows[0]?.scopes_present===true,
    schedulerReadyForCommissioning:installed.get('pg_cron')===true&&installed.get('pg_net')===true&&installed.get('supabase_vault')===true
   };
   console.log(JSON.stringify(report,null,2));
   await client.query('rollback');
  }finally{client.release()}
 }catch(e){console.error('RIS preflight failed:',e instanceof Error?e.message:String(e));process.exitCode=1;}
 finally{await pool.end();}
}
