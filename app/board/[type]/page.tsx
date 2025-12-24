import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { BOARD_NAMES } from '@/lib/utils'
import BoardPosts from '@/components/BoardPosts'

export default async function BoardPage({
  params,
}: {
  params: { type: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  const boardType = params.type as keyof typeof BOARD_NAMES
  if (!BOARD_NAMES[boardType]) {
    redirect('/')
  }

  return <BoardPosts boardType={boardType} />
}
