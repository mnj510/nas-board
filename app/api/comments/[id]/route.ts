import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { content } = await request.json()

    // supabaseAdmin을 사용하여 RLS 우회
    const client = supabaseAdmin || supabase

    // 권한 확인
    const { data: existingComment, error: fetchError } = await client
      .from('comments')
      .select('author_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingComment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (existingComment.author_id !== user.id && !user.is_admin) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      )
    }

    const { data: comment, error } = await client
      .from('comments')
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ comment })
  } catch (error: any) {
    console.error('Update comment error:', error)
    return NextResponse.json(
      { error: '댓글 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    // supabaseAdmin을 사용하여 RLS 우회
    const client = supabaseAdmin || supabase

    // 권한 확인
    const { data: existingComment, error: fetchError } = await client
      .from('comments')
      .select('author_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingComment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (existingComment.author_id !== user.id && !user.is_admin) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      )
    }

    // 대댓글도 함께 삭제
    const { error } = await client
      .from('comments')
      .delete()
      .or(`id.eq.${params.id},parent_id.eq.${params.id}`)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete comment error:', error)
    return NextResponse.json(
      { error: '댓글 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}
