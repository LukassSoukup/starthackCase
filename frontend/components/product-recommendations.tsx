"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Calendar, ThumbsUp, ArrowBigDown, ArrowBigUp, ShoppingCart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RiskFactor } from "./risk-assessment";
import { fetchRecommendations, RecommendationsResponse } from "@/app/server/api/ApiHandler"; // Import the API handler
import { getLocation } from "@/lib/utils";

interface ProductRecommendationsProps {
  location: string;
  crop: string;
  selectedRisk?: RiskFactor;
}

interface Product {
  id: string;
  name: string;
  type: string;
  description: string;
  benefits: string[];
  applicationTiming: string;
  efficacyScore: number;
  link: string;
}

interface MockDataInterface {
  [key: string]: {
    link: string;
    benefits: string[];
    efficacyScore: number;
    applicationTiming: string;
    type: string;
  };
}

export default function ProductRecommendations({ crop, selectedRisk }: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { latitude, longitude } = getLocation();
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const MockData: MockDataInterface = {
    "Nutrient Booster": {
      link: "https://www.syngentabiologicals.com/usa/en-us/products/farm/biostimulants/",
      benefits: ["Optimizes nutrient management, reduces the need for synthetic fertilizers, and supports sustainable farming practices."],
      efficacyScore: 90,
      applicationTiming: "Apply before the season as a seed treatment or foliar spray.",
      type: "Biofertilizer"
    },
    "Stress Buster": {
      link: "https://www.syngenta.co.in/crop-protection",
      benefits: ["Enhances stress tolerance, preserves yield, and supports overall plant health."],
      efficacyScore: 95,
      applicationTiming: "Apply when stress is predicted or regularly for growth enhancement.",
      type: "Anti-stress and growth activator"
    },
    "Yield Booster": {
      link: "https://www.syngentabiologicals.com/usa/en-us/products/farm/micronutrients/",
      benefits: ["Boosts productivity and maximizes return on investment for farmers."],
      efficacyScore: 81,
      applicationTiming: "Apply before the growing season based on historical data and weather forecasts.",
      type: "Highest crop productivity"
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch recommendations from the API
        const response = await fetchRecommendations(latitude, longitude, crop);
        console.log("Fetched recommendations:", response);

        // Filter or map the response to match the Product interface
        const relevantProducts = response.map((item: RecommendationsResponse) => ({
          id: item.product, // Use `id` or `product` as the unique identifier
          name: item.product || "Unknown Product",
          type: MockData[item.product].type, // Add a default type if not provided
          description: item.detailed_description || "No description available.",
          benefits: MockData[item.product].benefits || ["No benefits listed."],
          applicationTiming: MockData[item.product].applicationTiming || "No application timing provided.",
          efficacyScore: MockData[item.product].efficacyScore || 0,
          link: MockData[item.product].link || "#", // Default to "#" if no link is provided
        }));
        setProducts(relevantProducts);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (location && crop) {
      fetchData();
    }
  }, [location, crop]);

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex justify-center">
        <div className="animate-pulse space-y-4 sm:space-y-6 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 sm:h-48 bg-gray-200 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
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
          <Card
            key={product.id}
            className="overflow-hidden"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("button")) return;
              setExpandedProductId(product.id === expandedProductId ? null : product.id);
            }}
          >
            <CardHeader className="px-3 sm:px-6 py-3 sm:py-4 bg-green-50">
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
                {expandedProductId === null && <ArrowBigDown className="h-4 w-4 text-gray-500" />}
                {expandedProductId !== null && <ArrowBigUp className="h-4 w-4 text-gray-500" />}
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
  );
}

