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
  const session = await getServerSession(authOptions)
  if (!await canModerate(session)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Delete the comment and all its replies
  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { parentId: params.id } }),
    prisma.comment.delete({ where: { id: params.id } })
  ])

  return new NextResponse('Comment deleted')
} 