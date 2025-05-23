import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";
import { connectToDatabase } from "@/lib/db";
import { 
  findNearbyHealthcareFacilities, 
  calculateDistance,
  Coordinates 
} from "@/lib/geolocation/bangladesh-locations";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { 
      latitude, 
      longitude, 
      maxDistance = 25, 
      specialty,
      limit = 20 
    } = await request.json();

    // Validate input
    if (!latitude || !longitude) {
      return NextResponse.json(
        { message: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    const userLocation: Coordinates = { latitude, longitude };

    // Connect to database
    const db = await connectToDatabase();
    const doctorsCollection = db.collection("doctors");
    const facilitiesCollection = db.collection("healthcare_facilities");

    // Find nearby healthcare facilities
    const nearbyFacilities = findNearbyHealthcareFacilities(
      userLocation,
      maxDistance
    );

    if (nearbyFacilities.length === 0) {
      return NextResponse.json({
        doctors: [],
        message: "No healthcare facilities found in the specified radius",
      });
    }

    // Get facility IDs
    const facilityIds = nearbyFacilities.map(f => f.id);

    // Build query for doctors
    const query: any = {
      facilityId: { $in: facilityIds },
      isActive: true,
    };

    if (specialty && specialty !== 'any') {
      query.specialty = { $regex: specialty, $options: 'i' };
    }

    // Find doctors at nearby facilities
    const doctors = await doctorsCollection
      .find(query)
      .limit(limit)
      .toArray();

    // Enhance doctors with location data
    const enhancedDoctors = doctors.map(doctor => {
      const facility = nearbyFacilities.find(f => f.id === doctor.facilityId);
      const distance = facility ? facility.distance : 0;
      
      // Calculate estimated travel time (rough estimate for Dhaka traffic)
      let estimatedTravelTime = 0;
      if (distance <= 5) {
        estimatedTravelTime = Math.round(distance * 8); // 8 minutes per km
      } else if (distance <= 15) {
        estimatedTravelTime = Math.round(distance * 6); // 6 minutes per km
      } else {
        estimatedTravelTime = Math.round(distance * 4); // 4 minutes per km
      }

      // Get transport options
      const transportOptions = [];
      if (distance <= 1) {
        transportOptions.push('Walking');
      }
      if (distance > 1) {
        transportOptions.push('Rickshaw', 'CNG', 'Bus');
      }
      if (distance > 5) {
        transportOptions.push('Uber', 'Pathao');
      }
      if (distance > 10) {
        transportOptions.push('Train');
      }

      return {
        id: doctor._id.toString(),
        name: doctor.name,
        specialty: doctor.specialty,
        qualifications: doctor.qualifications,
        experience: doctor.experience,
        languages: doctor.languages,
        rating: doctor.rating || 4.5,
        reviewCount: doctor.reviewCount || 0,
        consultationFee: doctor.consultationFee,
        bio: doctor.bio,
        image: doctor.image,
        availableForVideo: doctor.availableForVideo || false,
        facility: facility ? {
          id: facility.id,
          name: facility.name,
          nameLocal: facility.nameLocal,
          type: facility.type,
          coordinates: facility.coordinates,
          facilityType: facility.facilityType,
          services: facility.services,
          emergencyServices: facility.emergencyServices,
          ambulanceService: facility.ambulanceService,
          contactNumber: facility.contactNumber,
        } : null,
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal
        estimatedTravelTime,
        transportOptions,
        availableSlots: doctor.availableSlots || [],
      };
    });

    // Sort by distance
    enhancedDoctors.sort((a, b) => a.distance - b.distance);

    return NextResponse.json({
      doctors: enhancedDoctors,
      totalFound: enhancedDoctors.length,
      searchRadius: maxDistance,
      userLocation,
      nearbyFacilities: nearbyFacilities.length,
    });

  } catch (error: any) {
    console.error("Error finding nearby doctors:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const latitude = parseFloat(url.searchParams.get('latitude') || '0');
    const longitude = parseFloat(url.searchParams.get('longitude') || '0');
    const maxDistance = parseInt(url.searchParams.get('maxDistance') || '25');
    const specialty = url.searchParams.get('specialty');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    // Validate input
    if (!latitude || !longitude) {
      return NextResponse.json(
        { message: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    // Use the same logic as POST
    const userLocation: Coordinates = { latitude, longitude };

    // Connect to database
    const db = await connectToDatabase();
    const doctorsCollection = db.collection("doctors");

    // Find nearby healthcare facilities
    const nearbyFacilities = findNearbyHealthcareFacilities(
      userLocation,
      maxDistance
    );

    if (nearbyFacilities.length === 0) {
      return NextResponse.json({
        doctors: [],
        message: "No healthcare facilities found in the specified radius",
      });
    }

    // Get facility IDs
    const facilityIds = nearbyFacilities.map(f => f.id);

    // Build query for doctors
    const query: any = {
      facilityId: { $in: facilityIds },
      isActive: true,
    };

    if (specialty && specialty !== 'any') {
      query.specialty = { $regex: specialty, $options: 'i' };
    }

    // Find doctors at nearby facilities
    const doctors = await doctorsCollection
      .find(query)
      .limit(limit)
      .toArray();

    // Enhance doctors with location data (same logic as POST)
    const enhancedDoctors = doctors.map(doctor => {
      const facility = nearbyFacilities.find(f => f.id === doctor.facilityId);
      const distance = facility ? facility.distance : 0;
      
      let estimatedTravelTime = 0;
      if (distance <= 5) {
        estimatedTravelTime = Math.round(distance * 8);
      } else if (distance <= 15) {
        estimatedTravelTime = Math.round(distance * 6);
      } else {
        estimatedTravelTime = Math.round(distance * 4);
      }

      const transportOptions = [];
      if (distance <= 1) transportOptions.push('Walking');
      if (distance > 1) transportOptions.push('Rickshaw', 'CNG', 'Bus');
      if (distance > 5) transportOptions.push('Uber', 'Pathao');
      if (distance > 10) transportOptions.push('Train');

      return {
        id: doctor._id.toString(),
        name: doctor.name,
        specialty: doctor.specialty,
        qualifications: doctor.qualifications,
        experience: doctor.experience,
        languages: doctor.languages,
        rating: doctor.rating || 4.5,
        reviewCount: doctor.reviewCount || 0,
        consultationFee: doctor.consultationFee,
        bio: doctor.bio,
        image: doctor.image,
        availableForVideo: doctor.availableForVideo || false,
        facility: facility ? {
          id: facility.id,
          name: facility.name,
          nameLocal: facility.nameLocal,
          type: facility.type,
          coordinates: facility.coordinates,
          facilityType: facility.facilityType,
          services: facility.services,
          emergencyServices: facility.emergencyServices,
          ambulanceService: facility.ambulanceService,
          contactNumber: facility.contactNumber,
        } : null,
        distance: Math.round(distance * 10) / 10,
        estimatedTravelTime,
        transportOptions,
        availableSlots: doctor.availableSlots || [],
      };
    });

    // Sort by distance
    enhancedDoctors.sort((a, b) => a.distance - b.distance);

    return NextResponse.json({
      doctors: enhancedDoctors,
      totalFound: enhancedDoctors.length,
      searchRadius: maxDistance,
      userLocation,
      nearbyFacilities: nearbyFacilities.length,
    });

  } catch (error: any) {
    console.error("Error finding nearby doctors:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
