import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth-middleware"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const url = new URL(request.url)
    const status = url.searchParams.get("status")

    // Connect to database
    const db = await connectToDatabase()
    const appointmentsCollection = db.collection("appointments")

    // Build query
    const query: any = { patientId: authResult.user.id }
    if (status) {
      query.status = status
    }

    // Get appointments
    const appointments = await appointmentsCollection.find(query).toArray()

    // Format appointments
    const formattedAppointments = appointments.map((appointment) => ({
      ...appointment,
      id: appointment._id.toString(),
      _id: undefined,
    }))

    return NextResponse.json(formattedAppointments)
  } catch (error) {
    console.error("Get appointments error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { doctorId, date, time, type, symptoms } = await request.json()

    // Validate input
    if (!doctorId || !date || !time || !type) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Connect to database
    const db = await connectToDatabase()
    const appointmentsCollection = db.collection("appointments")
    const doctorsCollection = db.collection("doctors")

    // Check if doctor exists
    const doctor = await doctorsCollection.findOne({ _id: new ObjectId(doctorId) })
    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }

    // Create appointment
    const newAppointment = {
      patientId: authResult.user.id,
      doctorId,
      date,
      time,
      type,
      symptoms: symptoms || "",
      status: "scheduled",
      createdAt: new Date().toISOString(),
    }

    const result = await appointmentsCollection.insertOne(newAppointment)
    const appointmentId = result.insertedId.toString()

    return NextResponse.json({
      ...newAppointment,
      id: appointmentId,
    })
  } catch (error) {
    console.error("Book appointment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
