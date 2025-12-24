import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

// 계정 정지 / 해제
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

    const { days } = await request.json()

    let banned_until = null
    let is_banned = false

    // days 가 숫자면 해당 일수만큼 정지, null/0 이면 정지 해제
    if (typeof days === 'number' && days > 0) {
      const now = new Date()
      const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
      banned_until = until.toISOString()
      is_banned = true
    }

    const { data: updatedUser, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_banned, banned_until })
      .eq('id', params.id)
      .select('id, email, name, is_admin, is_banned, banned_until, created_at')
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
    console.error('Update ban status error:', error)
    return NextResponse.json(
      { error: '정지 상태 변경에 실패했습니다.' },
      { status: 500 }
    )
  }
}


