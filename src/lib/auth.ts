import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Please provide process.env.NEXTAUTH_SECRET')
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.emailOrUsername || !credentials?.password) {
            console.error('Missing credentials')
            throw new Error('Please provide both username/email and password')
          }

          // Try to find user by username or email
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { name: credentials.emailOrUsername },
                { email: credentials.emailOrUsername }
              ]
            }
          })

          if (!user || !user.password) {
            console.error('User not found:', credentials.emailOrUsername)
            throw new Error('Invalid username/email or password')
          }

          const isValid = await compare(credentials.password, user.password)

          if (!isValid) {
            console.error('Invalid password for user:', credentials.emailOrUsername)
            throw new Error('Invalid username/email or password')
          }

          console.log('User logged in successfully:', user.name)

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string | null
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development'
} 