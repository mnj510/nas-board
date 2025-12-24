import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import PostDetail from '@/components/PostDetail'

export default async function PostDetailPage({
  params,
}: {
  params: { type: string; id: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <PostDetail postId={params.id} boardType={params.type} />
}
