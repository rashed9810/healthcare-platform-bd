import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { paymentId, transactionId } = await request.json();

    // Validate input
    if (!paymentId || !transactionId) {
      return NextResponse.json(
        { message: "Payment ID and transaction ID are required" },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectToDatabase();
    const paymentsCollection = db.collection("payments");
    const appointmentsCollection = db.collection("appointments");

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

    // In a real app, you would verify the transaction with the payment gateway
    // For this demo, we'll simulate a successful verification
    const isVerified = true;

    if (!isVerified) {
      return NextResponse.json(
        { message: "Transaction verification failed" },
        { status: 400 }
      );
    }

    // Update payment status
    await paymentsCollection.updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          status: "completed",
          transactionId,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    // Update appointment payment status
    await appointmentsCollection.updateOne(
      { paymentId },
      {
        $set: {
          paymentStatus: "completed",
        },
      }
    );

    // Get updated payment
    const updatedPayment = await paymentsCollection.findOne({
      _id: new ObjectId(paymentId),
    });

    return NextResponse.json({
      id: updatedPayment._id.toString(),
      appointmentId: updatedPayment.appointmentId.toString(),
      amount: updatedPayment.amount,
      currency: updatedPayment.currency,
      method: updatedPayment.method,
      status: updatedPayment.status,
      transactionId: updatedPayment.transactionId,
      createdAt: updatedPayment.createdAt,
      updatedAt: updatedPayment.updatedAt,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
