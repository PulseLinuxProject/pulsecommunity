'use client'

import React from 'react'
import Image from 'next/image'
import { useMemo } from 'react'

interface AvatarProps {
  name: string | null
  image: string | null
  size?: number
}

const COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
]

export function Avatar({ name, image, size = 40 }: AvatarProps) {
  const initials = useMemo(() => {
    if (!name) return '?'
    return name.charAt(0).toUpperCase()
  }, [name])

  const backgroundColor = useMemo(() => {
    if (!name) return COLORS[0]
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
    return COLORS[Math.abs(hash) % COLORS.length]
  }, [name])

  if (image) {
    return (
      <div 
        className="relative rounded-full overflow-hidden"
        style={{ width: size, height: size }}
      >
        <div className={`absolute inset-0 ${backgroundColor}`} />
        <Image
          src={image}
          alt={name || 'User avatar'}
          fill
          className="object-cover"
          onError={(e) => {
            // Hide the image on error and show the fallback
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-full text-white font-medium ${backgroundColor}`}
      style={{ 
        width: size, 
        height: size,
        fontSize: size * 0.4
      }}
    >
      {initials}
    </div>
  )
} 