import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getTags() {
  return prisma.tag.findMany({
    include: {
      _count: {
        select: {
          threads: true
        }
      }
    },
    orderBy: {
      threads: {
        _count: 'desc'
      }
    },
    take: 5
  })
}

export async function Sidebar() {
  const tags = await getTags()

  return (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">PulseOS</h2>
        <div className="space-y-2">
          <Link
            href="https://pulseos.spitkov.hu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Visit PulseOS</span>
          </Link>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Popular Tags</h2>
        <div className="space-y-2">
          {tags.map(tag => (
            <Link
              key={tag.id}
              href={`/tag/${tag.name}`}
              className="flex items-center justify-between text-gray-300 hover:text-white transition-colors"
            >
              <span>#{tag.name}</span>
              <span className="text-gray-400 text-sm">{tag._count.threads}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 