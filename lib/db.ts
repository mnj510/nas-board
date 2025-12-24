import { supabase, supabaseAdmin } from './supabase'

// Supabase 클라이언트를 PostgreSQL과 유사한 인터페이스로 래핑
const pool = {
  query: async (sql: string, params: any[] = []) => {
    try {
      // Supabase는 직접 SQL 쿼리를 지원하지 않으므로,
      // RPC 함수나 테이블 메서드를 사용해야 합니다.
      // 하지만 기존 코드와의 호환성을 위해 간단한 래퍼를 제공합니다.
      
      // SELECT 쿼리 파싱
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        // 간단한 SELECT 쿼리는 Supabase의 from().select()로 변환
        // 복잡한 쿼리는 RPC 함수로 처리해야 합니다.
        throw new Error('Use Supabase client methods directly instead of raw SQL')
      }
      
      // INSERT, UPDATE, DELETE도 마찬가지
      throw new Error('Use Supabase client methods directly instead of raw SQL')
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  },
  
  rpc: async (functionName: string, params: any) => {
    const client = supabaseAdmin || supabase
    const { data, error } = await client.rpc(functionName, params)
    
    if (error) {
      throw error
    }
    
    return { rows: data || [] }
  }
}

export default pool
export { supabase, supabaseAdmin }
