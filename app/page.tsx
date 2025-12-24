import BoardList from '@/components/BoardList'

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <BoardList />
    </div>
  )
}
