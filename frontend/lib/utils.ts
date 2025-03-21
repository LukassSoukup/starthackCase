import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getLocation = () => {
  return {
    longitude: parseFloat(localStorage.getItem("longitude") || "74.608683"),
    latitude: parseFloat(localStorage.getItem("latitude") || "22.612490")
  }
}

export const setLocation = (lat:string, lon:string) => {
  localStorage["longitude"] = lat
  localStorage["latitude"] = lon
}