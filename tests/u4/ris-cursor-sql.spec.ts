import assert from 'node:assert/strict';
import {SqlRisScanCursorStorage} from '../../packages/fachservices/src/u4-ris-cursor-sql.js';
const cursor={pending:['https://example.org/a'],visited:[],documents:[],failures:[]};
let saved='';
const db={
 async queryOne<T>(_sql:string,_p:readonly unknown[]):Promise<T|null>{throw new Error('transaction expected')},
 async transaction<T>(fn:(tx:{queryOne<X>(sql:string,p:readonly unknown[]):Promise<X|null>})=>Promise<T>):Promise<T>{
 return fn({async queryOne<X>(_sql:string,p:readonly unknown[]):Promise<X|null>{saved=String(p[1]);return {scope_id:p[0]} as X;}});
 }
};
const store=new SqlRisScanCursorStorage(db);
await db.transaction(tx=>store.save('scope',cursor,tx));
assert.deepEqual(JSON.parse(saved),cursor);
let threw=false;
try{await store.save('scope',cursor,db)}catch{threw=true}
assert.equal(threw,true);
console.log('U4 RIS cursor SQL transaction checks passed');
