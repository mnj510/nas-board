import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AdminPanel from '@/components/AdminPanel'

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  if (!user.is_admin) {
    redirect('/')
  }

  return <AdminPanel />
}
