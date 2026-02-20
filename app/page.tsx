'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push('/home')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-foreground">Redirection...</p>
    </div>
  )
}
