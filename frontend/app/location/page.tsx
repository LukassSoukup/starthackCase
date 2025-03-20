"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LocationSelector from "@/components/location-selector"

export default function LocationPage() {
  const router = useRouter()
  const [checkingStorage, setCheckingStorage] = useState(true)

  // Check if location already exists in localStorage
  useEffect(() => {
    const storedLocation = localStorage.getItem("selectedLocation")
    const storedCrop = localStorage.getItem("selectedCrop")

    if (storedLocation && storedCrop) {
      router.push("/dashboard")
    } else if (storedLocation) {
      router.push("/crop")
    } else {
      setCheckingStorage(false)
    }
  }, [router])

  const handleLocationSelect = (location: string) => {
    router.push("/crop")
  }

  if (checkingStorage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-2">Nature-Powered Farming</h1>
        <p className="text-center text-gray-600 mb-8">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-2">Nature-Powered Farming</h1>
      <p className="text-center text-gray-600 mb-8">Where are you farming?</p>

      <div className="max-w-md mx-auto">
        <LocationSelector onSelect={handleLocationSelect} />
      </div>
    </div>
  )
}

