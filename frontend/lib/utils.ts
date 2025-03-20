import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getLocation = () => {
  return {
    longitude: parseFloat(localStorage.getItem("longitude") || "0"),
    latitude: parseFloat(localStorage.getItem("latitude") || "0")
  }
}