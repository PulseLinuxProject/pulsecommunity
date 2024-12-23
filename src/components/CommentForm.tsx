'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface CommentFormProps {
  threadId: string
  parentId?: string
  onSubmit?: () => void
}

export function CommentForm({ threadId, parentId, onSubmit }: CommentFormProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session?.user) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          parentId,
          content,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to post comment')
      }

      setContent('')
      router.refresh()
      onSubmit?.()
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to post comment')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What are your thoughts?"
        rows={3}
        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        required
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  )
} 