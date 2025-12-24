import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

// 유료 회원 여부 설정/해제
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.is_admin) {
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

    const { is_paid } = await request.json()

    const { data: updatedUser, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_paid })
      .eq('id', params.id)
      .select('id, email, name, is_admin, is_paid, created_at')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '사용자를 찾을 수 없습니다.' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error: any) {
    console.error('Update paid status error:', error)
    return NextResponse.json(
      { error: '유료 회원 상태 변경에 실패했습니다.' },
      { status: 500 }
    )
  }
}


