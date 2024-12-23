import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 text-center">
          <h1 className="text-6xl font-bold mb-4 text-cyan-500">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
} 