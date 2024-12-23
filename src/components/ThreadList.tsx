import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { ThreadItem } from './ThreadItem'

const getThreads = unstable_cache(
  async () => {
    return prisma.thread.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })
  },
  ['recent-threads'],
  {
    revalidate: 30,
    tags: ['threads']
  }
)

export async function ThreadList() {
  const threads = await getThreads()

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} />
      ))}
    </div>
  )
} 