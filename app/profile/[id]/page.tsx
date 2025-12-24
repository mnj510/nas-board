import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import UserProfile from '@/components/UserProfile'

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <UserProfile userId={params.id} />
}
