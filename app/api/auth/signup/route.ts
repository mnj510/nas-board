import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

const ADMIN_EMAIL = 'mnj510@naver.com'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    // Supabase Auth로 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || '회원가입에 실패했습니다.' },
        { status: 400 }
      )
    }

    // 프로필이 트리거로 자동 생성되지만, 관리자 권한 설정을 위해 업데이트
    const isAdmin = email === ADMIN_EMAIL
    
    if (isAdmin && supabaseAdmin) {
      await supabaseAdmin
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', authData.user.id)
    }

    // 프로필 정보 가져오기
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, name, is_admin')
      .eq('id', authData.user.id)
      .single()

    const response = NextResponse.json({
      user: {
        id: profile?.id || authData.user.id,
        email: profile?.email || email,
        name: profile?.name || name,
        is_admin: profile?.is_admin || isAdmin,
      },
    })

    // 세션이 있으면 쿠키 설정
    if (authData.session) {
      response.cookies.set('sb-access-token', authData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      response.cookies.set('sb-refresh-token', authData.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    return response
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: '회원가입에 실패했습니다.' },
      { status: 500 }
    )
  }
}
