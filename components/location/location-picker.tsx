"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MapPin, 
  Navigation, 
  Search,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { 
  BANGLADESH_DIVISIONS,
  DHAKA_DISTRICTS,
  BangladeshLocation,
  searchLocations,
  getLocationHierarchy,
  Coordinates
} from '@/lib/geolocation/bangladesh-locations';
import { geolocationService, GeolocationResult } from '@/lib/geolocation/geolocation-service';

interface LocationPickerProps {
  onLocationSelect: (location: {
    coordinates: Coordinates;
    address: string;
    division: string;
    district: string;
    isGPS?: boolean;
  }) => void;
  initialLocation?: {
    coordinates: Coordinates;
    address: string;
    division: string;
    district: string;
  };
  showGPSOption?: boolean;
}

export default function LocationPicker({
  onLocationSelect,
  initialLocation,
  showGPSOption = true,
}: LocationPickerProps) {
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BangladeshLocation[]>([]);
  const [isUsingGPS, setIsUsingGPS] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<GeolocationResult | null>(null);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [manualAddress, setManualAddress] = useState('');

  useEffect(() => {
    if (initialLocation) {
      setManualAddress(initialLocation.address);
      setSelectedDivision(initialLocation.division);
      setSelectedDistrict(initialLocation.district);
    }
  }, [initialLocation]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = searchLocations(searchQuery);
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleGPSLocation = async () => {
    setIsLoadingGPS(true);
    try {
      const location = await geolocationService.getCurrentLocation();
      setGpsLocation(location);
      setIsUsingGPS(true);
      
      // Auto-select based on GPS
      onLocationSelect({
        coordinates: location.coordinates,
        address: location.address || `${location.coordinates.latitude.toFixed(4)}, ${location.coordinates.longitude.toFixed(4)}`,
        division: location.division || 'Dhaka',
        district: location.district || 'Dhaka',
        isGPS: true,
      });
    } catch (error) {
      console.error('Error getting GPS location:', error);
    } finally {
      setIsLoadingGPS(false);
    }
  };

  const handleDivisionChange = (divisionId: string) => {
    setSelectedDivision(divisionId);
    setSelectedDistrict('');
    setIsUsingGPS(false);
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    setIsUsingGPS(false);
    
    // Find the selected district
    const district = DHAKA_DISTRICTS.find(d => d.id === districtId);
    const division = BANGLADESH_DIVISIONS.find(d => d.id === selectedDivision);
    
    if (district && division) {
      onLocationSelect({
        coordinates: district.coordinates,
        address: manualAddress || `${district.name}, ${division.name}`,
        division: division.name,
        district: district.name,
        isGPS: false,
      });
    }
  };

  const handleSearchResultSelect = (location: BangladeshLocation) => {
    const hierarchy = getLocationHierarchy(location.id);
    const division = hierarchy.find(l => l.type === 'division');
    const district = hierarchy.find(l => l.type === 'district');
    
    setSearchQuery('');
    setSearchResults([]);
    setIsUsingGPS(false);
    
    onLocationSelect({
      coordinates: location.coordinates,
      address: manualAddress || location.name,
      division: division?.name || 'Unknown',
      district: district?.name || location.name,
      isGPS: false,
    });
  };

  const handleManualAddressSubmit = () => {
    if (!manualAddress.trim()) return;
    
    const division = BANGLADESH_DIVISIONS.find(d => d.id === selectedDivision);
    const district = DHAKA_DISTRICTS.find(d => d.id === selectedDistrict);
    
    if (division && district) {
      onLocationSelect({
        coordinates: district.coordinates,
        address: manualAddress,
        division: division.name,
        district: district.name,
        isGPS: false,
      });
    }
  };

  const getAvailableDistricts = () => {
    if (selectedDivision === 'dhaka') {
      return DHAKA_DISTRICTS;
    }
    // Add more districts for other divisions as needed
    return [];
  };

  return (
    <div className="space-y-6">
      {/* GPS Location Option */}
      {showGPSOption && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Navigation className="h-5 w-5 mr-2" />
              Use Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isUsingGPS && gpsLocation ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Using GPS location</span>
                <Badge variant="secondary" className="ml-2">
                  Accuracy: {Math.round(gpsLocation.accuracy)}m
                </Badge>
              </div>
            ) : (
              <Button 
                onClick={handleGPSLocation} 
                disabled={isLoadingGPS}
                variant="outline"
                className="w-full"
              >
                {isLoadingGPS ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <MapPin className="h-4 w-4 mr-2" />
                )}
                Get My Location
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {searchResults.length > 0 && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {searchResults.map((location) => (
                  <div
                    key={location.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSearchResultSelect(location)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-gray-600">{location.nameLocal}</p>
                      </div>
                      <Badge variant="outline">{location.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Location Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Location Manually</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Division</label>
            <Select value={selectedDivision} onValueChange={handleDivisionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                {BANGLADESH_DIVISIONS.map((division) => (
                  <SelectItem key={division.id} value={division.id}>
                    {division.name} ({division.nameLocal})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDivision && (
            <div>
              <label className="text-sm font-medium">District</label>
              <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDistricts().map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name} ({district.nameLocal})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Detailed Address</label>
            <Input
              placeholder="Enter your detailed address..."
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
          </div>

          {selectedDivision && selectedDistrict && manualAddress && (
            <Button onClick={handleManualAddressSubmit} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Location
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Location Preview */}
      {(isUsingGPS || (selectedDivision && selectedDistrict)) && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  {isUsingGPS && gpsLocation
                    ? gpsLocation.address || 'GPS Location'
                    : manualAddress || 'Manual Location'
                  }
                </span>
              </div>
              
              {isUsingGPS && (
                <Badge variant="secondary" className="text-xs">
                  GPS Location (Auto-detected)
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
