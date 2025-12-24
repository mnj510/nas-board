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

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: '서버 설정 오류(Supabase Admin 미설정)' },
        { status: 500 }
      )
    }

    // 1) Admin API로 직접 유저 생성 (이메일 인증/발송 없이)
    const { data: createdUser, error: adminError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // 이메일을 바로 인증된 상태로 처리
        user_metadata: {
          name,
        },
      })

    if (adminError || !createdUser?.user) {
      return NextResponse.json(
        { error: adminError?.message || '회원가입에 실패했습니다.' },
        { status: 400 }
      )
    }

    const user = createdUser.user

    // 2) 관리자 계정이면 profiles 테이블의 is_admin 업데이트
    const isAdmin = email === ADMIN_EMAIL

    if (isAdmin) {
      await supabaseAdmin
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', user.id)
    }

    // 3) 프로필 정보 가져오기
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, name, is_admin')
      .eq('id', user.id)
      .single()

    // 이 API는 회원가입만 처리하고, 로그인은 따로 /auth/login 에서 진행
    return NextResponse.json({
      user: {
        id: profile?.id || user.id,
        email: profile?.email || email,
        name: profile?.name || name,
        is_admin: profile?.is_admin || isAdmin,
      },
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: '회원가입에 실패했습니다.' },
      { status: 500 }
    )
  }
}
