import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import pool from '@/lib/db'
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

  // 권한 확인
  const result = await pool.query(
    'SELECT author_id FROM posts WHERE id = $1',
    [params.id]
  )

  if (result.rows.length === 0) {
    redirect(`/board/${params.type}`)
  }

  const post = result.rows[0]
  const canEdit = user.is_admin || user.id === post.author_id

  if (!canEdit) {
    redirect(`/board/${params.type}/${params.id}`)
  }

  return <EditPost postId={params.id} boardType={params.type} />
}
