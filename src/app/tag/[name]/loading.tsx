export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse mb-2" />
        <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
      </div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-white/5 rounded-full animate-pulse" />
              <div>
                <div className="h-6 w-32 bg-white/5 rounded-lg animate-pulse mb-2" />
                <div className="h-4 w-24 bg-white/5 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="h-8 w-3/4 bg-white/5 rounded-lg animate-pulse mb-4" />
            <div className="h-24 bg-white/5 rounded-lg animate-pulse mb-4" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
              <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 