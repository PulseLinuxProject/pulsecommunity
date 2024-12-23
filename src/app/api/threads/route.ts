import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DOMPurify from 'isomorphic-dompurify'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to create a discussion' },
        { status: 401 }
      )
    }

    const { title, content, tags, images } = await req.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Create thread with sanitized content
    const thread = await prisma.thread.create({
      data: {
        title,
        content: DOMPurify.sanitize(content),
        authorId: session.user.id,
        images: {
          create: images?.map((url: string) => ({ url })) || []
        },
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        }
      },
      include: {
        author: true,
        tags: true,
        images: true
      }
    })

    return NextResponse.json(thread)
  } catch (error) {
    console.error('Thread creation error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 