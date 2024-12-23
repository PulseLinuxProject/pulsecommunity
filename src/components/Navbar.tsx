'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Avatar } from './Avatar'
import { userBadges } from '@/config/badges'

export function Navbar() {
  const { data: session, update: updateSession } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [timestamp, setTimestamp] = useState(Date.now())

  // Force refresh of Avatar when session changes
  useEffect(() => {
    setTimestamp(Date.now())
    updateSession() // Force session update to get latest image
  }, [session?.user?.image])

  // Add timestamp to image URL to prevent caching
  const getImageUrl = (url: string | null) => {
    if (!url) return null
    return `${url}?t=${timestamp}`
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D11]/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              PulseCommunity
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/new"
                  className="nav-button bg-cyan-500 hover:bg-cyan-600"
                >
                  Create Discussion
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 nav-button"
                  >
                    <Avatar
                      name={session.user?.name ?? null}
                      image={getImageUrl(session.user?.image)}
                      size={32}
                    />
                    <span>{session.user?.name}</span>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-card divide-y divide-white/10">
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 hover:bg-white/10"
                        >
                          Dashboard
                        </Link>
                        {session.user?.name && userBadges[session.user.name]?.includes('owner') && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 hover:bg-white/10 text-cyan-400"
                          >
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="block w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-600"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-button">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="nav-button bg-cyan-500 hover:bg-cyan-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="nav-button"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden glass-card mt-2 p-4">
            {session ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={session.user?.name ?? null}
                    image={getImageUrl(session.user?.image)}
                    size={40}
                  />
                  <span className="font-medium">{session.user?.name}</span>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/new"
                    className="block nav-button bg-cyan-500 hover:bg-cyan-600 text-center"
                  >
                    Create Discussion
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block nav-button text-center"
                  >
                    Dashboard
                  </Link>
                  {session.user?.name && userBadges[session.user.name]?.includes('owner') && (
                    <Link
                      href="/admin"
                      className="block nav-button text-center text-cyan-400"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full nav-button text-white bg-red-500 hover:bg-red-600"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block nav-button text-center"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="block nav-button bg-cyan-500 hover:bg-cyan-600 text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
} 