import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Tag Not Found</h1>
      <p className="text-gray-400 mb-8">
        The tag you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="inline-block px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
} 