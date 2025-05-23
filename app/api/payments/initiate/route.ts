import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { generatePaymentUrl } from "@/lib/api/payment-gateways";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { appointmentId, amount, method, returnUrl } = await request.json();

    // Validate input
    if (!appointmentId || !amount || !method) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectToDatabase();
    const appointmentsCollection = db.collection("appointments");
    const paymentsCollection = db.collection("payments");

    // Check if appointment exists
    const appointment = await appointmentsCollection.findOne({
      _id: new ObjectId(appointmentId),
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    // Generate a unique payment ID
    const paymentId = new ObjectId();

    // Create payment record
    const payment = {
      _id: paymentId,
      appointmentId: new ObjectId(appointmentId),
      patientId: new ObjectId(authResult.user.id),
      amount,
      currency: "BDT",
      method,
      status: method === "cash" ? "completed" : "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Insert payment record
    await paymentsCollection.insertOne(payment);

    // Update appointment with payment info
    await appointmentsCollection.updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          paymentId: paymentId.toString(),
          paymentMethod: method,
          paymentStatus: method === "cash" ? "completed" : "pending",
          fee: amount,
        },
      }
    );

    // For cash payments, return success immediately
    if (method === "cash") {
      return NextResponse.json({
        success: true,
        paymentId: paymentId.toString(),
        status: "completed",
        message: "Cash payment recorded successfully",
      });
    }

    // For other payment methods, generate redirect URL
    let redirectUrl;
    const paymentReference = paymentId.toString();

    try {
      // Generate payment URL using the payment gateway utilities
      redirectUrl = await generatePaymentUrl(
        method,
        paymentReference,
        amount,
        returnUrl
      );

      if (!redirectUrl && method !== "cash") {
        return NextResponse.json(
          { message: "Failed to generate payment URL" },
          { status: 500 }
        );
      }
    } catch (error: any) {
      console.error("Error generating payment URL:", error);
      return NextResponse.json(
        { message: error.message || "Failed to generate payment URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: paymentId.toString(),
      redirectUrl,
      status: "pending",
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
