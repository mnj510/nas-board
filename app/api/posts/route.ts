import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const boardType = searchParams.get('board_type')

    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (boardType) {
      query = query.eq('board_type', boardType)
    }

    const { data: posts, error } = await query

    if (error) {
      throw error
    }

    // 댓글 수 계산
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const { count } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id)

        return {
          ...post,
          author_name: post.profiles?.name || '알 수 없음',
          comment_count: count || 0,
        }
      })
    )

    return NextResponse.json({ posts: postsWithComments })
  } catch (error: any) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { error: '게시물을 불러오는데 실패했습니다.' },
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

    const { title, content, board_type, thumbnail_url } = await request.json()

    if (!title || !content || !board_type) {
      return NextResponse.json(
        { error: '제목, 내용, 게시판을 입력해주세요.' },
        { status: 400 }
      )
    }

    // 권한 확인 (관리자만 작성 가능, 질문 게시판은 모두 가능)
    if (board_type !== 'question' && !user.is_admin) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      )
    }

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        board_type,
        author_id: user.id,
        thumbnail_url: thumbnail_url || null,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ post })
  } catch (error: any) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: '게시물 작성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
