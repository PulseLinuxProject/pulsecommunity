import React from 'react'
import { Sidebar } from '@/components/Sidebar'

interface PageLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export function PageLayout({ children, showSidebar = true }: PageLayoutProps) {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {children}
          </div>
          {showSidebar && (
            <div className="lg:w-80">
              <div className="sticky top-20">
                <Sidebar />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 