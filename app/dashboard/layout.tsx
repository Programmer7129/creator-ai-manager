'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { AgencyOnboarding } from '@/components/agency-onboarding'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hasAgency, setHasAgency] = useState<boolean | null>(null)
  const [checkingAgency, setCheckingAgency] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    const checkAgency = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await fetch('/api/agency')
          if (response.ok) {
            setHasAgency(true)
          } else if (response.status === 404) {
            setHasAgency(false)
          }
        } catch (error) {
          console.error('Error checking agency:', error)
          setHasAgency(false)
        } finally {
          setCheckingAgency(false)
        }
      }
    }

    checkAgency()
  }, [status, session])

  // Show loading state while checking authentication or agency
  if (status === 'loading' || checkingAgency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  // Show onboarding if no agency
  if (hasAgency === false) {
    return (
      <AgencyOnboarding 
        onComplete={() => {
          setHasAgency(true)
          window.location.reload() // Refresh to update session data
        }} 
      />
    )
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 