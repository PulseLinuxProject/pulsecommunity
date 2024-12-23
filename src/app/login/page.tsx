import { LoginForm } from '@/components/LoginForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to PulseCommunity</p>
        </div>
        <LoginForm />
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
} 