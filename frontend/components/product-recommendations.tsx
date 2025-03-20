"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Calendar, ThumbsUp, ArrowBigDown, ArrowBigUp, ShoppingCart } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProductRecommendationsProps {
  location: string
  crop: string
}

interface Product {
  id: string
  name: string
  type: string[]
  description: string,
  benefits: string[]
  applicationTiming: string
  efficacyScore: number
  sustainabilityScore: number,
  link: string
}

export default function ProductRecommendations({ location, crop }: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null)

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
            name: "Stress Buster",
            type: ["Anti-stress and growth activator"],
            description: "Our comprehensive portfolio include biostimulant that contains a complex of selected vegetal extracts derived from selected plants. • When applied in case of abiotic stresses, its synergistic action of different active ingredients, allows the plants to tolerate and quickly overcome the stress, preserving yield. • Applied regularly in normal condition, optimizes plant growth.",
            benefits: ["Enhances stress tolerance, preserves yield, and supports overall plant health."],
            applicationTiming: "Apply when stress is predicted or regularly for growth enhancement.",
            efficacyScore: 95,
            sustainabilityScore: 98,
            link: "https://www.syngenta.co.in/crop-protection"
          },
          {
            id: "bio-2",
            name: "Yield Booster",
            type: ["Highest crop productivity", "Highest return for farmers"],
            description: "In our portfolio we have a biostimulant for row crops able to ensure highest productivity and return for farmers. This solution is able to increase plant productivity through: • Better transport of sugars and nutrients • Promotion of cell division • Fatty acids biosynthesis and transport",
            benefits: ["Boosts productivity and maximizes return on investment for farmers."],
            applicationTiming: "Apply before the growing season based on historical data and weather forecasts.",
            efficacyScore: 81,
            sustainabilityScore: 59,
            link: "https://www.syngentabiologicals.com/usa/en-us/products/farm/micronutrients/"
          },
          {
            id: "bio-3",
            name: "Nutrient Booster",
            type: ["Biofertilizer"],
            description: "Different factors influence that can limit the availability of Nitrogen,Phosphorus and other nutrients:• ammonia volatilization, nitrification, denitrification, immobilization.• Leaching, runoff, temperature, soil pH, soil texture, rainfall and irrigation, soilsalinity, tillage, weeds, pests, diseases, nutrients loss from plants, croprotation, crop nutrition, crop varieties.• Nutritional management (right time, right source, right place, and rightrate/amount).Nutrient Use Efficiency (NUE) products are biological products thatare used for fixing Nitrogen, Phosphorus solubilization, improvingnutrient availability and uptake, and promoting plant growth and soil health.",
            benefits: ["Optimizes nutrient management, reduces the need for synthetic fertilizers, and supports sustainable farming practices."],
            applicationTiming: "Apply before the season as a seed treatment or foliar spray.",
            efficacyScore: 90,
            sustainabilityScore: 91,
            link: "https://www.syngentabiologicals.com/usa/en-us/products/farm/biostimulants/"
          }
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
          <Card key={product.id} className="overflow-hidden" onClick={(e) => {
            if ((e.target as HTMLElement).closest("button")) return;
            setExpandedProductId(product.id === expandedProductId ? null : product.id);
          }}>
            <CardHeader className=" px-3 sm:px-6 py-3 sm:py-4 bg-green-50">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                    {product.name}
                  </CardTitle>
                  {product.type.map((type, index) => (
                    <Badge key={index} variant="outline" className="mt-1 text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-4 items-center">
                    <button 
                    className="flex items-center hover:bg-yellow-50 text-gray-800 px-3 py-2 rounded text-sm sm:text-base"
                    onClick={() => window.open(product.link, "_blank")}
                    >
                    <ShoppingCart className="h-6 w-6 text-gray-600 mr-2" />
                    </button>
                  <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <div className="flex items-center bg-green-100 text-green-800 px-3 py-2 rounded text-sm sm:text-base">
                      <ThumbsUp className="h-4 w-4 mr-2" />
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
                <div className="ml-auto">
                {expandedProductId === null && (
                  <ArrowBigDown className="h-4 w-4 text-gray-500" />
                )}
                {expandedProductId !== null && (
                  <ArrowBigUp className="h-4 w-4 text-gray-500" />
                )}
                </div>
            </CardHeader>
            {expandedProductId === product.id && (
            <CardContent className="pt-0 pb-7 pl-8">
                <CardDescription className="text-sm sm:text-base text-gray-700 mb-3" title={product.name}>
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
              )}
          </Card>
        ))}
      </div>
    </div>
  )
}

