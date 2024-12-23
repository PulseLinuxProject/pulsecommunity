import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ThreadList } from '@/components/ThreadList'
import { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: {
    name: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decodedTagName = decodeURIComponent(params.name)
  
  const tag = await prisma.tag.findFirst({
    where: { 
      name: decodedTagName
    }
  })

  if (!tag) {
    return {
      title: 'Tag not found',
      description: 'The requested tag could not be found.'
    }
  }

  return {
    title: `#${tag.name} - PulseCommunity`,
    description: `Discussions tagged with #${tag.name} - Coming Soon`,
    openGraph: {
      title: `#${tag.name} - PulseCommunity`,
      description: `Discussions tagged with #${tag.name} - Coming Soon`,
      url: `https://pulsecommunity.spitkov.hu/tag/${tag.name}`,
    },
  }
}

export default async function TagPage({ params }: Props) {
  const decodedTagName = decodeURIComponent(params.name)
  
  const tag = await prisma.tag.findFirst({
    where: { 
      name: decodedTagName
    }
  })

  if (!tag) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="glass-card p-8">
        <h1 className="text-3xl font-bold mb-4">#{tag.name}</h1>
        <p className="text-gray-400 text-lg mb-8">
          Tag filtering is coming soon! 🚀
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
} 