import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

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

    // 세션 쿠키 설정을 위한 응답 생성
    const response = NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        is_admin: profile.is_admin || false,
      },
    })

    // Supabase 세션 쿠키 설정
    if (data.session) {
      response.cookies.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      response.cookies.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '로그인에 실패했습니다.' },
      { status: 500 }
    )
  }
}
