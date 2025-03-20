"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { cropImages } from "./crop-images"

interface CropSelectorProps {
  onSelect: (crop: string) => void
}

export default function CropSelector({ onSelect }: CropSelectorProps) {
  const [selectedCrop, setSelectedCrop] = useState("")
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleCropChange = (value: string) => {
    setSelectedCrop(value)
    onSelect(value)
  }

  const handleImageError = (cropId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [cropId]: true,
    }))
  }

  const crops = [
    {
      id: "rice",
      name: "Rice",
      image: cropImages.rice,
      fallbackColor: "bg-amber-100",
      textColor: "text-white",
    },
    {
      id: "wheat",
      name: "Wheat",
      image: cropImages.wheat,
      fallbackColor: "bg-yellow-100",
      textColor: "text-white",
    },
    {
      id: "corn",
      name: "Corn",
      image: cropImages.corn,
      fallbackColor: "bg-yellow-200",
      textColor: "text-white",
    },
    {
      id: "soybeans",
      name: "Soybeans",
      image: cropImages.soybeans,
      fallbackColor: "bg-green-100",
      textColor: "text-white",
    },
    {
      id: "cotton",
      name: "Cotton",
      image: cropImages.cotton,
      fallbackColor: "bg-gray-100",
      textColor: "text-white",
    },
    {
      id: "sugarcane",
      name: "Sugarcane",
      image: cropImages.sugarcane,
      fallbackColor: "bg-lime-100",
      textColor: "text-white",
    },
  ]

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedCrop} onValueChange={handleCropChange}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {crops.map((crop) => (
            <div key={crop.id} className="relative">
              <RadioGroupItem value={crop.id} id={crop.id} className="peer sr-only" />
              <Label
                htmlFor={crop.id}
                className={`block cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-md peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-green-600 peer-data-[state=checked]:border-green-600 ${imageErrors[crop.id] ? crop.fallbackColor : ""}`}
              >
                <div className="relative h-48 overflow-hidden">
                  {!imageErrors[crop.id] ? (
                    <Image
                      src={crop.image || "/placeholder.svg"}
                      alt={crop.name}
                      fill
                      style={{ objectFit: "cover" }}
                      onError={() => handleImageError(crop.id)}
                      className="transition-transform hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className={`absolute inset-0 ${crop.fallbackColor}`} />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <span className={`text-4xl font-bold drop-shadow-lg ${crop.textColor}`}>{crop.name}</span>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

