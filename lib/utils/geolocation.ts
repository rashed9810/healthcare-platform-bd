/**
 * Geolocation Utilities
 * 
 * This file contains utility functions for working with geolocation data,
 * including calculating distances between coordinates, getting user location,
 * and formatting location data.
 */

import { Location } from "@/lib/api/types";

/**
 * Earth radius in kilometers
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Default coordinates for Dhaka, Bangladesh
 */
export const DEFAULT_COORDINATES = {
  latitude: 23.8103,
  longitude: 90.4125
};

/**
 * Interface for coordinates
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);

  const lat1 = toRadians(point1.latitude);
  const lat2 = toRadians(point2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Format distance for display
 * @param distance Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

/**
 * Get the user's current location
 * @returns Promise that resolves to coordinates
 */
export function getUserLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
}

/**
 * Check if geolocation is available in the browser
 * @returns Boolean indicating if geolocation is available
 */
export function isGeolocationAvailable(): boolean {
  return !!navigator.geolocation;
}

/**
 * Filter locations by distance from a reference point
 * @param locations Array of locations with coordinates
 * @param referencePoint Reference coordinates
 * @param maxDistance Maximum distance in kilometers
 * @returns Filtered array of locations
 */
export function filterLocationsByDistance(
  locations: Location[],
  referencePoint: Coordinates,
  maxDistance: number
): Location[] {
  return locations.filter((location) => {
    const distance = calculateDistance(
      referencePoint,
      location.coordinates
    );
    return distance <= maxDistance;
  });
}

/**
 * Sort locations by distance from a reference point
 * @param locations Array of locations with coordinates
 * @param referencePoint Reference coordinates
 * @returns Sorted array of locations with distances
 */
export function sortLocationsByDistance(
  locations: Location[],
  referencePoint: Coordinates
): (Location & { distance: number })[] {
  return locations
    .map((location) => {
      const distance = calculateDistance(
        referencePoint,
        location.coordinates
      );
      return { ...location, distance };
    })
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Get a static map image URL from OpenStreetMap
 * @param latitude Latitude
 * @param longitude Longitude
 * @param zoom Zoom level (1-18)
 * @param width Image width in pixels
 * @param height Image height in pixels
 * @returns URL for the static map image
 */
export function getStaticMapUrl(
  latitude: number,
  longitude: number,
  zoom: number = 15,
  width: number = 400,
  height: number = 300
): string {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&markers=${latitude},${longitude},red`;
}

/**
 * Get directions URL to a location using OpenStreetMap
 * @param destination Destination coordinates
 * @returns URL for directions
 */
export function getDirectionsUrl(destination: Coordinates): string {
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=;${destination.latitude},${destination.longitude}`;
}

/**
 * Convert a location address to a formatted string
 * @param location Location object
 * @returns Formatted address string
 */
export function formatAddress(location: Location): string {
  return `${location.address}, ${location.city}`;
}
