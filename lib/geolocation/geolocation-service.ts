/**
 * Geolocation Service
 * 
 * Provides comprehensive geolocation services including GPS tracking,
 * address resolution, and location-based doctor matching.
 */

import { Coordinates, BangladeshLocation, HealthcareFacility } from './bangladesh-locations';
import { findNearbyHealthcareFacilities, calculateDistance } from './bangladesh-locations';

export interface LocationPermissionStatus {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
  error?: string;
}

export interface GeolocationResult {
  coordinates: Coordinates;
  accuracy: number;
  timestamp: number;
  address?: string;
  district?: string;
  division?: string;
}

export interface LocationBasedRecommendation {
  doctor: any; // Doctor type from your existing types
  facility: HealthcareFacility;
  distance: number;
  estimatedTravelTime: number; // in minutes
  transportOptions: string[];
}

export class GeolocationService {
  private watchId: number | null = null;
  private lastKnownLocation: GeolocationResult | null = null;
  private locationUpdateCallbacks: ((location: GeolocationResult) => void)[] = [];

  /**
   * Check if geolocation is supported
   */
  static isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Check current permission status
   */
  async checkPermissionStatus(): Promise<LocationPermissionStatus> {
    if (!GeolocationService.isSupported()) {
      return {
        granted: false,
        denied: true,
        prompt: false,
        error: 'Geolocation not supported',
      };
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      return {
        granted: permission.state === 'granted',
        denied: permission.state === 'denied',
        prompt: permission.state === 'prompt',
      };
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      return {
        granted: false,
        denied: false,
        prompt: true,
      };
    }
  }

