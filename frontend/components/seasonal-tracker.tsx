"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

interface SeasonalTrackerProps {
  location: string
  crop: string
}

export default function SeasonalTracker({ location, crop }: SeasonalTrackerProps) {
  // Forecast data
  const forecastData = {
    dates: [
      "2025-01-01",
      "2025-02-01",
      "2025-03-01",
      "2025-04-01",
      "2025-05-01",
      "2025-06-01",
      "2025-07-01",
      "2025-08-01",
      "2025-09-01",
      "2025-10-01",
      "2025-11-01",
      "2025-12-01",
    ],
    yield: [5, 7, 20, 25, 10, 35, 37, 42, 32, 35, 30, 28],
    productAppliedDates: [
      { date: "2025-02-01", product: "Stress Buster" },
      { date: "2025-05-01", product: "Nutrient Booster" },
      { date: "2025-09-01", product: "Stress Buster" },
    ],
  };

  const chartData = forecastData.dates.map((date, index) => ({
    date,
    yield: forecastData.yield[index],
  }));

  return (
    <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
      <Card className="mt-1 sm:mt-1 pb-5">
        <CardHeader className="px-3 sm:px-6 pt-5">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
            Season Performance Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <Tabs defaultValue="yield">
            <TabsList className="grid w-full grid-cols-1 h-auto">
              <TabsTrigger value="yield" className="text-xs sm:text-sm py-1 sm:py-2">
                Yield Forecast
              </TabsTrigger>
            </TabsList>
            <TabsContent value="yield" className="pt-3 sm:pt-4">
              <div className="h-64 sm:h-80 bg-whites rounded-lg flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} width={15}/>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => {
                        if (value === "yield") return "Yield (kg/ha)";
                        return value;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="yield"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Yield (kg/ha)"
                    />
                    {forecastData.productAppliedDates.map(({ date }) => (
                      <ReferenceLine
                        key={date}
                        x={date}
                        stroke="red"
                        strokeDasharray="3 3"
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Products Applied:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {forecastData.productAppliedDates.map(({ date, product }) => (
                    <div
                      key={date}
                      className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col items-start"
                    >
                      <span className="text-base font-medium text-gray-800">{product}</span>
                      <span className="text-sm text-gray-600 mt-1">Applied on {date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

