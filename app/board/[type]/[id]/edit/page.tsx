import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import EditPost from '@/components/EditPost'

export default async function EditPostPage({
  params,
}: {
  params: { type: string; id: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  // 권한 확인: 게시물 작성자 또는 관리자만 수정 가능
  const { data: post, error } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', params.id)
    .single()

  if (error || !post) {
    redirect(`/board/${params.type}`)
  }

  const canEdit = user.is_admin || user.id === post.author_id

  if (!canEdit) {
    redirect(`/board/${params.type}/${params.id}`)
  }

  return <EditPost postId={params.id} boardType={params.type} />
}
