import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Suspense } from 'react'
import { ThreadList } from '@/components/ThreadList'
import { Sidebar } from '@/components/Sidebar'
import { CommunityStats } from '@/components/CommunityStats'

function LoadingCard() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-8 w-48 bg-white/10 rounded mb-6" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-white/10 rounded" />
        ))}
      </div>
    </div>
  )
}

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-60">
            <div className="sticky top-20">
              <Suspense fallback={<LoadingCard />}>
                <CommunityStats />
              </Suspense>
            </div>
          </div>
          <div className="flex-1">
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Recent Discussions</h2>
              </div>
              <Suspense fallback={<LoadingCard />}>
                <ThreadList />
              </Suspense>
            </div>
          </div>
          <div className="lg:w-80">
            <div className="sticky top-20">
              <Suspense fallback={<LoadingCard />}>
                <Sidebar />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 