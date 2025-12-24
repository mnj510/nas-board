import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import SearchResults from '@/components/SearchResults'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  const q = searchParams.q ?? ''

  return <SearchResults query={q} />
}


