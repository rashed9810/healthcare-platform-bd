/**
 * Bangladesh Geolocation Data
 * 
 * Comprehensive location data for Bangladesh including divisions, districts,
 * upazilas, and major healthcare facilities.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BangladeshLocation {
  id: string;
  name: string;
  nameLocal: string; // Bengali name
  type: 'division' | 'district' | 'upazila' | 'hospital' | 'clinic';
  coordinates: Coordinates;
  parentId?: string; // Reference to parent location
  population?: number;
  area?: number; // in square kilometers
  postalCodes?: string[];
}

export interface HealthcareFacility extends BangladeshLocation {
  type: 'hospital' | 'clinic';
  facilityType: 'government' | 'private' | 'specialized';
  services: string[];
  bedCount?: number;
  emergencyServices: boolean;
  ambulanceService: boolean;
  contactNumber?: string;
  website?: string;
}

// Bangladesh Divisions
export const BANGLADESH_DIVISIONS: BangladeshLocation[] = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    nameLocal: 'ঢাকা',
    type: 'division',
    coordinates: { latitude: 23.8103, longitude: 90.4125 },
    population: 36054418,
    area: 20594.0,
  },
  {
    id: 'chittagong',
    name: 'Chittagong',
    nameLocal: 'চট্টগ্রাম',
    type: 'division',
    coordinates: { latitude: 22.3569, longitude: 91.7832 },
    population: 28423019,
    area: 33908.55,
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi',
    nameLocal: 'রাজশাহী',
    type: 'division',
    coordinates: { latitude: 24.3636, longitude: 88.6241 },
    population: 18484858,
    area: 18153.08,
  },
  {
    id: 'khulna',
    name: 'Khulna',
    nameLocal: 'খুলনা',
    type: 'division',
    coordinates: { latitude: 22.8456, longitude: 89.5403 },
    population: 15563000,
    area: 22285.0,
  },
  {
    id: 'barisal',
    name: 'Barisal',
    nameLocal: 'বরিশাল',
    type: 'division',
    coordinates: { latitude: 22.7010, longitude: 90.3535 },
    population: 8325666,
    area: 13644.85,
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    nameLocal: 'সিলেট',
    type: 'division',
    coordinates: { latitude: 24.8949, longitude: 91.8687 },
    population: 9910219,
    area: 12635.22,
  },
  {
    id: 'rangpur',
    name: 'Rangpur',
    nameLocal: 'রংপুর',
    type: 'division',
    coordinates: { latitude: 25.7439, longitude: 89.2752 },
    population: 15665000,
    area: 16184.99,
  },
  {
    id: 'mymensingh',
    name: 'Mymensingh',
    nameLocal: 'ময়মনসিংহ',
    type: 'division',
    coordinates: { latitude: 24.7471, longitude: 90.4203 },
    population: 11370000,
    area: 10584.06,
  },
];

// Major Districts in Dhaka Division
export const DHAKA_DISTRICTS: BangladeshLocation[] = [
  {
    id: 'dhaka-district',
    name: 'Dhaka',
    nameLocal: 'ঢাকা',
    type: 'district',
    coordinates: { latitude: 23.7937, longitude: 90.4066 },
    parentId: 'dhaka',
    population: 12043977,
    area: 1463.60,
    postalCodes: ['1000', '1100', '1200', '1300', '1400'],
  },
  {
    id: 'gazipur',
    name: 'Gazipur',
    nameLocal: 'গাজীপুর',
    type: 'district',
    coordinates: { latitude: 24.0022, longitude: 90.4264 },
    parentId: 'dhaka',
    population: 3403912,
    area: 1741.53,
    postalCodes: ['1700', '1701', '1702'],
  },
  {
    id: 'narayanganj',
    name: 'Narayanganj',
    nameLocal: 'নারায়ণগঞ্জ',
    type: 'district',
    coordinates: { latitude: 23.6238, longitude: 90.4990 },
    parentId: 'dhaka',
    population: 2948217,
    area: 759.57,
    postalCodes: ['1400', '1401', '1402'],
  },
];

// Major Healthcare Facilities in Dhaka
export const DHAKA_HEALTHCARE_FACILITIES: HealthcareFacility[] = [
  {
    id: 'dmch',
    name: 'Dhaka Medical College Hospital',
    nameLocal: 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
    type: 'hospital',
    coordinates: { latitude: 23.7272, longitude: 90.3969 },
    parentId: 'dhaka-district',
    facilityType: 'government',
    services: ['Emergency', 'Surgery', 'Cardiology', 'Neurology', 'Oncology'],
    bedCount: 2300,
    emergencyServices: true,
    ambulanceService: true,
    contactNumber: '+880-2-8626812',
    website: 'https://dmc.gov.bd',
  },
  {
    id: 'square-hospital',
    name: 'Square Hospital',
    nameLocal: 'স্কয়ার হাসপাতাল',
    type: 'hospital',
    coordinates: { latitude: 23.7516, longitude: 90.3740 },
    parentId: 'dhaka-district',
    facilityType: 'private',
    services: ['Emergency', 'Surgery', 'Cardiology', 'Orthopedics', 'Pediatrics'],
    bedCount: 650,
    emergencyServices: true,
    ambulanceService: true,
    contactNumber: '+880-2-8159457',
    website: 'https://squarehospital.com',
  },
  {
    id: 'united-hospital',
    name: 'United Hospital',
    nameLocal: 'ইউনাইটেড হাসপাতাল',
    type: 'hospital',
    coordinates: { latitude: 23.8041, longitude: 90.4152 },
    parentId: 'dhaka-district',
    facilityType: 'private',
    services: ['Emergency', 'ICU', 'Cardiology', 'Neurosurgery', 'Oncology'],
    bedCount: 500,
    emergencyServices: true,
    ambulanceService: true,
    contactNumber: '+880-2-8836000',
    website: 'https://uhlbd.com',
  },
  {
    id: 'apollo-hospital',
    name: 'Apollo Hospitals Dhaka',
    nameLocal: 'অ্যাপোলো হাসপাতাল ঢাকা',
    type: 'hospital',
    coordinates: { latitude: 23.8041, longitude: 90.4152 },
    parentId: 'dhaka-district',
    facilityType: 'private',
    services: ['Emergency', 'Cardiology', 'Neurology', 'Transplant', 'Cancer Care'],
    bedCount: 430,
    emergencyServices: true,
    ambulanceService: true,
    contactNumber: '+880-2-8401661',
    website: 'https://apollodhaka.com',
  },
  {
    id: 'labaid-hospital',
    name: 'Labaid Hospital',
    nameLocal: 'ল্যাবএইড হাসপাতাল',
    type: 'hospital',
    coordinates: { latitude: 23.7806, longitude: 90.4193 },
    parentId: 'dhaka-district',
    facilityType: 'private',
    services: ['Emergency', 'Diagnostics', 'Surgery', 'Cardiology', 'Pediatrics'],
    bedCount: 300,
    emergencyServices: true,
    ambulanceService: true,
    contactNumber: '+880-2-9666710',
    website: 'https://labaidgroup.com',
  },
];

// All locations combined
export const ALL_BANGLADESH_LOCATIONS: BangladeshLocation[] = [
  ...BANGLADESH_DIVISIONS,
  ...DHAKA_DISTRICTS,
  ...DHAKA_HEALTHCARE_FACILITIES,
];

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find nearest healthcare facilities
 * @param userLocation User's coordinates
 * @param maxDistance Maximum distance in kilometers
 * @param facilityType Optional facility type filter
 * @returns Array of nearby facilities with distances
 */
