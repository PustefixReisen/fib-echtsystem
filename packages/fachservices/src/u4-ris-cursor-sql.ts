import type {RisWindowCursor} from './u4-ris-window-scan.js';
import type {U4Sql} from './u4-source-monitor-sql.js';

type Row={cursor_state:RisWindowCursor};
export class SqlRisScanCursorStorage {
 constructor(private readonly db:U4Sql){}
 async read(scopeId:string):Promise<RisWindowCursor|undefined>{
  const row=await this.db.queryOne<Row>('select cursor_state from fib.ris_scan_cursors where scope_id=$1',[scopeId]);
  return row?.cursor_state;
 }
 /** Supply the same transaction handle used for saving document observations and run logs. */
 async save(scopeId:string,cursor:RisWindowCursor,tx:Pick<U4Sql,'queryOne'>):Promise<void>{
  const row=await tx.queryOne<{scope_id:string}>(`insert into fib.ris_scan_cursors(scope_id,cursor_state,updated_at)
   values ($1,$2::jsonb,now()) on conflict(scope_id) do update
   set cursor_state=excluded.cursor_state,updated_at=now() returning scope_id`,
   [scopeId,JSON.stringify(cursor)]);
  if(!row)throw new Error('RIS scan cursor could not be saved');
 }
}
