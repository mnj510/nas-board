import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { is_admin } = await request.json()

    const { data: updatedUser, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_admin })
      .eq('id', params.id)
      .select('id, email, name, is_admin, created_at')
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
    console.error('Update admin status error:', error)
    return NextResponse.json(
      { error: '관리자 상태 변경에 실패했습니다.' },
      { status: 500 }
    )
  }
}
