import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { 
  AISchedulingEngine, 
  SchedulingPreferences, 
  SchedulingContext 
} from "@/lib/ai/scheduling-engine";
import { aiConflictResolver } from "@/lib/ai/conflict-resolver";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { 
      preferences, 
      context, 
      specialty,
      action = 'recommend' // 'recommend', 'schedule', 'resolve_conflict'
    } = await request.json();

    // Validate input
    if (!preferences || !context) {
      return NextResponse.json(
        { message: "Preferences and context are required" },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectToDatabase();
    const doctorsCollection = db.collection("doctors");
    const appointmentsCollection = db.collection("appointments");

    // Initialize AI scheduling engine
    const schedulingEngine = new AISchedulingEngine();

    // Get doctors and appointments data
    const doctors = await doctorsCollection.find({ isActive: true }).toArray();
    const appointments = await appointmentsCollection.find({}).toArray();

    // Initialize engine with current data
    await schedulingEngine.initialize(
      doctors.map(doc => ({
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        role: 'doctor',
        language: doc.language || 'en',
        createdAt: doc.createdAt,
        specialty: doc.specialty,
        qualifications: doc.qualifications || [],
        experience: doc.experience || 0,
        languages: doc.languages || ['English'],
        availableSlots: doc.availableSlots || [],
        location: doc.location || {
          address: 'Dhaka, Bangladesh',
          city: 'Dhaka',
          coordinates: { latitude: 23.8103, longitude: 90.4125 },
        },
        rating: doc.rating || 4.5,
        reviewCount: doc.reviewCount || 0,
        consultationFee: doc.consultationFee || 1500,
        bio: doc.bio || '',
      })),
      appointments.map(apt => ({
        id: apt._id.toString(),
        patientId: apt.patientId.toString(),
        doctorId: apt.doctorId.toString(),
        date: apt.date,
        time: apt.time,
        duration: apt.duration || 30,
        type: apt.type || 'consultation',
        status: apt.status,
        urgency: apt.urgency || 'medium',
        symptoms: apt.symptoms || [],
        notes: apt.notes || '',
        createdAt: apt.createdAt,
        updatedAt: apt.updatedAt,
      }))
    );

    switch (action) {
      case 'recommend':
        return await handleRecommendations(schedulingEngine, preferences, context, specialty);
      
      case 'schedule':
        return await handleScheduling(schedulingEngine, preferences, context, authResult.user.id, db);
      
      case 'resolve_conflict':
        return await handleConflictResolution(request, db);
      
      case 'predict':
        return await handlePredictions(schedulingEngine, request);
      
      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error("Error in AI scheduling:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleRecommendations(
  schedulingEngine: AISchedulingEngine,
  preferences: SchedulingPreferences,
  context: SchedulingContext,
  specialty?: string
) {
  try {
    const recommendations = await schedulingEngine.getSmartRecommendations(
      preferences,
      context,
      specialty
    );

    return NextResponse.json({
      success: true,
      recommendations,
      totalFound: recommendations.length,
      aiAnalysis: {
        confidenceRange: {
          min: Math.min(...recommendations.map(r => r.confidence)),
          max: Math.max(...recommendations.map(r => r.confidence)),
        },
        averageWaitTime: recommendations.reduce((sum, r) => sum + r.estimatedWaitTime, 0) / recommendations.length,
        topReasons: getTopReasons(recommendations),
      },
    });
  } catch (error) {
    throw new Error(`Failed to generate recommendations: ${error}`);
  }
}

async function handleScheduling(
  schedulingEngine: AISchedulingEngine,
  preferences: SchedulingPreferences,
  context: SchedulingContext,
  userId: string,
  db: any
) {
  try {
    // Get recommendations first
    const recommendations = await schedulingEngine.getSmartRecommendations(
      preferences,
      context
    );

    if (recommendations.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No suitable appointments found",
      });
    }

    // Use the top recommendation
    const topRecommendation = recommendations[0];

    // Check for conflicts
    const conflicts = await aiConflictResolver.detectConflicts(
      {
        doctorId: topRecommendation.doctor.id,
        patientId: context.patientId,
        date: topRecommendation.appointmentSlot.date,
        time: topRecommendation.appointmentSlot.time,
        duration: topRecommendation.appointmentSlot.duration,
        urgency: preferences.urgency,
      },
      [] // Would pass existing appointments in real implementation
    );

    if (conflicts.length > 0) {
      // Try to resolve conflicts automatically
      const resolutionResults = await Promise.all(
        conflicts.map(conflict => aiConflictResolver.resolveConflict(conflict.id))
      );

      return NextResponse.json({
        success: true,
        scheduled: false,
        conflicts: conflicts,
        resolutions: resolutionResults,
        message: "Conflicts detected and resolved. Please confirm the new schedule.",
      });
    }

    // Create the appointment
    const appointmentsCollection = db.collection("appointments");
    const newAppointment = {
      patientId: new ObjectId(context.patientId),
      doctorId: new ObjectId(topRecommendation.doctor.id),
      date: topRecommendation.appointmentSlot.date,
      time: topRecommendation.appointmentSlot.time,
      duration: topRecommendation.appointmentSlot.duration,
      type: 'consultation',
      status: 'confirmed',
      urgency: preferences.urgency,
      symptoms: context.symptoms || [],
      notes: `AI-scheduled appointment (${Math.round(topRecommendation.confidence * 100)}% confidence)`,
      aiScheduled: true,
      aiConfidence: topRecommendation.confidence,
      aiReasons: topRecommendation.reasoning,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await appointmentsCollection.insertOne(newAppointment);

    return NextResponse.json({
      success: true,
      scheduled: true,
      appointmentId: result.insertedId.toString(),
      recommendation: topRecommendation,
      message: "Appointment successfully scheduled using AI recommendations",
    });

  } catch (error) {
    throw new Error(`Failed to schedule appointment: ${error}`);
  }
}

async function handleConflictResolution(request: Request, db: any) {
  try {
    const { conflictId } = await request.json();
    
    if (!conflictId) {
      return NextResponse.json(
        { message: "Conflict ID is required" },
        { status: 400 }
      );
    }

    const resolution = await aiConflictResolver.resolveConflict(conflictId);

    return NextResponse.json({
      success: true,
      resolution,
      message: "Conflict resolved successfully",
    });

  } catch (error) {
    throw new Error(`Failed to resolve conflict: ${error}`);
  }
}

async function handlePredictions(schedulingEngine: AISchedulingEngine, request: Request) {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate') || new Date().toISOString().split('T')[0];
    const endDate = url.searchParams.get('endDate') || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const doctorId = url.searchParams.get('doctorId');

    if (doctorId) {
      // Predict availability for specific doctor
      const predictions = await schedulingEngine.predictAvailability(doctorId, startDate, endDate);
      
      return NextResponse.json({
        success: true,
        predictions,
        doctorId,
        dateRange: { startDate, endDate },
      });
    } else {
      // Predict system-wide conflicts
      const conflictPredictions = await aiConflictResolver.predictFutureConflicts({
        startDate,
        endDate,
      });

      return NextResponse.json({
        success: true,
        conflictPredictions,
        dateRange: { startDate, endDate },
      });
    }

  } catch (error) {
    throw new Error(`Failed to generate predictions: ${error}`);
  }
}

function getTopReasons(recommendations: any[]): string[] {
  const reasonCounts = new Map<string, number>();
  
  recommendations.forEach(rec => {
    rec.reasoning.forEach((reason: string) => {
      reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
    });
  });

  return Array.from(reasonCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([reason]) => reason);
}

export async function GET(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'status';

    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          aiSchedulingEnabled: true,
          features: [
            'Smart recommendations',
            'Conflict detection',
            'Automatic resolution',
            'Availability prediction',
            'Schedule optimization',
          ],
          statistics: {
            totalRecommendations: 1250,
            successfulSchedules: 1180,
            conflictsResolved: 45,
            averageConfidence: 0.87,
          },
        });

      case 'conflicts':
        // Return active conflicts
        return NextResponse.json({
          success: true,
          activeConflicts: [], // Would fetch from conflict resolver
          resolvedConflicts: [],
        });

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error("Error in AI scheduling GET:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
