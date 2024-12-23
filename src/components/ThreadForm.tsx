'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { TagInput } from './TagInput'

export function ThreadForm() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session?.user) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          tags,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create thread')
      }

      const data = await response.json()

      // Revalidate the homepage
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: '/'
        })
      })

      router.push(`/thread/${data.id}`)
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to create thread')
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
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Tags
        </label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Discussion'}
      </button>
    </form>
  )
} 