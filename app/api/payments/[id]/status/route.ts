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

    // Return payment details
    return NextResponse.json({
      id: payment._id.toString(),
      appointmentId: payment.appointmentId.toString(),
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    });
  } catch (error) {
    console.error("Error getting payment status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
