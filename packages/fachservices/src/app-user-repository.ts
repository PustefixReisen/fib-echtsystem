import type { FibAppUserRecord, FibAppUserRepository } from './identity.js';

export interface FibSqlExecutor {
  queryOne<T>(sql: string, params: readonly unknown[]): Promise<T | null>;
}

interface FibAppUserRow {
  user_id: string;
  full_name: string;
  call_name: string | null;
  role: 'editor' | 'admin';
  active: boolean;
  setup_status: 'invited' | 'setup_pending' | 'active' | 'deactivated';
}

export class SqlFibAppUserRepository implements FibAppUserRepository {
  constructor(private readonly db: FibSqlExecutor) {}

  async findByUserId(userId: string): Promise<FibAppUserRecord | null> {
    const row = await this.db.queryOne<FibAppUserRow>(
      `select user_id, full_name, call_name, role, active, setup_status
         from fib.app_users
        where user_id = $1`,
      [userId],
    );

    if (!row) return null;

    return {
      userId: row.user_id,
      role: row.role,
      active: row.active,
    };
  }
}
