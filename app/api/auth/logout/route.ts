import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    await supabase.auth.signOut()

    const response = NextResponse.json({ success: true })
    
    // 쿠키 삭제
    response.cookies.delete('sb-access-token')
    response.cookies.delete('sb-refresh-token')

    return response
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: '로그아웃에 실패했습니다.' },
      { status: 500 }
    )
  }
}
