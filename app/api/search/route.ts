import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()

    if (!q) {
      return NextResponse.json({ posts: [] })
    }

    const client = supabaseAdmin || supabase
    const currentUser = await getCurrentUser()

    const { data: posts, error } = await client
      .from('posts')
      .select('*')
      .or(
        `title.ilike.%${q.replace(/%/g, '').replace(/_/g, '')}%,content.ilike.%${q
          .replace(/%/g, '')
          .replace(/_/g, '')}%`
      )
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({ posts: [] })
    }

    // 작성자 정보
    const authorIds = Array.from(new Set(posts.map((post) => post.author_id)))
    const { data: profiles } = await client
      .from('profiles')
      .select('id, name')
      .in('id', authorIds)

    const profileMap = new Map(
      (profiles || []).map((profile) => [profile.id, profile.name])
    )

    const postsWithAuthor = posts.map((post) => ({
      ...post,
      author_name: profileMap.get(post.author_id) || '알 수 없음',
    }))

    // 유료글 필터링
    const filtered = postsWithAuthor.filter((post) => {
      if (!post.is_premium) return true
      if (!currentUser) return false
      if (currentUser.is_admin) return true
      return currentUser.is_paid === true
    })

    return NextResponse.json({ posts: filtered })
  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: '검색에 실패했습니다.' },
      { status: 500 }
    )
  }
}


