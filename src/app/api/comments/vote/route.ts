import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { commentId, value } = await req.json()

    if (!commentId || ![1, -1, 0].includes(value)) {
      return NextResponse.json(
        { message: 'Invalid request' },
        { status: 400 }
      )
    }

    if (value === 0) {
      // Remove vote
      await prisma.vote.delete({
        where: {
          userId_commentId: {
            userId: session.user.id,
            commentId
          }
        }
      })
    } else {
      // Upsert vote
      await prisma.vote.upsert({
        where: {
          userId_commentId: {
            userId: session.user.id,
            commentId
          }
        },
        create: {
          value,
          userId: session.user.id,
          commentId
        },
        update: {
          value
        }
      })
    }

    return NextResponse.json(
      { message: 'Vote updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
} 