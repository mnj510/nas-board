import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || !user.is_admin) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      )
    }

    // 새 스키마(is_paid)가 아직 적용되지 않았을 수 있으므로 두 번 시도
    let query: any = await supabaseAdmin
      .from('profiles')
      .select('id, email, name, is_admin, is_paid, created_at')
      .order('created_at', { ascending: false })

    if (query.error?.code === '42703') {
      // is_paid 컬럼이 없는 경우 기존 스키마로 재조회
      query = await supabaseAdmin
        .from('profiles')
        .select('id, email, name, is_admin, created_at')
        .order('created_at', { ascending: false })
    }

    const { data: users, error } = query

    if (error) {
      throw error
    }

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: '사용자 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