export function findNearbyHealthcareFacilities(
  userLocation: Coordinates,
  maxDistance: number = 50,
  facilityType?: 'government' | 'private' | 'specialized'
): Array<HealthcareFacility & { distance: number }> {
  const facilities = DHAKA_HEALTHCARE_FACILITIES.filter(facility => {
    if (facilityType && facility.facilityType !== facilityType) {
      return false;
    }
    return true;
  });

  return facilities
    .map(facility => ({
      ...facility,
      distance: calculateDistance(userLocation, facility.coordinates),
    }))
    .filter(facility => facility.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Get location by postal code
 * @param postalCode Postal code to search
 * @returns Location if found
 */
export function getLocationByPostalCode(postalCode: string): BangladeshLocation | null {
  return ALL_BANGLADESH_LOCATIONS.find(location => 
    location.postalCodes?.includes(postalCode)
  ) || null;
}

/**
 * Search locations by name (supports both English and Bengali)
 * @param query Search query
 * @returns Array of matching locations
 */
export function searchLocations(query: string): BangladeshLocation[] {
  const searchTerm = query.toLowerCase();
  
  return ALL_BANGLADESH_LOCATIONS.filter(location =>
    location.name.toLowerCase().includes(searchTerm) ||
    location.nameLocal.includes(query)
  );
}

/**
 * Get administrative hierarchy for a location
 * @param locationId Location ID
 * @returns Array of parent locations from division to specific location
 */
export function getLocationHierarchy(locationId: string): BangladeshLocation[] {
  const hierarchy: BangladeshLocation[] = [];
  let currentLocation = ALL_BANGLADESH_LOCATIONS.find(loc => loc.id === locationId);
  
  while (currentLocation) {
    hierarchy.unshift(currentLocation);
    
    if (currentLocation.parentId) {
      currentLocation = ALL_BANGLADESH_LOCATIONS.find(loc => loc.id === currentLocation!.parentId);
    } else {
      break;
    }
  }
  
  return hierarchy;
}
