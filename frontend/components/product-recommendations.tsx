"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Leaf, Calendar, ThumbsUp, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProductRecommendationsProps {
  location: string
  crop: string
}

interface Product {
  id: string
  name: string
  type: string
  description: string
  benefits: string[]
  applicationTiming: string
  efficacyScore: number
  sustainabilityScore: number
}

export default function ProductRecommendations({ location, crop }: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to get product recommendations
    const fetchRecommendations = () => {
      setLoading(true)

      // This would be replaced with actual API call
      setTimeout(() => {
        // Mock data - in a real app, this would come from an API
        const mockProducts: Product[] = [
          {
            id: "bio-1",
            name: "NaturalShield Pro",
            type: "Microbial Inoculant",
            description: `Enhances ${crop} resilience against environmental stresses and improves nutrient uptake in various climate conditions.`,
            benefits: ["Improves root development", "Enhances nutrient absorption", "Reduces transplant shock"],
            applicationTiming: "Apply at planting or early growth stage",
            efficacyScore: 92,
            sustainabilityScore: 95,
          },
          {
            id: "bio-2",
            name: "BioDefend",
            type: "Biological Fungicide",
            description: `Protects ${crop} against common fungal diseases while promoting plant health across different growing regions.`,
            benefits: ["Controls powdery mildew", "Prevents root rot", "Stimulates plant immune system"],
            applicationTiming: "Apply preventatively every 14-21 days",
            efficacyScore: 88,
            sustainabilityScore: 90,
          },
          {
            id: "bio-3",
            name: "SoilVitality",
            type: "Soil Amendment",
            description:
              "Improves soil structure and microbial activity for better crop establishment in diverse soil conditions.",
            benefits: ["Enhances water retention", "Improves soil aeration", "Promotes beneficial microorganisms"],
            applicationTiming: "Apply 2-4 weeks before planting",
            efficacyScore: 85,
            sustainabilityScore: 98,
          },
        ]

        setProducts(mockProducts)
        setLoading(false)
      }, 1000)
    }

    if (location && crop) {
      fetchRecommendations()
    }
  }, [location, crop])

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex justify-center">
        <div className="animate-pulse space-y-4 sm:space-y-6 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 sm:h-48 bg-gray-200 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
      <h3 className="text-lg sm:text-xl font-semibold">Recommended Biological Products</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
        Based on your location, crop selection, and current environmental conditions, we recommend the following
        biological products:
      </p>

      <div className="space-y-3 sm:space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="pb-2 px-3 sm:px-6 py-3 sm:py-4 bg-green-50">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                    {product.name}
                  </CardTitle>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {product.type}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-xs sm:text-sm">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>{product.efficacyScore}%</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Efficacy score based on field trials</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6">
              <CardDescription className="text-sm sm:text-base text-gray-700 mb-3">
                {product.description}
              </CardDescription>

              <div className="mt-2">
                <h4 className="text-xs sm:text-sm font-medium mb-1">Key Benefits:</h4>
                <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-gray-600 space-y-1">
                  {product.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center mt-3 text-xs sm:text-sm text-gray-600">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-500" />
                <span>{product.applicationTiming}</span>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 flex flex-col sm:flex-row gap-2 sm:justify-between p-3 sm:p-4">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
              >
                <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Product Details
              </Button>
              <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9">
                Add to Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

