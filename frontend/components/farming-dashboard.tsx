"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LocationSelector from "@/components/location-selector"
import CropSelector from "@/components/crop-selector"
import RiskAssessment from "@/components/risk-assessment"
import ProductRecommendations from "@/components/product-recommendations"
import SeasonalTracker from "@/components/seasonal-tracker"
import { ArrowRight } from "lucide-react"

export default function FarmingDashboard() {
  const [location, setLocation] = useState("")
  const [crop, setCrop] = useState("")
  const [step, setStep] = useState(1)
  const [activeTab, setActiveTab] = useState("risks")
  console.log("activeTab", activeTab);

  // Update the handleLocationSelect function to handle both automatic and manual locations
  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation)
    // If we have a location, automatically move to the crop selection step
    setStep(2)
  }

  const handleCropSelect = (selectedCrop: string) => {
    setCrop(selectedCrop)
    setStep(3)
  }
  const handleSerisouRiskFactor = (factor: any) => {
    if (factor.level > 70) {
      setActiveTab("recommendations");
    }
  }
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <LocationSelector onSelect={handleLocationSelect} />
      case 2:
        return <CropSelector onSelect={handleCropSelect} />
      case 3:
        return (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="risks">Risks</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="tracker">Seasonal Tracker</TabsTrigger>
            </TabsList>
            <TabsContent value="risks">
              <RiskAssessment location={location} crop={crop} handleSerisouRiskFactor={handleSerisouRiskFactor}/>
            </TabsContent>
            <TabsContent value="recommendations">
              <ProductRecommendations location={location} crop={crop} />
            </TabsContent>
            <TabsContent value="tracker">
              <SeasonalTracker location={location} crop={crop} />
            </TabsContent>
          </Tabs>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {step < 3 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">{step === 1 ? "Select Your Location" : "Select Your Crop"}</h2>
            {renderStepContent()}
            <div className="mt-6 flex justify-end">
              {step === 1 && location && (
                <Button onClick={() => setStep(2)}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {step === 3 && renderStepContent()}

        {step === 3 && (
          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Location: <span className="font-medium">{location}</span>
              </p>
              <p className="text-sm text-gray-500">
                Crop: <span className="font-medium">{crop}</span>
              </p>
            </div>
            <Button variant="outline" onClick={() => setStep(1)}>
              Change Selection
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

