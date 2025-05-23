import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import {
  checkPaymentStatus,
  getPaymentTracker,
} from "@/lib/api/payment-status-tracker";

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

    // Get payment tracker status
    const tracker = getPaymentTracker(paymentId);

    // Check current payment status if pending
    const url = new URL(request.url);
    const transactionId = url.searchParams.get("transactionId");

    let statusUpdate = null;
    if (payment.status === "pending" || payment.status === "processing") {
      statusUpdate = await checkPaymentStatus(
        paymentId,
        transactionId || undefined
      );

      // Update database if status changed
      if (statusUpdate && statusUpdate.status !== payment.status) {
        await paymentsCollection.updateOne(
          { _id: new ObjectId(paymentId) },
          {
            $set: {
              status: statusUpdate.status,
              updatedAt: statusUpdate.timestamp,
              ...(statusUpdate.transactionId && {
                transactionId: statusUpdate.transactionId,
              }),
              ...(statusUpdate.amount && {
                verifiedAmount: statusUpdate.amount,
              }),
            },
          }
        );
      }
    }

    // Return enhanced payment details
    return NextResponse.json({
      id: payment._id.toString(),
      appointmentId: payment.appointmentId.toString(),
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: statusUpdate?.status || payment.status,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      tracker: tracker
        ? {
            attempts: tracker.attempts,
            lastChecked: tracker.lastChecked,
            status: tracker.status,
          }
        : null,
      statusUpdate,
      realTimeStatus: {
        isTracking: !!tracker,
        lastUpdate: statusUpdate?.timestamp || payment.updatedAt,
        nextCheckIn: tracker ? "30 seconds" : "Not tracking",
      },
    });
  } catch (error) {
    console.error("Error getting payment status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
