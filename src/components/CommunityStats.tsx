import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

const getStats = unstable_cache(
  async () => {
    const [userCount, threadCount, commentCount] = await Promise.all([
      prisma.user.count(),
      prisma.thread.count(),
      prisma.comment.count(),
    ])

    return {
      users: userCount,
      threads: threadCount,
      comments: commentCount,
    }
  },
  ['community-stats'],
  {
    revalidate: 60, 
    tags: ['stats']
  }
)

export async function CommunityStats() {
  const stats = await getStats()

  return (
    <div className="glass-card p-4">
      <h2 className="text-lg font-bold mb-3">Community Stats</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-gray-400 text-sm">Members</div>
          <div className="text-lg font-bold text-cyan-400">{stats.users}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-gray-400 text-sm">Discussions</div>
          <div className="text-lg font-bold text-cyan-400">{stats.threads}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-gray-400 text-sm">Comments</div>
          <div className="text-lg font-bold text-cyan-400">{stats.comments}</div>
        </div>
      </div>
    </div>
  )
} 