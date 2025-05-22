import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const paymentId = url.searchParams.get("paymentId");
    const transactionId = url.searchParams.get("transactionId");
    const status = url.searchParams.get("status");

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

    // Update payment status based on callback status
    const paymentStatus = status === "success" ? "completed" : "failed";

    // Update payment record
    await paymentsCollection.updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          status: paymentStatus,
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
          paymentStatus,
        },
      }
    );

    // Redirect to payment result page
    return NextResponse.redirect(
      `${url.origin}/payments/result?paymentId=${paymentId}&status=${paymentStatus}`
    );
  } catch (error) {
    console.error("Error processing payment callback:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { paymentId, transactionId, status } = body;

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

    // Update payment status based on callback status
    const paymentStatus = status === "success" ? "completed" : "failed";

    // Update payment record
    await paymentsCollection.updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          status: paymentStatus,
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
          paymentStatus,
        },
      }
    );

    return NextResponse.json({
      success: true,
      status: paymentStatus,
    });
  } catch (error) {
    console.error("Error processing payment callback:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
