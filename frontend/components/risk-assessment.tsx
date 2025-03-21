"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Droplets, TriangleAlert, Moon, Sun, Snowflake } from "lucide-react"
import { fetchRisks } from "@/app/server/api/ApiHandler"
import { getLocation } from "@/lib/utils"

interface RiskAssessmentProps {
  location: string
  crop: string
  handleSerisouRiskFactor: (factor: RiskFactor) => void
}

export interface RiskFactor {
  name: string
  level: number
  description: string
  icon: React.ReactNode
  color: string
}

export default function RiskAssessment({ location, crop, handleSerisouRiskFactor }: RiskAssessmentProps) {
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([])
  const [loading, setLoading] = useState(true)
  const { latitude, longitude } = getLocation();

  if (latitude === 0 || longitude === 0) {
    console.error("Location not available")
    return <div className="text-red-500">Location not available</div>
  }

  useEffect(() => {
    const fetchRiskFactors = async () => {
      setLoading(true)

      try {
        // Fetch risks from the API
        const response = await fetchRisks(latitude, longitude, crop)
        console.log("Risk factors response:", response)
        // Map the API response to the mockRiskFactors
        const updatedRiskFactors: RiskFactor[] = [
          {
            name: "Day time heat stress",
            level: response.daytime_heat_stress*10 || 0,
            description: `${
              crop === "rice"
                ? "Temperature variations may affect flowering"
                : "Temperature fluctuations could impact growth"
            }`,
            icon: <Sun className="h-10 w-10" />,
            color: "text-red-500",
          },
          {
            name: "Drought Stress",
            level: Math.max(0, Math.min(100, (1 - response.drought_index) * 100)) || 0, // > 1 no risk, = 1 medium risk, < 1 high risk
            description: `${
              crop === "rice"
                ? "Water availability during critical growth stages"
                : "Irrigation needs based on local precipitation patterns"
            }`,
            icon: <Droplets className="h-10 w-10" />,
            color: "text-blue-500",
          },
          {
            name: "Night time heat stress",
            level: response.nighttime_heat_stress*10 || 0,
            description: "High night time temperatures can affect plant growth",
            icon: <Moon className="h-10 w-10" />,
            color: "text-yellow-950",
          }
        ]

        // Sort the risk factors by level in descending order
        const sortedRiskFactors = updatedRiskFactors.sort((a, b) => b.level - a.level)

        setRiskFactors(sortedRiskFactors)
      } catch (error) {
        console.error("Error fetching risks:", error)
      } finally {
        setLoading(false)
      }
    }

    if (location && crop) {
      fetchRiskFactors()
    }
  }, [latitude, longitude, crop, location])

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
        Risks for {crop.charAt(0).toUpperCase() + crop.slice(1)}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-4">
        Based on climate and soil data here are the key risks for your crop:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {riskFactors.map((factor, index) => (
          <Card key={index} className="relative flex flex-col gap-2 p-4" onClick={() => handleSerisouRiskFactor(factor)}>
            <CardHeader className="pb-2 px-4 sm:px-6 py-1 sm:py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`mr-2 ${factor.color}`}>{factor.icon}</div>
                <CardTitle className="text-base sm:text-lg">{factor.name}</CardTitle>
              </div>
              {factor.level > 70 && <TriangleAlert className="h-6 w-6 text-red-500 animate-pulse duration-200" />}
            </CardHeader>
            <CardContent className="px-4 sm:px-6 py-1 sm:py-3">
              <Progress
                value={factor.level}
                className="h-2"
                barColor={`${
                  factor.level > 70 ? "bg-red-400" : factor.level > 40 ? "bg-yellow-400" : "bg-green-400"
                }`}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}