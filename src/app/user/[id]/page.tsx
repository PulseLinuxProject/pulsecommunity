import { prisma } from '@/lib/prisma'
import { formatDistanceToNow } from 'date-fns'
import { Avatar } from '@/components/Avatar'
import { ThreadItem } from '@/components/ThreadItem'
import { UserBadges } from '@/components/UserBadges'
import { notFound } from 'next/navigation'

interface UserProfilePageProps {
  params: { id: string }
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      threads: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          tags: true,
          _count: {
            select: { comments: true }
          }
        }
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          thread: {
            select: {
              id: true,
              title: true
            }
          }
        },
        take: 5
      },
      _count: {
        select: {
          threads: true,
          comments: true
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="glass-card p-8 mb-8">
          <div className="flex items-start gap-6">
            <Avatar name={user.name} image={user.image} size={96} />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold flex items-center">{user.name}</h1>
                {user.name && <UserBadges username={user.name} />}
              </div>
              {user.bio && (
                <p className="text-gray-400 mb-4 whitespace-pre-wrap">{user.bio}</p>
              )}
              <div className="flex gap-6 text-sm text-gray-400">
                <div>
                  <span className="text-white font-medium">{user._count.threads}</span> discussions
                </div>
                <div>
                  <span className="text-white font-medium">{user._count.comments}</span> comments
                </div>
                <div>
                  Joined {formatDistanceToNow(user.createdAt)} ago
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Discussions</h2>
            <div className="space-y-4">
              {user.threads.map((thread) => (
                <ThreadItem key={thread.id} thread={thread} />
              ))}
              {user.threads.length === 0 && (
                <p className="text-gray-400">No discussions yet</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Comments</h2>
            <div className="space-y-4">
              {user.comments.map((comment) => (
                <div key={comment.id} className="glass-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar name={comment.author.name} image={comment.author.image} size={32} />
                    <div>
                      <div className="text-sm text-gray-400">
                        Commented on <a href={`/thread/${comment.thread.id}`} className="text-cyan-400 hover:underline">{comment.thread.title}</a>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(comment.createdAt)} ago
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">
                    {comment.content}
                  </div>
                </div>
              ))}
              {user.comments.length === 0 && (
                <p className="text-gray-400">No comments yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 