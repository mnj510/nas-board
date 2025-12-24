import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 개발/빌드 환경에서 환경 변수가 없더라도 빌드가 죽지 않도록 방어 로직 추가
let supabase: SupabaseClient
let supabaseAdmin: SupabaseClient | null = null

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 를 확인하세요.'
  )
  // 더미 클라이언트: 잘못 사용될 경우 명확한 에러를 던지도록 함
  const dummyUrl = 'http://localhost'
  const dummyKey = 'public-anon-key'
  supabase = createClient(dummyUrl, dummyKey)
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)

  // 서버 사이드용 클라이언트 (Service Role Key 사용)
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null
}

export { supabase, supabaseAdmin }

