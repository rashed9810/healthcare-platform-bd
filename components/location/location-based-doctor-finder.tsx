"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  Phone,
  Car,
  AlertCircle,
  Loader2,
  RefreshCw,
  Filter
} from 'lucide-react';
import { 
  geolocationService, 
  GeolocationResult, 
  LocationBasedRecommendation 
} from '@/lib/geolocation/geolocation-service';
import { useI18n } from '@/lib/i18n/i18n-context';

interface LocationBasedDoctorFinderProps {
  specialty?: string;
  onDoctorSelect?: (recommendation: LocationBasedRecommendation) => void;
  maxDistance?: number;
}

export default function LocationBasedDoctorFinder({
  specialty,
  onDoctorSelect,
  maxDistance = 25,
}: LocationBasedDoctorFinderProps) {
  const { t } = useI18n();
  const [userLocation, setUserLocation] = useState<GeolocationResult | null>(null);
  const [recommendations, setRecommendations] = useState<LocationBasedRecommendation[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [searchRadius, setSearchRadius] = useState(maxDistance);
  const [specialtyFilter, setSpecialtyFilter] = useState(specialty || '');

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (userLocation) {
      findNearbyDoctors();
    }
  }, [userLocation, searchRadius, specialtyFilter]);

  const checkLocationPermission = async () => {
    try {
      const status = await geolocationService.checkPermissionStatus();
      if (status.granted) {
        setPermissionStatus('granted');
        getCurrentLocation();
      } else if (status.denied) {
        setPermissionStatus('denied');
        setLocationError('Location access denied. Please enable location services.');
      } else {
        setPermissionStatus('unknown');
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      setLocationError('Failed to check location permission');
    }
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      const location = await geolocationService.getCurrentLocation();
      
      // Check if user is in Bangladesh
      if (!geolocationService.isInBangladesh(location.coordinates)) {
        setLocationError('This service is currently available only in Bangladesh.');
        return;
      }

      setUserLocation(location);
      setPermissionStatus('granted');
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError(error instanceof Error ? error.message : 'Failed to get location');
      setPermissionStatus('denied');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const findNearbyDoctors = async () => {
    if (!userLocation) return;

    setIsLoadingDoctors(true);
    try {
      const nearbyDoctors = await geolocationService.findNearbyDoctors(
        userLocation.coordinates,
        specialtyFilter,
        searchRadius
      );
      setRecommendations(nearbyDoctors);
    } catch (error) {
      console.error('Error finding nearby doctors:', error);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const handleRefreshLocation = () => {
    getCurrentLocation();
  };

  const handleDoctorSelect = (recommendation: LocationBasedRecommendation) => {
    if (onDoctorSelect) {
      onDoctorSelect(recommendation);
    }
  };

  const getTransportIcon = (option: string) => {
    switch (option.toLowerCase()) {
      case 'uber':
      case 'pathao':
      case 'car':
        return <Car className="h-4 w-4" />;
      default:
        return <Navigation className="h-4 w-4" />;
    }
  };

  if (permissionStatus === 'denied') {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {locationError || 'Location access is required to find nearby doctors. Please enable location services and refresh the page.'}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={getCurrentLocation} 
            className="mt-4"
            variant="outline"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Location Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Your Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLocation ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Getting your location...
            </div>
          ) : userLocation ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {userLocation.address || 'Location detected'}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <span>Accuracy: {Math.round(userLocation.accuracy)}m</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshLocation}
                  className="ml-2"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={getCurrentLocation} disabled={isLoadingLocation}>
              <Navigation className="h-4 w-4 mr-2" />
              Get My Location
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Search Filters */}
      {userLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Search Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Specialty</label>
              <Input
                placeholder="e.g., Cardiologist, Neurologist"
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Search Radius: {searchRadius}km</label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Doctor Recommendations */}
      {userLocation && (
        <Card>
          <CardHeader>
            <CardTitle>
              Nearby Doctors
              {isLoadingDoctors && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingDoctors ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Finding nearby doctors...</p>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleDoctorSelect(recommendation)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{recommendation.doctor.name}</h3>
                        <p className="text-sm text-gray-600">{recommendation.doctor.specialty}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{recommendation.doctor.rating}</span>
                        </div>
                      </div>
                      <Badge variant="outline">
                        ৳{recommendation.doctor.consultationFee}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{recommendation.facility.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {recommendation.distance.toFixed(1)}km
                        </Badge>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>~{recommendation.estimatedTravelTime} minutes</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Navigation className="h-4 w-4 mr-2" />
                        <div className="flex flex-wrap gap-1">
                          {recommendation.transportOptions.slice(0, 3).map((option, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {recommendation.facility.emergencyServices && (
                        <Badge variant="destructive" className="text-xs">
                          Emergency Services Available
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button size="sm">
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Doctors Found</h3>
                <p className="text-gray-500 mb-4">
                  No doctors found within {searchRadius}km radius.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchRadius(Math.min(searchRadius + 10, 50))}
                >
                  Expand Search Radius
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
