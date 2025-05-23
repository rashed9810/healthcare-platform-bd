import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { verifyPaymentWithGateway } from "@/lib/api/payment-gateways";
import { stopPaymentTracking } from "@/lib/api/payment-status-tracker";
import { sendPaymentNotification } from "@/lib/api/payment-notifications";

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
    const usersCollection = db.collection("users");

    // Check if payment exists and belongs to the authenticated user
    const payment = await paymentsCollection.findOne({
      _id: new ObjectId(paymentId),
      patientId: new ObjectId(authResult.user.id),
    });

    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    // Get user details for notifications
    const user = await usersCollection.findOne({
      _id: new ObjectId(authResult.user.id),
    });

    // Use enhanced payment verification
    const verification = await verifyPaymentWithGateway(
      payment.method,
      paymentId,
      transactionId
    );

    if (!verification.verified) {
      // Send failure notification
      if (user) {
        await sendPaymentNotification(
          {
            type: "payment_failed",
            paymentId,
            appointmentId: payment.appointmentId.toString(),
            patientId: authResult.user.id,
            amount: payment.amount,
            method: payment.method,
            status: "failed",
            transactionId,
            timestamp: new Date().toISOString(),
          },
          user.phone || "",
          user.email || ""
        );
      }

      return NextResponse.json(
        { message: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Update payment status with enhanced data
    const updateData = {
      status: "completed",
      transactionId,
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gatewayResponse: {
        amount: verification.amount,
        status: verification.status,
        verifiedAmount: verification.amount,
      },
    };

    await paymentsCollection.updateOne(
      { _id: new ObjectId(paymentId) },
      { $set: updateData }
    );

    // Update appointment status
    await appointmentsCollection.updateOne(
      { _id: new ObjectId(payment.appointmentId) },
      {
        $set: {
          paymentStatus: "completed",
          status: "confirmed",
          confirmedAt: new Date().toISOString(),
        },
      }
    );

    // Stop payment tracking
    stopPaymentTracking(paymentId);

    // Send success notification
    if (user) {
      await sendPaymentNotification(
        {
          type: "payment_completed",
          paymentId,
          appointmentId: payment.appointmentId.toString(),
          patientId: authResult.user.id,
          amount: verification.amount || payment.amount,
          method: payment.method,
          status: "completed",
          transactionId,
          timestamp: new Date().toISOString(),
        },
        user.phone || "",
        user.email || ""
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId,
      transactionId,
      status: "completed",
      amount: verification.amount || payment.amount,
      verificationDetails: {
        gatewayStatus: verification.status,
        verifiedAmount: verification.amount,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
