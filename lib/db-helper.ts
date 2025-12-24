import pool from './db'

// 이 파일은 과거 SQLite용 래퍼였지만,
// 현재는 Supabase 기반의 pool을 그대로 재사용하는 얇은 헬퍼입니다.

export const dbHelper = {
  query: (sql: string, params: any[] = []) => {
    return pool.query(sql, params)
  },
}

// PostgreSQL 스타일의 쿼리 헬퍼 (호환성 유지용)
export async function query(sql: string, params: any[] = []) {
  return dbHelper.query(sql, params)
}

