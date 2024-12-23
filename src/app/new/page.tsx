import { ThreadForm } from '@/components/ThreadForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function NewThreadPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Start a Discussion</h1>
          <p className="text-gray-400">Share your thoughts with the community</p>
        </div>
        <ThreadForm />
      </div>
    </main>
  )
} 