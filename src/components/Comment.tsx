'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Avatar } from './Avatar'
import { CommentForm } from './CommentForm'
import { UserBadges } from './UserBadges'
import { userBadges } from '@/config/badges'

interface CommentProps {
  comment: {
    id: string
    content: string
    createdAt: Date
    author: {
      id: string
      name: string | null
      image: string | null
    }
    votes: {
      value: number
      userId: string
    }[]
    replies?: CommentProps['comment'][]
    threadId: string
  }
  currentUserId?: string
  level?: number
}

export function Comment({ comment, currentUserId, level = 0 }: CommentProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)

  const totalVotes = comment.votes?.reduce((acc, vote) => acc + vote.value, 0) ?? 0
  const userVote = comment.votes?.find(vote => vote.userId === currentUserId)?.value || 0

  async function handleVote(value: number) {
    if (!currentUserId) {
      router.push('/login')
      return
    }

    if (loading) return
    setLoading(true)

    try {
      const response = await fetch('/api/comments/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: comment.id,
          value: userVote === value ? 0 : value,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to vote')
      }

      router.refresh()
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this comment?')) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete comment')
    } finally {
      setLoading(false)
    }
  }

  const canModerate = currentUserId && session?.user?.name && (
    userBadges[session.user.name]?.includes('owner') ||
    userBadges[session.user.name]?.includes('mod')
  )

  const CommentContent = () => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => handleVote(1)}
          disabled={loading}
          className={`p-1 rounded hover:bg-white/10 transition-colors ${
            userVote === 1 ? 'text-cyan-400' : 'text-gray-400'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <span className={`text-sm font-medium ${totalVotes > 0 ? 'text-cyan-400' : totalVotes < 0 ? 'text-red-400' : 'text-gray-400'}`}>
          {totalVotes}
        </span>
        <button
          onClick={() => handleVote(-1)}
          disabled={loading}
          className={`p-1 rounded hover:bg-white/10 transition-colors ${
            userVote === -1 ? 'text-red-400' : 'text-gray-400'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Link href={`/user/${comment.author.id}`} className="hover:opacity-80">
            <Avatar name={comment.author.name} image={comment.author.image} size={32} />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link 
                href={`/user/${comment.author.id}`}
                className="font-medium hover:text-cyan-400 transition-colors flex items-center"
              >
                {comment.author.name}
              </Link>
              {comment.author.name && <UserBadges username={comment.author.name} />}
            </div>
            <div className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </div>
          </div>
        </div>

        <div className="text-gray-300">{comment.content}</div>

        <div className="mt-2 flex items-center gap-4">
          {currentUserId && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Reply
            </button>
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

        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              threadId={comment.threadId}
              parentId={comment.id}
              onSubmit={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-4 border-l border-white/10">
            {comment.replies.map(reply => (
              <Comment
                key={reply.id}
                comment={{
                  ...reply,
                  threadId: comment.threadId
                }}
                currentUserId={currentUserId}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  // Only wrap top-level comments in a card
  if (level === 0) {
    return (
      <div className="glass-card p-6">
        <CommentContent />
      </div>
    )
  }

  return <CommentContent />
} 