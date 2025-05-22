import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import crypto from "crypto";

// Mock gateway configurations
const PAYMENT_GATEWAYS = {
  bkash: {
    apiUrl: "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create",
    username: process.env.BKASH_USERNAME || "sandbox_username",
    password: process.env.BKASH_PASSWORD || "sandbox_password",
    appKey: process.env.BKASH_APP_KEY || "sandbox_app_key",
    appSecret: process.env.BKASH_APP_SECRET || "sandbox_app_secret",
  },
  nagad: {
    apiUrl: "https://sandbox.nagad.com.bd/api/dfs/check-out/initialize",
    merchantId: process.env.NAGAD_MERCHANT_ID || "sandbox_merchant_id",
    merchantNumber: process.env.NAGAD_MERCHANT_NUMBER || "01XXXXXXXXX",
    publicKey: process.env.NAGAD_PUBLIC_KEY || "sandbox_public_key",
    privateKey: process.env.NAGAD_PRIVATE_KEY || "sandbox_private_key",
  },
  rocket: {
    apiUrl: "https://sandbox.rocket.com.bd/api/payment/initiate",
    merchantId: process.env.ROCKET_MERCHANT_ID || "sandbox_merchant_id",
    apiKey: process.env.ROCKET_API_KEY || "sandbox_api_key",
  },
  card: {
    apiUrl: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    storeId: process.env.SSL_STORE_ID || "sandbox_store_id",
    storePassword: process.env.SSL_STORE_PASSWORD || "sandbox_store_password",
  },
};

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

    // Mock payment gateway integration
    // In a real app, you would integrate with the actual payment gateway APIs
    switch (method) {
      case "bkash":
        redirectUrl = mockBkashPaymentUrl(paymentReference, amount, returnUrl);
        break;
      case "nagad":
        redirectUrl = mockNagadPaymentUrl(paymentReference, amount, returnUrl);
        break;
      case "rocket":
        redirectUrl = mockRocketPaymentUrl(paymentReference, amount, returnUrl);
        break;
      case "card":
        redirectUrl = mockCardPaymentUrl(paymentReference, amount, returnUrl);
        break;
      default:
        return NextResponse.json(
          { message: "Unsupported payment method" },
          { status: 400 }
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

// Mock payment gateway URL generators
// In a real app, these would make actual API calls to the payment gateways

function mockBkashPaymentUrl(
  paymentReference: string,
  amount: number,
  returnUrl: string
) {
  // In a real implementation, you would make an API call to bKash
  // and get the actual payment URL
  return `https://sandbox.bka.sh/checkout?amount=${amount}&reference=${paymentReference}&redirect=${encodeURIComponent(
    returnUrl
  )}`;
}

function mockNagadPaymentUrl(
  paymentReference: string,
  amount: number,
  returnUrl: string
) {
  // In a real implementation, you would make an API call to Nagad
  // and get the actual payment URL
  return `https://sandbox.nagad.com.bd/checkout?amount=${amount}&reference=${paymentReference}&redirect=${encodeURIComponent(
    returnUrl
  )}`;
}

function mockRocketPaymentUrl(
  paymentReference: string,
  amount: number,
  returnUrl: string
) {
  // In a real implementation, you would make an API call to Rocket
  // and get the actual payment URL
  return `https://sandbox.rocket.com.bd/checkout?amount=${amount}&reference=${paymentReference}&redirect=${encodeURIComponent(
    returnUrl
  )}`;
}

function mockCardPaymentUrl(
  paymentReference: string,
  amount: number,
  returnUrl: string
) {
  // In a real implementation, you would make an API call to SSL Commerz
  // and get the actual payment URL
  return `https://sandbox.sslcommerz.com/checkout?amount=${amount}&reference=${paymentReference}&redirect=${encodeURIComponent(
    returnUrl
  )}`;
}
