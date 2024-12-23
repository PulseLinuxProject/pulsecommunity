import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { userBadges } from '@/config/badges'

async function canModerate(session: Awaited<ReturnType<typeof getServerSession>>) {
  return session?.user?.name && (
    userBadges[session.user.name]?.includes('owner') ||
    userBadges[session.user.name]?.includes('mod')
  )
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!await canModerate(session)) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this thread' },
        { status: 401 }
      )
    }

    // Check if thread exists
    const thread = await prisma.thread.findUnique({
      where: { id: params.id }
    })

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      )
    }

    // Delete all related data in a transaction
    await prisma.$transaction([
      // Delete all comments
      prisma.comment.deleteMany({
        where: { threadId: params.id }
      }),

      // Delete thread's images
      prisma.image.deleteMany({
        where: { threadId: params.id }
      }),

      // Delete thread's tag connections and the thread itself
      prisma.thread.delete({
        where: { id: params.id }
      })
    ])

    return NextResponse.json({ message: 'Thread deleted successfully' })
  } catch (error) {
    console.error('Error deleting thread:', error)
    return NextResponse.json(
      { error: 'Failed to delete thread. Please try again.' },
      { status: 500 }
    )
  }
} 