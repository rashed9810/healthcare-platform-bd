"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MapPin, Search, Locate } from "lucide-react";
import { BANGLADESH_CITIES } from "@/lib/constants";
import { Coordinates, getUserLocation, DEFAULT_COORDINATES } from "@/lib/utils/geolocation";

interface LocationFilterProps {
  onLocationChange: (location: Coordinates) => void;
  onDistanceChange: (distance: number) => void;
  onCityChange?: (city: string) => void;
  maxDistance?: number;
  defaultDistance?: number;
  defaultCity?: string;
  className?: string;
}

export default function LocationFilter({
  onLocationChange,
  onDistanceChange,
  onCityChange,
  maxDistance = 20,
  defaultDistance = 5,
  defaultCity = "Dhaka",
  className,
}: LocationFilterProps) {
  const [distance, setDistance] = useState(defaultDistance);
  const [city, setCity] = useState(defaultCity);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle distance change
  const handleDistanceChange = (value: number[]) => {
    const newDistance = value[0];
    setDistance(newDistance);
    onDistanceChange(newDistance);
  };

  // Handle city change
  const handleCityChange = (value: string) => {
    setCity(value);
    if (onCityChange) {
      onCityChange(value);
    }
    
    // Set default coordinates based on selected city
    const cityCoordinates = getCityCoordinates(value);
    onLocationChange(cityCoordinates);
  };

  // Get user's current location
  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    try {
      const location = await getUserLocation();
      onLocationChange(location);
    } catch (error) {
      console.error("Error getting user location:", error);
      setLocationError("Could not access your location. Please check your browser permissions.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Handle search query submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would geocode the address
    // For now, we'll just use the default coordinates
    onLocationChange(DEFAULT_COORDINATES);
  };

  // Get coordinates for a city (mock implementation)
  const getCityCoordinates = (cityName: string): Coordinates => {
    // In a real app, these would come from a geocoding service or database
    const cityCoordinates: Record<string, Coordinates> = {
      "Dhaka": { latitude: 23.8103, longitude: 90.4125 },
      "Chittagong": { latitude: 22.3569, longitude: 91.7832 },
      "Khulna": { latitude: 22.8456, longitude: 89.5403 },
      "Rajshahi": { latitude: 24.3745, longitude: 88.6042 },
      "Sylhet": { latitude: 24.8949, longitude: 91.8687 },
      "Barisal": { latitude: 22.7010, longitude: 90.3535 },
      "Rangpur": { latitude: 25.7439, longitude: 89.2752 },
      "Comilla": { latitude: 23.4607, longitude: 91.1809 },
      "Narayanganj": { latitude: 23.6238, longitude: 90.5000 },
      "Gazipur": { latitude: 24.0958, longitude: 90.4125 },
    };
    
    return cityCoordinates[cityName] || DEFAULT_COORDINATES;
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="location-search">Search Location</Label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="location-search"
                type="text"
                placeholder="Enter an address..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="city-select">City</Label>
            <Select value={city} onValueChange={handleCityChange}>
              <SelectTrigger id="city-select" className="mt-1">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {BANGLADESH_CITIES.map((cityName) => (
                  <SelectItem key={cityName} value={cityName}>
                    {cityName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="distance-slider">Distance (km)</Label>
              <span className="text-sm font-medium">{distance} km</span>
            </div>
            <Slider
              id="distance-slider"
              min={1}
              max={maxDistance}
              step={1}
              value={[distance]}
              onValueChange={handleDistanceChange}
              className="mt-3"
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleGetCurrentLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
          ) : (
            <Locate className="h-4 w-4 mr-2" />
          )}
          Use My Current Location
        </Button>

        {locationError && (
          <p className="text-sm text-red-500 mt-1">{locationError}</p>
        )}
      </div>
    </div>
  );
}
