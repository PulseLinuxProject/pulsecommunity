import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/Navbar'
import { AuthProvider } from '@/components/AuthProvider'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PulseCommunity',
  description: 'Community forum for PulseOS',
  metadataBase: new URL('https://pulsecommunity.spitkov.hu'),
  openGraph: {
    title: 'PulseCommunity',
    description: 'Community forum for PulseOS',
    url: 'https://pulsecommunity.spitkov.hu',
    siteName: 'PulseCommunity',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PulseCommunity',
    description: 'Community forum for PulseOS',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
} 