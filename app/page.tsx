import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import BoardList from '@/components/BoardList'

export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <BoardList />
    </div>
  )
}
