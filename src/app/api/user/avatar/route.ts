import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { image } = await req.json()

    if (!image) {
      return NextResponse.json(
        { message: 'No image provided' },
        { status: 400 }
      )
    }

    // Update user's image in the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image }
    })

    return NextResponse.json(
      { message: 'Avatar updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Avatar update error:', error)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
} 