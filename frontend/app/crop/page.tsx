"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import CropSelector from "@/components/crop-selector"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CropPage() {
  const router = useRouter()
  const [location, setLocation] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedLocation = localStorage.getItem("selectedLocation")
    if (!storedLocation) {
      router.push("/location")
      return
    }
    setLocation(storedLocation)
    setLoading(false)
  }, [router])

  const handleCropSelect = (crop: string) => {
    localStorage.setItem("selectedCrop", crop)
    router.push("/dashboard")
  }

  const handleBack = () => {
    router.push("/location")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-2">HarvestGuard</h1>
        <p className="text-center text-gray-600 mb-8">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-2">HarvestGuard</h1>
      <p className="text-center text-gray-600 mb-8">What are you growing?</p>

      <div className="mb-4 flex justify-between items-center">
        <Button variant="ghost" onClick={handleBack} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <p className="text-sm text-gray-500">
          Location: <span className="font-medium">{location}</span>
        </p>
      </div>

      <CropSelector onSelect={handleCropSelect} />
    </div>
  )
}

