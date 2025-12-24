import db from './db'

// SQLite를 PostgreSQL과 유사한 인터페이스로 래핑
export const dbHelper = {
  query: (sql: string, params: any[] = []) => {
    try {
      // SELECT 쿼리
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        // PostgreSQL의 $1, $2를 ?로 변환
        const convertedSql = sql.replace(/\$(\d+)/g, '?')
        const stmt = db.prepare(convertedSql)
        const rows = stmt.all(...params)
        return Promise.resolve({ rows })
      }
      
      // INSERT, UPDATE, DELETE 쿼리
      if (
        sql.trim().toUpperCase().startsWith('INSERT') ||
        sql.trim().toUpperCase().startsWith('UPDATE') ||
        sql.trim().toUpperCase().startsWith('DELETE')
      ) {
        const convertedSql = sql.replace(/\$(\d+)/g, '?')
        const stmt = db.prepare(convertedSql)
        const result = stmt.run(...params)
        
        // RETURNING 절 처리
        if (sql.includes('RETURNING')) {
          const returningMatch = sql.match(/RETURNING\s+(.+)/i)
          if (returningMatch) {
            const selectSql = `SELECT ${returningMatch[1]} FROM ${sql.match(/FROM\s+(\w+)/i)?.[1] || 'unknown'} WHERE rowid = ?`
            const selectStmt = db.prepare(selectSql)
            const row = selectStmt.get(result.lastInsertRowid)
            return Promise.resolve({ rows: row ? [row] : [] })
          }
        }
        
        return Promise.resolve({ rows: [] })
      }
      
      // 기타 쿼리
      const convertedSql = sql.replace(/\$(\d+)/g, '?')
      const stmt = db.prepare(convertedSql)
      const rows = stmt.all(...params)
      return Promise.resolve({ rows })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 단일 행 조회
  queryOne: (sql: string, params: any[] = []) => {
    const convertedSql = sql.replace(/\$(\d+)/g, '?')
    const stmt = db.prepare(convertedSql)
    const row = stmt.get(...params)
    return Promise.resolve({ rows: row ? [row] : [] })
  },
  
  // 실행 (INSERT, UPDATE, DELETE)
  execute: (sql: string, params: any[] = []) => {
    const convertedSql = sql.replace(/\$(\d+)/g, '?')
    const stmt = db.prepare(convertedSql)
    const result = stmt.run(...params)
    return Promise.resolve({ rows: [], rowCount: result.changes })
  },
}

// PostgreSQL 스타일의 쿼리 헬퍼
export async function query(sql: string, params: any[] = []) {
  return dbHelper.query(sql, params)
}

