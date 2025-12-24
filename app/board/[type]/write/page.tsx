import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { BOARD_TYPES, BOARD_NAMES } from '@/lib/utils'
import WritePost from '@/components/WritePost'

export default async function WritePage({
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

  // 관리자 권한 확인 또는 질문 게시판인지 확인
  const canWrite = user.is_admin || boardType === BOARD_TYPES.QUESTION

  if (!canWrite) {
    redirect(`/board/${boardType}`)
  }

  return <WritePost boardType={boardType} />
}
