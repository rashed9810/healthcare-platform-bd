import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    const db = await connectToDatabase();
    const paymentsCollection = db.collection("payments");

    // Get payments for the authenticated user
    const payments = await paymentsCollection
      .find({
        patientId: new ObjectId(authResult.user.id),
      })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .toArray();

    // Format payments for response
    const formattedPayments = payments.map((payment) => ({
      id: payment._id.toString(),
      appointmentId: payment.appointmentId.toString(),
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }));

    return NextResponse.json(formattedPayments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
