"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Locate, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LocationConfirmationDialog } from "./location-confirmation-dialog"

interface LocationSelectorProps {
  onSelect: (location: string) => void
}

// Function to get location name from coordinates using OpenStreetMap API
const getLocationNameFromCoords = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch location data")
    }

    const data = await response.json()

    // Format the location name
    let locationName = ""

    if (data.address) {
      const address = data.address
      const city = address.city || address.town || address.village || address.hamlet
      const state = address.state || address.province || address.county
      const country = address.country

      if (city && country) {
        locationName = `${city}, ${country}`
      } else if (state && country) {
        locationName = `${state}, ${country}`
      } else if (country) {
        locationName = country
      } else {
        locationName = data.display_name.split(",").slice(0, 2).join(",")
      }
    } else {
      locationName = data.display_name || `Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    }

    return locationName
  } catch (error) {
    console.error("Error getting location name:", error)
    return `Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
  }
}

export default function LocationSelector({ onSelect }: LocationSelectorProps) {
  const [manualLocation, setManualLocation] = useState("")
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [locationToConfirm, setLocationToConfirm] = useState("")
  const [hasExistingLocation, setHasExistingLocation] = useState(false)

  // Check for existing location in localStorage on component mount
  useEffect(() => {
    const storedLocation = localStorage.getItem("selectedLocation")
    if (storedLocation) {
      setHasExistingLocation(true)
      setManualLocation(storedLocation)
    } else {
      // Only try to detect location automatically if no location is stored
      detectLocation()
    }
  }, [])

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported")
      return
    }

    setIsLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          localStorage.setItem("longitude", longitude.toString());
          localStorage.setItem("latitude", latitude.toString());

          const locationName = await getLocationNameFromCoords(latitude, longitude)

          setManualLocation(locationName)
          setLocationToConfirm(locationName)
          setShowConfirmation(true)
          setIsLocating(false)
        } catch (error) {
          setLocationError("Couldn't get location name")
          setIsLocating(false)
        }
      },
      (error) => {
        setLocationError(`Location access denied`)
        setIsLocating(false)
      },
    )
  }

  const handleManualLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualLocation.trim()) {
      setLocationToConfirm(manualLocation)
      setShowConfirmation(true)
    }
  }

  const handleConfirmLocation = () => {
    onSelect(locationToConfirm)
    localStorage.setItem("selectedLocation", locationToConfirm)
    setShowConfirmation(false)
  }

  const handleResetLocation = () => {
    localStorage.removeItem("selectedLocation")
    setHasExistingLocation(false)
    setManualLocation("")
    detectLocation()
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg border shadow-sm">
        {hasExistingLocation && (
          <div className="flex justify-end mb-2">
            <Button variant="ghost" size="sm" onClick={handleResetLocation} className="flex items-center text-gray-500">
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        )}

        <form onSubmit={handleManualLocationSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Enter your farming location"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!manualLocation.trim()} className="w-full sm:w-auto">
              Continue
            </Button>
          </div>

          <Button
            type="button"
            onClick={detectLocation}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-10"
            disabled={isLocating}
          >
            <Locate className="h-4 w-4" />
            {isLocating ? "Detecting..." : "Use My Current Location"}
          </Button>
        </form>

        {locationError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{locationError}</AlertDescription>
          </Alert>
        )}
      </div>

      <LocationConfirmationDialog
        location={locationToConfirm}
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleConfirmLocation}
      />
    </div>
  )
}

