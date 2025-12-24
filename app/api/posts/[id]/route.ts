import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // supabaseAdmin을 사용하여 RLS 우회
    const client = supabaseAdmin || supabase

    const { data: post, error } = await client
      .from('posts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !post) {
      return NextResponse.json(
        { error: '게시물을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 프로필 정보 조회
    const { data: profile } = await client
      .from('profiles')
      .select('name')
      .eq('id', post.author_id)
      .single()

    // 조회수 증가
    await client.rpc('increment_view_count', { post_id: params.id })

    return NextResponse.json({
      post: {
        ...post,
        author_name: profile?.name || '알 수 없음',
        view_count: (post.view_count || 0) + 1,
      },
    })
  } catch (error: any) {
    console.error('Get post error:', error)
    return NextResponse.json(
      { error: '게시물을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { title, content, thumbnail_url } = await request.json()

    // supabaseAdmin을 사용하여 RLS 우회
    const client = supabaseAdmin || supabase

    // 권한 확인
    const { data: existingPost, error: fetchError } = await client
      .from('posts')
      .select('author_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { error: '게시물을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (existingPost.author_id !== user.id && !user.is_admin) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      )
    }

    const { data: post, error } = await client
      .from('posts')
      .update({
        title,
        content,
        thumbnail_url: thumbnail_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ post })
  } catch (error: any) {
    console.error('Update post error:', error)
    return NextResponse.json(
      { error: '게시물 수정에 실패했습니다.' },
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
    const { data: existingPost, error: fetchError } = await client
      .from('posts')
      .select('author_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { error: '게시물을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (existingPost.author_id !== user.id && !user.is_admin) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      )
    }

    const { error } = await client
      .from('posts')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { error: '게시물 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}
