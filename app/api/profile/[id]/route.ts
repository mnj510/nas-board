import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 프로필 정보
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, name, is_admin, created_at')
      .eq('id', params.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 작성한 게시물
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('author_id', params.id)
      .order('created_at', { ascending: false })

    if (postsError) {
      throw postsError
    }

    // 작성한 댓글
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select(`
        *,
        posts:post_id (
          title,
          board_type
        )
      `)
      .eq('author_id', params.id)
      .order('created_at', { ascending: false })

    if (commentsError) {
      throw commentsError
    }

    const commentsWithPostInfo = comments.map((comment) => ({
      ...comment,
      post_title: comment.posts?.title || '',
      board_type: comment.posts?.board_type || '',
    }))

    return NextResponse.json({
      profile,
      posts: posts || [],
      comments: commentsWithPostInfo,
    })
  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: '프로필을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
