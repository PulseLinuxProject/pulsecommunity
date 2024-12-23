import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ThreadItem } from '@/components/ThreadItem'
import { Comment } from '@/components/Comment'
import { CommentForm } from '@/components/CommentForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Metadata } from 'next'

interface Props {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = await Promise.resolve(params.id)
  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      author: true,
      tags: true,
      _count: {
        select: {
          comments: true
        }
      }
    }
  })

  if (!thread) {
    return {
      title: 'Discussion not found',
      description: 'The requested discussion could not be found.'
    }
  }

  const createdAt = new Date(thread.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return {
    title: thread.title,
    description: `${thread.content.slice(0, 200)}...`,
    openGraph: {
      title: thread.title,
      description: `${thread.content.slice(0, 200)}...`,
      url: `https://pulsecommunity.spitkov.hu/thread/${thread.id}`,
      siteName: 'PulseCommunity',
      locale: 'en_US',
      type: 'article',
      publishedTime: thread.createdAt.toISOString(),
      authors: [thread.author.name || ''],
      images: thread.images,
    },
    twitter: {
      card: 'summary_large_image',
      title: thread.title,
      description: `${thread.content.slice(0, 200)}...`,
      images: thread.images,
    },
  }
}

export default async function ThreadPage({ params }: Props) {
  const id = await Promise.resolve(params.id)
  const session = await getServerSession(authOptions)
  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      author: true,
      tags: true,
      comments: {
        where: {
          parentId: null // Only get top-level comments
        },
        include: {
          author: true,
          votes: true,
          replies: {
            include: {
              author: true,
              votes: true,
              replies: {
                include: {
                  author: true,
                  votes: true,
                  replies: {
                    include: {
                      author: true,
                      votes: true,
                      replies: {
                        include: {
                          author: true,
                          votes: true,
                          replies: {
                            include: {
                              author: true,
                              votes: true,
                              replies: {
                                include: {
                                  author: true,
                                  votes: true,
                                  replies: {
                                    include: {
                                      author: true,
                                      votes: true,
                                      replies: {
                                        include: {
                                          author: true,
                                          votes: true,
                                          replies: {
                                            include: {
                                              author: true,
                                              votes: true,
                                              replies: {
                                                include: {
                                                  author: true,
                                                  votes: true,
                                                  replies: {
                                                    include: {
                                                      author: true,
                                                      votes: true
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    }
  })

  if (!thread) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ThreadItem thread={thread} showFull />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {session ? (
          <div className="mb-8">
            <CommentForm threadId={thread.id} />
          </div>
        ) : (
          <p className="text-gray-400 mb-8">
            Please <a href="/login" className="text-cyan-500 hover:underline">sign in</a> to comment.
          </p>
        )}
        <div className="space-y-6">
          {thread.comments.map((comment) => (
            <Comment 
              key={comment.id} 
              comment={{
                ...comment,
                threadId: thread.id
              }}
              currentUserId={session?.user?.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 