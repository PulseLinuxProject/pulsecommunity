import React from 'react'
import { badges } from '@/config/badges'

interface BadgeProps {
  type: keyof typeof badges
}

export function Badge({ type }: BadgeProps) {
  const badge = badges[type]
  
  return (
    <span className={`
      inline-flex items-center justify-center px-2 py-0.5 rounded-full text-sm
      ${badge.color} bg-opacity-90 backdrop-blur-sm
      ${badge.textColor || 'text-white'}
      font-medium shadow-sm
    `}>
      {badge.label}
    </span>
  )
} 