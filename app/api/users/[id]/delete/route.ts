import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

// 계정 완전 삭제 (다시 로그인 불가)
export async function DELETE(
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

    // Supabase Auth 사용자 삭제
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      params.id
    )

    if (authError) {
      throw authError
    }

    // 프로필은 auth.users 외래키로 자동 삭제되거나, 남아있을 수 있음. 안전하게 한 번 더 정리.
    await supabaseAdmin.from('profiles').delete().eq('id', params.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: '사용자 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}


