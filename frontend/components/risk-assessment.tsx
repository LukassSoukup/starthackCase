"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Thermometer, Droplets, Bug, Wind } from "lucide-react"

interface RiskAssessmentProps {
  location: string
  crop: string
}

interface RiskFactor {
  name: string
  level: number
  description: string
  icon: React.ReactNode
  color: string
}

export default function RiskAssessment({ location, crop }: RiskAssessmentProps) {
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to get risk factors based on location and crop
    const fetchRiskFactors = () => {
      setLoading(true)

      // This would be replaced with actual API call
      setTimeout(() => {
        // Mock data - in a real app, this would come from an API
        const mockRiskFactors: RiskFactor[] = [
          {
            name: "Temperature Stress",
            level: Math.floor(Math.random() * 40) + 40, // Random level between 40-80
            description: `${crop === "rice" ? "Temperature variations may affect flowering" : "Temperature fluctuations could impact growth"}`,
            icon: <Thermometer className="h-5 w-5" />,
            color: "text-orange-500",
          },
          {
            name: "Water Stress",
            level: Math.floor(Math.random() * 50) + 30, // Random level between 30-80
            description: `${crop === "rice" ? "Water availability during critical growth stages" : "Irrigation needs based on local precipitation patterns"}`,
            icon: <Droplets className="h-5 w-5" />,
            color: "text-blue-500",
          },
          {
            name: "Pest Pressure",
            level: crop === "cotton" ? 75 : crop === "rice" ? 65 : 55,
            description: `${crop === "cotton" ? "Risk of bollworm infestation" : "Typical pest pressure for this crop type"}`,
            icon: <Bug className="h-5 w-5" />,
            color: "text-red-500",
          },
          {
            name: "Wind Damage",
            level: Math.floor(Math.random() * 40) + 30, // Random level between 30-70
            description: "Wind patterns may affect plant structure and pollination",
            icon: <Wind className="h-5 w-5" />,
            color: "text-purple-500",
          },
        ]

        setRiskFactors(mockRiskFactors)
        setLoading(false)
      }, 1000)
    }

    if (location && crop) {
      fetchRiskFactors()
    }
  }, [location, crop])

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex justify-center">
        <div className="animate-pulse space-y-4 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
      <h3 className="text-lg sm:text-xl font-semibold">
        Risk Assessment for {crop.charAt(0).toUpperCase() + crop.slice(1)} in {location}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
        Based on current climate data and historical patterns, here are the key risks for your crop:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {riskFactors.map((factor, index) => (
          <Card key={index}>
            <CardHeader className="pb-2 px-3 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`mr-2 ${factor.color}`}>{factor.icon}</div>
                  <CardTitle className="text-base sm:text-lg">{factor.name}</CardTitle>
                </div>
                <span
                  className={`text-xs sm:text-sm font-bold ${factor.level > 70 ? "text-red-500" : factor.level > 40 ? "text-yellow-500" : "text-green-500"}`}
                >
                  {factor.level > 70 ? "High" : factor.level > 40 ? "Medium" : "Low"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 py-2 sm:py-3">
              <Progress
                value={factor.level}
                className={`h-2 ${factor.level > 70 ? "bg-red-100" : factor.level > 40 ? "bg-yellow-100" : "bg-green-100"}`}
                indicatorClassName={
                  factor.level > 70 ? "bg-red-500" : factor.level > 40 ? "bg-yellow-500" : "bg-green-500"
                }
              />
              <CardDescription className="mt-2 text-xs sm:text-sm">{factor.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

