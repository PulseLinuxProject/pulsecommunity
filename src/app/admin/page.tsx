import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { userBadges } from '@/config/badges'
import { AdminActions } from '@/components/AdminActions'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.name || !userBadges[session.user.name]?.includes('owner')) {
    redirect('/')
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          threads: true,
          comments: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Posts</th>
                  <th className="text-left py-3 px-4">Comments</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{user.name}</span>
                        {user.banned && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-500">
                            Banned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.email || '-'}</td>
                    <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{user._count.threads}</td>
                    <td className="py-3 px-4">{user._count.comments}</td>
                    <td className="py-3 px-4">
                      <AdminActions userId={user.id} isBanned={user.banned} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
} 