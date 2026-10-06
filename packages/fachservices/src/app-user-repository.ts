import type { FibAppUserRecord, FibAppUserRepository } from './identity.js';

export interface FibSqlExecutor {
  queryOne<T>(sql: string, params: readonly unknown[]): Promise<T | null>;
}

interface FibAppUserRow {
  user_id: string;
  role: 'editor' | 'admin';
  active: boolean;
}

export class SqlFibAppUserRepository implements FibAppUserRepository {
  constructor(private readonly db: FibSqlExecutor) {}

  async findByUserId(userId: string): Promise<FibAppUserRecord | null> {
    const row = await this.db.queryOne<FibAppUserRow>(
      `select user_id, role, active
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
