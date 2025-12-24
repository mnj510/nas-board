import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 응답 객체 먼저 생성
    const response = NextResponse.json({ success: true })

    // Supabase 클라이언트 생성 (쿠키 설정 가능하도록)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Supabase Auth로 로그인
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // 프로필 정보 가져오기
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, name, is_admin')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: '프로필을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 사용자 정보 반환 (쿠키는 자동으로 설정됨)
    return NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        is_admin: profile.is_admin || false,
      },
    }, {
      headers: response.headers,
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '로그인에 실패했습니다.' },
      { status: 500 }
    )
  }
}
