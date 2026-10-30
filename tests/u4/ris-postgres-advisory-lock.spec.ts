import assert from 'node:assert/strict';
import pg from 'pg';

// Dedicated temporary PostgreSQL instance from GitHub Actions.
// Test the exact two-key session advisory lock used by RIS scheduler.
const pool=new pg.Pool({connectionString:process.env.U4_TEST_DATABASE_URL,max:4});
const key='select pg_try_advisory_lock(41004,4001) as acquired';
const unlock='select pg_advisory_unlock(41004,4001) as unlocked';
async function main(){
 const first=await pool.connect();
 const second=await pool.connect();
 try{
  assert.equal((await first.query(key)).rows[0].acquired,true);
  assert.equal((await second.query(key)).rows[0].acquired,false,
   'competing daily/weekly RIS invocation must not enter');
  await first.query('begin');
  await first.query('rollback');
  assert.equal((await second.query(key)).rows[0].acquired,false,
   'session lock must remain held across individual batch transactions');
  assert.equal((await first.query(unlock)).rows[0].unlocked,true);
  assert.equal((await second.query(key)).rows[0].acquired,true,
   'next invocation must acquire after prior run releases lock');
  assert.equal((await second.query(unlock)).rows[0].unlocked,true);
  assert.equal((await first.query(unlock)).rows[0].unlocked,false,
   'lock must not remain held');
  console.log('RIS PostgreSQL real-session lock isolation and release passed');
 }finally{first.release();second.release();await pool.end();}
}
void main().catch(err=>{console.error(err);process.exitCode=1});
