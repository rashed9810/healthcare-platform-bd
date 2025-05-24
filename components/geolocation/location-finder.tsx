"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Navigation, 
  Search, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Phone,
  Globe
} from "lucide-react";

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  district?: string;
  division?: string;
}

interface NearbyDoctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  address: string;
  distance: number;
  rating: number;
  availability: "available" | "busy" | "offline";
  phone: string;
  languages: string[];
}

interface LocationFinderProps {
  onLocationFound?: (location: Location) => void;
  onDoctorsFound?: (doctors: NearbyDoctor[]) => void;
  language?: "en" | "bn";
}

export default function LocationFinder({ 
  onLocationFound, 
  onDoctorsFound, 
  language = "en" 
}: LocationFinderProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState("");
  const [nearbyDoctors, setNearbyDoctors] = useState<NearbyDoctor[]>([]);
  const [searchRadius, setSearchRadius] = useState(5); // km

  // Mock nearby doctors data for Bangladesh
  const mockNearbyDoctors: NearbyDoctor[] = [
    {
      id: "1",
      name: "ডা. ফাতিমা খান",
      specialty: "Cardiology",
      hospital: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
      address: "বকশী বাজার, ঢাকা",
      distance: 1.2,
      rating: 4.9,
      availability: "available",
      phone: "+880 1711-123456",
      languages: ["Bengali", "English"]
    },
    {
      id: "2", 
      name: "ডা. করিম উদ্দিন",
      specialty: "Pediatrics",
      hospital: "শিশু হাসপাতাল",
      address: "শাহবাগ, ঢাকা",
      distance: 2.8,
      rating: 4.8,
      availability: "busy",
      phone: "+880 1712-234567",
      languages: ["Bengali", "English"]
    },
    {
      id: "3",
      name: "ডা. রহমান সাহেব",
      specialty: "General Medicine",
      hospital: "স্কয়ার হাসপাতাল",
      address: "পান্থপথ, ঢাকা",
      distance: 3.5,
      rating: 4.7,
      availability: "available",
      phone: "+880 1713-345678",
      languages: ["Bengali", "English", "Hindi"]
    }
  ];

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error(language === "en" 
          ? "Geolocation is not supported by this browser"
          : "এই ব্রাউজার জিওলোকেশন সাপোর্ট করে না"
        );
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Mock reverse geocoding for Bangladesh
      const mockAddress = await reverseGeocode(latitude, longitude);
      
      const locationData: Location = {
        latitude,
        longitude,
        address: mockAddress.address,
        district: mockAddress.district,
        division: mockAddress.division
      };

      setLocation(locationData);
      onLocationFound?.(locationData);
      
      // Find nearby doctors
      await findNearbyDoctors(latitude, longitude);

    } catch (error: any) {
      const errorMessage = error.code === 1 
        ? (language === "en" ? "Location access denied" : "অবস্থান অ্যাক্সেস অস্বীকৃত")
        : error.code === 2
        ? (language === "en" ? "Location unavailable" : "অবস্থান অনুপলব্ধ")
        : error.code === 3
        ? (language === "en" ? "Location request timeout" : "অবস্থান অনুরোধ সময়সীমা শেষ")
        : (language === "en" ? "Failed to get location" : "অবস্থান পেতে ব্যর্থ");
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    // Mock reverse geocoding for Bangladesh locations
    const bangladeshLocations = [
      { address: "ধানমন্ডি, ঢাকা", district: "ঢাকা", division: "ঢাকা" },
      { address: "গুলশান, ঢাকা", district: "ঢাকা", division: "ঢাকা" },
      { address: "উত্তরা, ঢাকা", district: "ঢাকা", division: "ঢাকা" },
      { address: "চট্টগ্রাম শহর", district: "চট্টগ্রাম", division: "চট্টগ্রাম" },
      { address: "সিলেট শহর", district: "সিলেট", division: "সিলেট" }
    ];
    
    return bangladeshLocations[Math.floor(Math.random() * bangladeshLocations.length)];
  };

  const findNearbyDoctors = async (lat: number, lng: number) => {
    // Mock finding nearby doctors based on location
    const doctors = mockNearbyDoctors.filter(doctor => doctor.distance <= searchRadius);
    setNearbyDoctors(doctors);
    onDoctorsFound?.(doctors);
  };

  const searchByAddress = async () => {
    if (!manualAddress.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      // Mock geocoding for Bangladesh addresses
      const mockCoords = {
        latitude: 23.8103 + (Math.random() - 0.5) * 0.1,
        longitude: 90.4125 + (Math.random() - 0.5) * 0.1
      };

      const locationData: Location = {
        ...mockCoords,
        address: manualAddress,
        district: "ঢাকা",
        division: "ঢাকা"
      };

      setLocation(locationData);
      onLocationFound?.(locationData);
      await findNearbyDoctors(mockCoords.latitude, mockCoords.longitude);

    } catch (error) {
      setError(language === "en" 
        ? "Failed to find location" 
        : "অবস্থান খুঁজে পেতে ব্যর্থ"
      );
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available": return "bg-green-100 text-green-800";
      case "busy": return "bg-yellow-100 text-yellow-800";
      case "offline": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "available": return language === "en" ? "Available" : "উপলব্ধ";
      case "busy": return language === "en" ? "Busy" : "ব্যস্ত";
      case "offline": return language === "en" ? "Offline" : "অফলাইন";
      default: return language === "en" ? "Unknown" : "অজানা";
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            {language === "en" ? "Find Your Location" : "আপনার অবস্থান খুঁজুন"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto Location */}
          <div className="flex gap-2">
            <Button 
              onClick={getCurrentLocation} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              {language === "en" ? "Use Current Location" : "বর্তমান অবস্থান ব্যবহার করুন"}
            </Button>
          </div>

          {/* Manual Address */}
          <div className="flex gap-2">
            <Input
              placeholder={language === "en" 
                ? "Enter your address (e.g., Dhanmondi, Dhaka)"
                : "আপনার ঠিকানা লিখুন (যেমন: ধানমন্ডি, ঢাকা)"
              }
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchByAddress()}
            />
            <Button onClick={searchByAddress} disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Radius */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">
              {language === "en" ? "Search Radius:" : "অনুসন্ধান ব্যাসার্ধ:"}
            </label>
            <select 
              value={searchRadius} 
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={2}>2 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
            </select>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Location Display */}
          {location && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{language === "en" ? "Location found:" : "অবস্থান পাওয়া গেছে:"}</strong><br />
                {location.address}<br />
                <small>
                  {language === "en" ? "Coordinates:" : "স্থানাঙ্ক:"} {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </small>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Nearby Doctors */}
      {nearbyDoctors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              {language === "en" ? "Nearby Doctors" : "কাছাকাছি ডাক্তার"}
              <Badge variant="secondary">{nearbyDoctors.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nearbyDoctors.map((doctor) => (
                <div key={doctor.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <Badge className={getAvailabilityColor(doctor.availability)}>
                          {getAvailabilityText(doctor.availability)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-1">{doctor.specialty}</p>
                      <p className="text-sm text-gray-500 mb-2">{doctor.hospital}</p>
                      <p className="text-sm text-gray-500 mb-2">{doctor.address}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{doctor.distance} km {language === "en" ? "away" : "দূরে"}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{doctor.rating}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{doctor.phone}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <div className="flex gap-1">
                          {doctor.languages.map((lang) => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button size="sm" disabled={doctor.availability !== "available"}>
                        {language === "en" ? "Book Now" : "এখনই বুক করুন"}
                      </Button>
                      <Button size="sm" variant="outline">
                        {language === "en" ? "View Profile" : "প্রোফাইল দেখুন"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
