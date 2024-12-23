'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminActionsProps {
  userId: string
  isBanned?: boolean
}

export function AdminActions({ userId, isBanned }: AdminActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tempPassword, setTempPassword] = useState<string | null>(null)

  async function handleAction(action: 'ban' | 'unban' | 'resetPassword' | 'delete') {
    if (!confirm('Are you sure you want to perform this action?')) return
    
    setLoading(true)
    try {
      if (action === 'delete') {
        await fetch('/api/admin/user', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })
      } else {
        const response = await fetch('/api/admin/user', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, action })
        })

        if (action === 'resetPassword') {
          const data = await response.json()
          setTempPassword(data.tempPassword)
        }
      }
      
      router.refresh()
    } catch (error) {
      console.error('Admin action error:', error)
      alert('Failed to perform action')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button 
        className="px-3 py-1 text-sm rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors disabled:opacity-50"
        onClick={() => handleAction(isBanned ? 'unban' : 'ban')}
        disabled={loading}
      >
        {isBanned ? 'Unban' : 'Ban'}
      </button>
      <button 
        className="px-3 py-1 text-sm rounded-md bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
        onClick={() => handleAction('resetPassword')}
        disabled={loading}
      >
        Reset Password
      </button>
      <button 
        className="px-3 py-1 text-sm rounded-md bg-red-800/20 text-red-400 hover:bg-red-800/30 transition-colors disabled:opacity-50"
        onClick={() => handleAction('delete')}
        disabled={loading}
      >
        Delete Account
      </button>

      {tempPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Temporary Password</h3>
            <p className="mb-4">
              New temporary password: <code className="bg-white/10 px-2 py-1 rounded">{tempPassword}</code>
            </p>
            <button
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-md hover:bg-cyan-500/30 transition-colors"
              onClick={() => setTempPassword(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 