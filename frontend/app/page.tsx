"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingDashboard } from "@/components/loading-dashboard"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the location selection page
    router.push("/location")
  }, [router])

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-2">HarvestGuard</h1>
        <p className="text-center text-gray-600 mb-8">Sustainable farming solutions powered by AI</p>

        <LoadingDashboard />
      </div>
    </main>
  )
}

