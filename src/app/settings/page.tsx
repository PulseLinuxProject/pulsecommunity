import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Avatar } from '@/components/Avatar'
import { ImageUpload } from '@/components/ImageUpload'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account settings</p>
        </div>

        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Profile</h2>
          <div className="flex items-center gap-6">
            <Avatar
              name={session.user.name || null}
              image={session.user.image || null}
              size={96}
            />
            <div>
              <ImageUpload
                onImageCropped={async (image) => {
                  await fetch('/api/user/avatar', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image }),
                  })
                }}
                aspectRatio={1}
                cropShape="round"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 