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

    const { threadId, parentId, content } = await req.json()

    if (!threadId || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { threadId: true }
      })

      if (!parentComment) {
        return NextResponse.json(
          { message: 'Parent comment not found' },
          { status: 404 }
        )
      }

      if (parentComment.threadId !== threadId) {
        return NextResponse.json(
          { message: 'Parent comment does not belong to this thread' },
          { status: 400 }
        )
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: session.user.id,
        threadId,
        parentId
      }
    })

    return NextResponse.json(
      { message: 'Comment created successfully', commentId: comment.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
} 