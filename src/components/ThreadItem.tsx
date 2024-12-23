'use client'

import React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Avatar } from './Avatar'
import { ThreadContent } from './ThreadContent'
import { UserBadges } from './UserBadges'
import { userBadges } from '@/config/badges'

interface ThreadItemProps {
  thread: {
    id: string
    title: string
    content: string
    createdAt: Date
    images?: string[]
    author: {
      id: string
      name: string | null
      image: string | null
    }
    tags?: {
      id: string
      name: string
    }[]
    _count?: {
      comments: number
    }
  }
  showFull?: boolean
}

export function ThreadItem({ thread, showFull = false }: ThreadItemProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = React.useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this thread?')) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/threads/${thread.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete thread')
      }

      router.refresh()
      if (showFull) {
        router.push('/')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete thread')
    } finally {
      setLoading(false)
    }
  }

  const canModerate = session?.user?.name && (
    userBadges[session.user.name]?.includes('owner') ||
    userBadges[session.user.name]?.includes('mod')
  )

  return (
    <div className={`glass-card p-6 ${!showFull && 'hover:bg-white/5 transition-colors'}`}>
      <div className="flex items-center gap-4 mb-4">
        <Link href={`/user/${thread.author.id}`} className="hover:opacity-80">
          <Avatar
            name={thread.author.name}
            image={thread.author.image}
            size={48}
          />
        </Link>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link 
              href={`/user/${thread.author.id}`}
              className="text-lg font-medium hover:text-cyan-400 transition-colors flex items-center"
            >
              {thread.author.name}
            </Link>
            {thread.author.name && <UserBadges username={thread.author.name} />}
          </div>
          <p className="text-gray-400 text-sm">
            {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      {showFull ? (
        <>
          <h2 className="text-2xl font-bold mb-4">{thread.title}</h2>
          <ThreadContent thread={thread} showFull={true} />
        </>
      ) : (
        <Link href={`/thread/${thread.id}`} className="block group">
          <h2 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
            {thread.title}
          </h2>
        </Link>
      )}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          {thread.tags?.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.name}`}
              className="px-2 py-1 text-sm rounded-full bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400/30 transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {thread._count && (
            <div className="text-gray-400 text-sm flex items-center gap-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {thread._count.comments} {thread._count.comments === 1 ? 'comment' : 'comments'}
            </div>
          )}
          {canModerate && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 