import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from './supabase'

export interface User {
  id: string
  email: string
  name: string
  is_admin: boolean
  // 유료 회원 여부
  is_paid?: boolean
}

// Supabase Auth를 사용한 현재 사용자 가져오기
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // 쿠키 설정 실패 무시 (서버 컴포넌트에서만 읽기 가능)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // 쿠키 삭제 실패 무시
            }
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // 프로필 정보 가져오기
    if (!supabaseAdmin) {
      return null
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, name, is_admin, is_paid')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      is_admin: profile.is_admin || false,
      is_paid: profile.is_paid || false,
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// 세션 가져오기 (클라이언트 컴포넌트용)
export async function getSession() {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // 쿠키 설정 실패 무시
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // 쿠키 삭제 실패 무시
            }
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    return null
  }
}
