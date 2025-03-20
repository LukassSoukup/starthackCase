"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle2, AlertCircle, BarChart3 } from "lucide-react"

interface SeasonalTrackerProps {
  location: string
  crop: string
}

export default function SeasonalTracker({ location, crop }: SeasonalTrackerProps) {
  const [activePhase, setActivePhase] = useState("planning")

  // Mock data for seasonal phases
  const phases = [
    { id: "planning", name: "Planning", status: "completed" },
    { id: "planting", name: "Planting", status: "active" },
    { id: "growing", name: "Growing", status: "upcoming" },
    { id: "harvesting", name: "Harvesting", status: "upcoming" },
  ]

  // Mock data for tasks
  const tasks = [
    { id: 1, name: "Soil testing", phase: "planning", status: "completed", date: "2023-01-15" },
    { id: 2, name: "Select biological products", phase: "planning", status: "completed", date: "2023-01-20" },
    { id: 3, name: "Apply soil amendments", phase: "planting", status: "completed", date: "2023-02-05" },
    { id: 4, name: "Plant seeds", phase: "planting", status: "in-progress", date: "2023-02-10" },
    { id: 5, name: "Apply BioDefend", phase: "growing", status: "upcoming", date: "2023-03-01" },
    { id: 6, name: "Monitor for pests", phase: "growing", status: "upcoming", date: "2023-03-15" },
    { id: 7, name: "Apply NaturalShield Pro", phase: "growing", status: "upcoming", date: "2023-04-01" },
    { id: 8, name: "Prepare for harvest", phase: "harvesting", status: "upcoming", date: "2023-05-15" },
  ]

  const filteredTasks = tasks.filter((task) => task.phase === activePhase)

  return (
    <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
      <h3 className="text-lg sm:text-xl font-semibold">Seasonal Tracker</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
        Track your progress throughout the growing season and manage biological product applications.
      </p>

      <div className="flex overflow-x-auto pb-2 mb-3 sm:mb-4 -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex space-x-1 sm:space-x-2">
          {phases.map((phase, index) => (
            <div key={phase.id} className="flex items-center">
              {index > 0 && (
                <div
                  className={`h-0.5 w-4 sm:w-8 ${phase.status === "completed" ? "bg-green-500" : "bg-gray-200"}`}
                ></div>
              )}
              <Button
                variant={activePhase === phase.id ? "default" : "outline"}
                className={`rounded-full text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 h-auto ${
                  phase.status === "completed"
                    ? "border-green-500 text-green-700"
                    : phase.status === "active"
                      ? "border-blue-500 text-blue-700"
                      : "border-gray-300 text-gray-500"
                }`}
                onClick={() => setActivePhase(phase.id)}
              >
                {phase.name}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
          <CardTitle className="text-base sm:text-lg">
            {phases.find((p) => p.id === activePhase)?.name} Phase Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 py-2 sm:py-4">
          <div className="space-y-3 sm:space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-2 sm:p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                    task.status === "completed"
                      ? "bg-green-50 border-green-200"
                      : task.status === "in-progress"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    {task.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    ) : task.status === "in-progress" ? (
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2 sm:mr-3 flex-shrink-0" />
                    ) : (
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm sm:text-base">{task.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">Due: {task.date}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={task.status === "completed"}
                    className="text-xs sm:text-sm h-7 sm:h-8 self-end sm:self-auto"
                  >
                    {task.status === "completed"
                      ? "Completed"
                      : task.status === "in-progress"
                        ? "Mark Complete"
                        : "Start Task"}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No tasks for this phase yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-1 sm:mt-1">
        <CardHeader className="px-3 sm:px-6">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
            Season Performance Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <Tabs defaultValue="yield">
            <TabsList className="grid w-full grid-cols-2 h-auto">
              <TabsTrigger value="yield" className="text-xs sm:text-sm py-1 sm:py-2">
                Yield Forecast
              </TabsTrigger>
              <TabsTrigger value="health" className="text-xs sm:text-sm py-1 sm:py-2">
                Crop Health
              </TabsTrigger>
            </TabsList>
            <TabsContent value="yield" className="pt-3 sm:pt-4">
              <div className="h-36 sm:h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-xs sm:text-sm text-center px-4">
                  Yield forecast data will appear here as the season progresses
                </p>
              </div>
            </TabsContent>
            <TabsContent value="health" className="pt-3 sm:pt-4">
              <div className="h-36 sm:h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-xs sm:text-sm text-center px-4">
                  Crop health metrics will be displayed here throughout the growing season
                </p>
              </div>
            </TabsContent>
            <TabsContent value="sustainability" className="pt-3 sm:pt-4">
              <div className="h-36 sm:h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-xs sm:text-sm text-center px-4">
                  Sustainability impact data will be calculated based on your biological product usage
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

