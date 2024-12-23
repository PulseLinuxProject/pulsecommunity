'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { hash } from 'bcryptjs'

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters long',
    test: (password) => password.length >= 8,
  },
  {
    label: 'Contains at least one uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: 'Contains at least one number',
    test: (password) => /\d/.test(password),
  },
]

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [requirements, setRequirements] = useState<{ [key: string]: boolean }>({})
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    // Check password requirements
    const newRequirements = passwordRequirements.reduce((acc, req) => ({
      ...acc,
      [req.label]: req.test(password)
    }), {})
    setRequirements(newRequirements)

    // Calculate password strength (0-100)
    const metRequirements = Object.values(newRequirements).filter(Boolean).length
    setPasswordStrength((metRequirements / passwordRequirements.length) * 100)
  }, [password])

  const getStrengthColor = () => {
    if (passwordStrength >= 100) return 'bg-green-500'
    if (passwordStrength >= 66) return 'bg-yellow-500'
    if (passwordStrength >= 33) return 'bg-orange-500'
    return 'bg-red-500'
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name || !password) {
      setError('Username and password are required')
      return
    }

    if (passwordStrength < 100) {
      setError('Please meet all password requirements')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: email || null,
          password: await hash(password, 12),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      router.push('/login?registered=true')
    } catch (error) {
      console.error('Registration error:', error)
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            required
          />
          {password && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  Password strength: {
                    passwordStrength === 0 ? 'Very weak' :
                    passwordStrength <= 33 ? 'Weak' :
                    passwordStrength <= 66 ? 'Medium' :
                    passwordStrength < 100 ? 'Strong' :
                    'Very strong'
                  }
                </div>
              </div>
              <ul className="space-y-1 text-sm">
                {passwordRequirements.map((req) => (
                  <li
                    key={req.label}
                    className={`flex items-center gap-2 ${
                      requirements[req.label] ? 'text-green-400' : 'text-gray-400'
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 ${
                        requirements[req.label] ? 'text-green-400' : 'text-gray-500'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {requirements[req.label] ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      )}
                    </svg>
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          <p className="text-sm text-gray-400 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
} 