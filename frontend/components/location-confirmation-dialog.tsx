"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MapPin } from "lucide-react"

interface LocationConfirmationDialogProps {
  location: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function LocationConfirmationDialog({
  location,
  open,
  onOpenChange,
  onConfirm,
}: LocationConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[95vw] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Confirm your location</DialogTitle>
          <DialogDescription>
            Please confirm that this is the correct location for your farming activities.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 py-4">
          <div className="bg-green-50 p-3 rounded-full flex-shrink-0">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-base sm:text-lg truncate">{location}</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              We'll use this location to provide tailored recommendations for your crops.
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Change Location
          </Button>
          <Button onClick={onConfirm} className="w-full sm:w-auto">
            Confirm Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

