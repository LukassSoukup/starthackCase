"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RiskAssessment from "@/components/risk-assessment"
import ProductRecommendations from "@/components/product-recommendations"
import SeasonalTracker from "@/components/seasonal-tracker"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { LoadingDashboard } from "@/components/loading-dashboard"

export default function DashboardPage() {
  const router = useRouter()
  const [location, setLocation] = useState<string>("")
  const [crop, setCrop] = useState<string>("")
  const [activeTab, setActiveTab] = useState("risks")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the selected location and crop from localStorage
    const storedLocation = localStorage.getItem("selectedLocation")
    const storedCrop = localStorage.getItem("selectedCrop")

    if (!storedLocation || !storedCrop) {
      // If either is missing, redirect to the appropriate page
      if (!storedLocation) {
        router.push("/location")
      } else {
        router.push("/crop")
      }
      return
    }

    setLocation(storedLocation)
    setCrop(storedCrop)
    setLoading(false)
  }, [router])

  const handleChangeSelection = () => {
    router.push("/location")
  }

  const handleBack = () => {
    router.push("/crop")
  }

  const handleResetAll = () => {
    // Clear all selections from localStorage
    localStorage.removeItem("selectedLocation")
    localStorage.removeItem("selectedCrop")
    // Redirect to location page
    router.push("/location")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-green-700 mb-2">
          Nature-Powered Farming
        </h1>
        <p className="text-center text-gray-600 mb-6 sm:mb-8">Loading your dashboard...</p>
        <LoadingDashboard />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-green-700 mb-2">
        Nature-Powered Farming
      </h1>
      <p className="text-center text-gray-600 mb-6 sm:mb-8">Sustainable farming solutions powered by AI</p>

      <Card className="w-full">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleBack} className="mr-2 h-9 px-2 sm:h-10 sm:px-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="sm:inline">Back</span>
              </Button>
              <h2 className="text-xl sm:text-2xl font-semibold">Your Farming Dashboard</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetAll}
              className="flex items-center text-gray-500 self-end sm:self-auto"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset All
            </Button>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="risks" className="py-2 text-xs sm:text-sm">
                Risks
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="py-2 text-xs sm:text-sm">
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="tracker" className="py-2 text-xs sm:text-sm">
                Seasonal Tracker
              </TabsTrigger>
            </TabsList>
            <TabsContent value="risks">
              <RiskAssessment location={location} crop={crop} />
            </TabsContent>
            <TabsContent value="recommendations">
              <ProductRecommendations location={location} crop={crop} />
            </TabsContent>
            <TabsContent value="tracker">
              <SeasonalTracker location={location} crop={crop} />
            </TabsContent>
          </Tabs>

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <p className="text-sm text-gray-500">
                Location: <span className="font-medium">{location}</span>
              </p>
              <p className="text-sm text-gray-500">
                Crop: <span className="font-medium">{crop}</span>
              </p>
            </div>
            <Button variant="outline" onClick={handleChangeSelection} className="w-full sm:w-auto">
              Change Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

