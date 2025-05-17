import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth-middleware"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const appointmentId = params.id
    const { date, time } = await request.json()

    // Validate input
    if (!date || !time) {
      return NextResponse.json({ message: "Date and time are required" }, { status: 400 })
    }

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

    // Check if user is authorized to reschedule this appointment
    if (
      appointment.patientId !== authResult.user.id &&
      appointment.doctorId !== authResult.user.id &&
      authResult.user.role !== "admin"
    ) {
      return NextResponse.json({ message: "Unauthorized to reschedule this appointment" }, { status: 403 })
    }

    // Check if appointment can be rescheduled
    if (appointment.status !== "scheduled") {
      return NextResponse.json(
        { message: "Cannot reschedule appointment with status: " + appointment.status },
        { status: 400 },
      )
    }

    // Update appointment
    await appointmentsCollection.updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          date,
          time,
          updatedAt: new Date().toISOString(),
        },
      },
    )

    // Get updated appointment
    const updatedAppointment = await appointmentsCollection.findOne({
      _id: new ObjectId(appointmentId),
    })

    // Format appointment
    const formattedAppointment = {
      ...updatedAppointment,
      id: updatedAppointment._id.toString(),
      _id: undefined,
    }

    return NextResponse.json(formattedAppointment)
  } catch (error) {
    console.error("Reschedule appointment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