  /**
   * Request location permission and get current position
   */
  async getCurrentLocation(highAccuracy: boolean = true): Promise<GeolocationResult> {
    return new Promise((resolve, reject) => {
      if (!GeolocationService.isSupported()) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: highAccuracy,
        timeout: 10000,
        maximumAge: 60000, // 1 minute
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const result: GeolocationResult = {
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          // Try to get address information
          try {
            const addressInfo = await this.reverseGeocode(result.coordinates);
            result.address = addressInfo.address;
            result.district = addressInfo.district;
            result.division = addressInfo.division;
          } catch (error) {
            console.warn('Failed to get address information:', error);
          }

          this.lastKnownLocation = result;
          resolve(result);
        },
        (error) => {
          let errorMessage = 'Unknown geolocation error';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }

          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  /**
   * Start watching user's location
   */
  startLocationTracking(callback: (location: GeolocationResult) => void): void {
    if (!GeolocationService.isSupported()) {
      throw new Error('Geolocation not supported');
    }

    this.locationUpdateCallbacks.push(callback);

    if (this.watchId === null) {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000, // 30 seconds
      };

      this.watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const result: GeolocationResult = {
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          // Try to get address information
          try {
            const addressInfo = await this.reverseGeocode(result.coordinates);
            result.address = addressInfo.address;
            result.district = addressInfo.district;
            result.division = addressInfo.division;
          } catch (error) {
            console.warn('Failed to get address information:', error);
          }

          this.lastKnownLocation = result;
          
          // Notify all callbacks
          this.locationUpdateCallbacks.forEach(cb => {
            try {
              cb(result);
            } catch (error) {
              console.error('Error in location update callback:', error);
            }
          });
        },
        (error) => {
          console.error('Location tracking error:', error);
        },
        options
      );
    }
  }

  /**
   * Stop location tracking
   */
  stopLocationTracking(callback?: (location: GeolocationResult) => void): void {
    if (callback) {
      const index = this.locationUpdateCallbacks.indexOf(callback);
      if (index > -1) {
        this.locationUpdateCallbacks.splice(index, 1);
      }
    } else {
      this.locationUpdateCallbacks = [];
    }

    if (this.locationUpdateCallbacks.length === 0 && this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Get last known location
   */
  getLastKnownLocation(): GeolocationResult | null {
    return this.lastKnownLocation;
  }

  /**
   * Reverse geocoding - convert coordinates to address
   */
  private async reverseGeocode(coordinates: Coordinates): Promise<{
    address: string;
    district?: string;
    division?: string;
  }> {
    // In a real implementation, you would use a geocoding service like:
    // - Google Maps Geocoding API
    // - OpenStreetMap Nominatim
    // - MapBox Geocoding API
    
    // For now, we'll use a mock implementation based on Bangladesh location data
    try {
      // Mock reverse geocoding based on proximity to known locations
      const nearbyFacilities = findNearbyHealthcareFacilities(coordinates, 10);
      
      if (nearbyFacilities.length > 0) {
        const nearest = nearbyFacilities[0];
        return {
          address: `Near ${nearest.name}`,
          district: 'Dhaka', // Mock data
          division: 'Dhaka', // Mock data
        };
      }

      // Fallback to coordinate-based address
      return {
        address: `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`,
        district: 'Unknown',
        division: 'Unknown',
      };
    } catch (error) {
      throw new Error('Failed to reverse geocode location');
    }
  }

  /**
   * Find nearby doctors based on location
   */
  async findNearbyDoctors(
    userLocation: Coordinates,
    specialty?: string,
    maxDistance: number = 25
  ): Promise<LocationBasedRecommendation[]> {
    try {
      // Get nearby healthcare facilities
      const nearbyFacilities = findNearbyHealthcareFacilities(userLocation, maxDistance);
      
      // Mock doctor data - in real implementation, fetch from database
      const mockDoctors = [
        {
          id: 'doc_1',
          name: 'Dr. Anika Rahman',
          specialty: 'Cardiologist',
          rating: 4.8,
          consultationFee: 1500,
          facilityId: 'square-hospital',
        },
        {
          id: 'doc_2',
          name: 'Dr. Kamal Hossain',
          specialty: 'Neurologist',
          rating: 4.9,
          consultationFee: 2000,
          facilityId: 'united-hospital',
        },
        {
          id: 'doc_3',
          name: 'Dr. Nusrat Jahan',
          specialty: 'Dermatologist',
          rating: 4.7,
          consultationFee: 1200,
          facilityId: 'apollo-hospital',
        },
      ];

      const recommendations: LocationBasedRecommendation[] = [];

      for (const facility of nearbyFacilities) {
        const doctorsAtFacility = mockDoctors.filter(doc => 
          doc.facilityId === facility.id &&
          (!specialty || doc.specialty.toLowerCase().includes(specialty.toLowerCase()))
        );

        for (const doctor of doctorsAtFacility) {
          const estimatedTravelTime = this.calculateTravelTime(facility.distance);
          const transportOptions = this.getTransportOptions(facility.distance);

          recommendations.push({
            doctor,
            facility,
            distance: facility.distance,
            estimatedTravelTime,
            transportOptions,
          });
        }
      }

      return recommendations.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Error finding nearby doctors:', error);
      return [];
    }
  }

  /**
   * Calculate estimated travel time based on distance
   */
  private calculateTravelTime(distance: number): number {
    // Rough estimates for Dhaka traffic conditions
    if (distance <= 5) {
      return Math.round(distance * 8); // 8 minutes per km for short distances
    } else if (distance <= 15) {
      return Math.round(distance * 6); // 6 minutes per km for medium distances
    } else {
      return Math.round(distance * 4); // 4 minutes per km for longer distances
    }
  }

  /**
   * Get available transport options based on distance
   */
  private getTransportOptions(distance: number): string[] {
    const options = ['Walking'];
    
    if (distance > 1) {
      options.push('Rickshaw', 'CNG', 'Bus');
    }
    
    if (distance > 5) {
      options.push('Uber', 'Pathao');
    }
    
    if (distance > 10) {
      options.push('Train');
    }

    return options;
  }

  /**
   * Get location-based emergency services
   */
  async getEmergencyServices(userLocation: Coordinates): Promise<HealthcareFacility[]> {
    const emergencyFacilities = findNearbyHealthcareFacilities(userLocation, 50)
      .filter(facility => facility.emergencyServices)
      .slice(0, 5); // Top 5 nearest emergency facilities

    return emergencyFacilities;
  }

  /**
   * Check if user is in Bangladesh
   */
  isInBangladesh(coordinates: Coordinates): boolean {
    // Bangladesh approximate boundaries
    const bangladeshBounds = {
      north: 26.6382,
      south: 20.7439,
      east: 92.6727,
      west: 88.0844,
    };

    return (
      coordinates.latitude >= bangladeshBounds.south &&
      coordinates.latitude <= bangladeshBounds.north &&
      coordinates.longitude >= bangladeshBounds.west &&
      coordinates.longitude <= bangladeshBounds.east
    );
  }
}

// Export singleton instance
export const geolocationService = new GeolocationService();
