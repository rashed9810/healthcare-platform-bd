import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth-middleware"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const appointmentId = params.id

    // Connect to database
    const db = await connectToDatabase()
    const appointmentsCollection = db.collection("appointments")

    // Get appointment
    const appointment = await appointmentsCollection.findOne({
      _id: new ObjectId(appointmentId),
    })

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    // Check if user is authorized to view this appointment
    if (
      appointment.patientId !== authResult.user.id &&
      appointment.doctorId !== authResult.user.id &&
      authResult.user.role !== "admin"
    ) {
      return NextResponse.json({ message: "Unauthorized to view this appointment" }, { status: 403 })
    }

    // Format appointment
    const formattedAppointment = {
      ...appointment,
      id: appointment._id.toString(),
      _id: undefined,
    }

    return NextResponse.json(formattedAppointment)
  } catch (error) {
    console.error("Get appointment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
