import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const paymentId = params.id;

    // Connect to database
    const db = await connectToDatabase();
    const paymentsCollection = db.collection("payments");
    const appointmentsCollection = db.collection("appointments");
    const doctorsCollection = db.collection("doctors");

    // Check if payment exists
    const payment = await paymentsCollection.findOne({
      _id: new ObjectId(paymentId),
    });

    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    // Check if the user is authorized to view this payment
    if (payment.patientId.toString() !== authResult.user.id) {
      return NextResponse.json(
        { message: "You are not authorized to view this payment" },
        { status: 403 }
      );
    }

    // Get associated appointment
    const appointment = await appointmentsCollection.findOne({
      _id: payment.appointmentId,
    });

    // Get doctor information if appointment exists
    let doctor = null;
    if (appointment && appointment.doctorId) {
      doctor = await doctorsCollection.findOne({
        _id: appointment.doctorId,
      });
    }

    // Format payment for response
    const formattedPayment = {
      id: payment._id.toString(),
      appointmentId: payment.appointmentId.toString(),
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };

    // Format appointment for response if it exists
    const formattedAppointment = appointment
      ? {
          id: appointment._id.toString(),
          patientId: appointment.patientId.toString(),
          doctorId: appointment.doctorId.toString(),
          date: appointment.date,
          time: appointment.time,
          type: appointment.type,
          status: appointment.status,
          fee: appointment.fee,
        }
      : null;

    // Format doctor for response if it exists
    const formattedDoctor = doctor
      ? {
          id: doctor._id.toString(),
          name: doctor.name,
          specialty: doctor.specialty,
          qualifications: doctor.qualifications,
          image: doctor.image,
        }
      : null;

    return NextResponse.json({
      payment: formattedPayment,
      appointment: formattedAppointment,
      doctor: formattedDoctor,
    });
  } catch (error) {
    console.error("Error getting payment details:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
