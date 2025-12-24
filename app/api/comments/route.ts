import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('post_id')

    if (!postId) {
      return NextResponse.json(
        { error: 'post_id가 필요합니다.' },
        { status: 400 }
      )
    }

    // supabaseAdmin을 사용하여 RLS 우회
    const client = supabaseAdmin || supabase

    const { data: comments, error } = await client
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    if (!comments || comments.length === 0) {
      return NextResponse.json({ comments: [] })
    }

    // 작성자 ID 목록 수집
    const authorIds = Array.from(new Set(comments.map((c) => c.author_id)))

    // 프로필 정보 일괄 조회
    const { data: profiles } = await client
      .from('profiles')
      .select('id, name')
      .in('id', authorIds)

    // 프로필 맵 생성
    const profileMap = new Map(
      (profiles || []).map((profile) => [profile.id, profile.name])
    )

    // 댓글과 대댓글 분리
    const topLevelComments = comments.filter((c) => !c.parent_id)
    const replies = comments.filter((c) => c.parent_id)

    const commentsWithReplies = topLevelComments.map((comment) => ({
      ...comment,
      author_name: profileMap.get(comment.author_id) || '알 수 없음',
      replies: replies
        .filter((r) => r.parent_id === comment.id)
        .map((r) => ({
          ...r,
          author_name: profileMap.get(r.author_id) || '알 수 없음',
        })),
    }))

    return NextResponse.json({ comments: commentsWithReplies })
  } catch (error: any) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: '댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { content, post_id, parent_id } = await request.json()

    if (!content || !post_id) {
      return NextResponse.json(
        { error: '내용과 게시물 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // supabaseAdmin을 사용하여 RLS 우회
    const client = supabaseAdmin || supabase

    const { data: comment, error } = await client
      .from('comments')
      .insert({
        content,
        post_id,
        author_id: user.id,
        parent_id: parent_id || null,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      comment: {
        ...comment,
        author_name: user.name,
      },
    })
  } catch (error: any) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: '댓글 작성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
