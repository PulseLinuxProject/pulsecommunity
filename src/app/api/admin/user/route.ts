import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { userBadges } from '@/config/badges'

async function isAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user?.name && userBadges[session.user.name]?.includes('owner')
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { userId } = await request.json()

  // Delete all user's content and the user account
  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { authorId: userId } }),
    prisma.thread.deleteMany({ where: { authorId: userId } }),
    prisma.user.delete({ where: { id: userId } })
  ])

  return new NextResponse('User deleted')
}

export async function PUT(request: Request) {
  if (!await isAdmin()) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { userId, action } = await request.json()

  if (action === 'ban') {
    await prisma.user.update({
      where: { id: userId },
      data: { banned: true }
    })
    return new NextResponse('User banned')
  }

  if (action === 'unban') {
    await prisma.user.update({
      where: { id: userId },
      data: { banned: false }
    })
    return new NextResponse('User unbanned')
  }

  if (action === 'resetPassword') {
    // Generate a random temporary password
    const tempPassword = Math.random().toString(36).slice(-8)
    
    // Update user's password (you'll need to hash it properly)
    await prisma.user.update({
      where: { id: userId },
      data: { 
        // You'll need to implement proper password hashing here
        password: tempPassword 
      }
    })

    // In a real app, you'd want to email this to the user
    return NextResponse.json({ tempPassword })
  }

  return new NextResponse('Invalid action', { status: 400 })
} 