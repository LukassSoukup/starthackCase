"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface CropSelectorProps {
  onSelect: (crop: string) => void
}

export default function CropSelector({ onSelect }: CropSelectorProps) {
  const [selectedCrop, setSelectedCrop] = useState("")

  const handleCropChange = (value: string) => {
    setSelectedCrop(value)
    onSelect(value)
  }

  // Define crops with direct image URLs
  const crops = [
    {
      id: "rice",
      name: "Rice",
      imageUrl: "/rice.jpg",
    },
    {
      id: "wheat",
      name: "Wheat",
      imageUrl: "/wheat.jpg",
    },
    {
      id: "cotton",
      name: "Cotton",
      imageUrl: "/cotton.jpg",
    },
  ]

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedCrop} onValueChange={handleCropChange}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {crops.map((crop) => (
            <div key={crop.id} className="relative">
              <RadioGroupItem value={crop.id} id={crop.id} className="peer sr-only" />
              <Label
                htmlFor={crop.id}
                className="block cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-md peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-green-600 peer-data-[state=checked]:border-green-600"
              >
                <div
                  className="relative h-36 sm:h-40 md:h-48"
                  style={{
                    backgroundImage: `url(${crop.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg">
                      {crop.name}
                    </span>
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

