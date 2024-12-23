import React from 'react'
import { userBadges } from '@/config/badges'
import { Badge } from './Badge'

interface UserBadgesProps {
  username: string
}

export function UserBadges({ username }: UserBadgesProps) {
  const badges = userBadges[username] || []
  
  if (badges.length === 0) return null
  
  return (
    <div className="inline-flex gap-1.5 items-center">
      {badges.map((badge) => (
        <Badge key={badge} type={badge} />
      ))}
    </div>
  )
} 