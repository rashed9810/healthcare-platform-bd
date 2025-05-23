/**
 * Payment Gateway Integration Utilities
 *
 * This file contains utility functions for integrating with various payment gateways
 * specific to Bangladesh, including bKash, Nagad, and Rocket.
 *
 * Note: These are mock implementations for demonstration purposes.
 * In a production environment, you would integrate with the actual payment gateway APIs.
 */

import crypto from "crypto";
import { PaymentMethod } from "./types";

// Gateway configuration interfaces
interface BkashConfig {
  username: string;
  password: string;
  appKey: string;
  appSecret: string;
  apiUrl: string;
}

interface NagadConfig {
  merchantId: string;
  merchantNumber: string;
  publicKey: string;
  privateKey: string;
  apiUrl: string;
}

interface RocketConfig {
  merchantId: string;
  apiKey: string;
  apiUrl: string;
}

interface CardConfig {
  storeId: string;
  storePassword: string;
  apiUrl: string;
}

// Payment gateway configurations
const PAYMENT_GATEWAYS = {
  bkash: {
    apiUrl:
      process.env.BKASH_API_URL ||
      "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create",
    username: process.env.BKASH_USERNAME || "sandbox_username",
    password: process.env.BKASH_PASSWORD || "sandbox_password",
    appKey: process.env.BKASH_APP_KEY || "sandbox_app_key",
    appSecret: process.env.BKASH_APP_SECRET || "sandbox_app_secret",
  } as BkashConfig,

  nagad: {
    apiUrl:
      process.env.NAGAD_API_URL ||
      "https://sandbox.nagad.com.bd/api/dfs/check-out/initialize",
    merchantId: process.env.NAGAD_MERCHANT_ID || "sandbox_merchant_id",
    merchantNumber: process.env.NAGAD_MERCHANT_NUMBER || "01XXXXXXXXX",
    publicKey: process.env.NAGAD_PUBLIC_KEY || "sandbox_public_key",
    privateKey: process.env.NAGAD_PRIVATE_KEY || "sandbox_private_key",
  } as NagadConfig,

  rocket: {
    apiUrl:
      process.env.ROCKET_API_URL ||
      "https://sandbox.rocket.com.bd/api/payment/initiate",
    merchantId: process.env.ROCKET_MERCHANT_ID || "sandbox_merchant_id",
    apiKey: process.env.ROCKET_API_KEY || "sandbox_api_key",
  } as RocketConfig,

  card: {
    apiUrl:
      process.env.SSL_API_URL ||
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    storeId: process.env.SSL_STORE_ID || "sandbox_store_id",
    storePassword: process.env.SSL_STORE_PASSWORD || "sandbox_store_password",
  } as CardConfig,
};

/**
 * Get bKash authentication token
 * @returns Auth token
 */
async function getBkashAuthToken(): Promise<string> {
  const config = PAYMENT_GATEWAYS.bkash;

  try {
    const response = await fetch(
      `${config.apiUrl.replace(
        "/checkout/payment/create",
        "/checkout/token/grant"
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config.username,
          password: config.password,
        },
        body: JSON.stringify({
          app_key: config.appKey,
          app_secret: config.appSecret,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get bKash auth token");
    }

    const data = await response.json();
    return data.id_token;
  } catch (error) {
    console.error("Error getting bKash auth token:", error);
    // Return mock token for development
    return "mock_bkash_token_" + Date.now();
  }
}

/**
 * Generate a payment URL for bKash
 * @param paymentId Payment reference ID
 * @param amount Payment amount
 * @param returnUrl Return URL after payment
 * @returns Payment URL
 */
export async function generateBkashPaymentUrl(
  paymentId: string,
  amount: number,
  returnUrl: string
): Promise<string> {
  try {
    const config = PAYMENT_GATEWAYS.bkash;

    // Get auth token
    const authToken = await getBkashAuthToken();

    // Create payment request
    const paymentRequest = {
      mode: "0011",
      payerReference: paymentId,
      callbackURL: returnUrl,
      amount: amount.toString(),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: `INV-${paymentId}`,
    };

    // In production, make actual API call to bKash
    if (process.env.NODE_ENV === "production") {
      const response = await fetch(config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: authToken,
          "X-APP-Key": config.appKey,
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        throw new Error("Failed to create bKash payment");
      }

      const data = await response.json();
      return data.bkashURL;
    }

    // Mock implementation for development
    const mockPaymentUrl = `https://sandbox.bka.sh/checkout?amount=${amount}&reference=${paymentId}&redirect=${encodeURIComponent(
      returnUrl
    )}`;

    return mockPaymentUrl;
  } catch (error) {
    console.error("Error generating bKash payment URL:", error);
    throw new Error("Failed to generate bKash payment URL");
  }
}

/**
 * Generate Nagad signature
 * @param data Data to sign
 * @param privateKey Private key
 * @returns Signature
 */
function generateNagadSignature(data: string, privateKey: string): string {
  try {
    // In production, use actual RSA signing with the private key
    // For development, return a mock signature
    const timestamp = Date.now();
    const mockSignature = crypto
      .createHash("sha256")
      .update(data + privateKey + timestamp)
      .digest("hex");
    return mockSignature;
  } catch (error) {
    console.error("Error generating Nagad signature:", error);
    return "mock_signature_" + Date.now();
  }
}

/**
 * Generate a payment URL for Nagad
 * @param paymentId Payment reference ID
 * @param amount Payment amount
 * @param returnUrl Return URL after payment
 * @returns Payment URL
 */
export async function generateNagadPaymentUrl(
  paymentId: string,
  amount: number,
  returnUrl: string
): Promise<string> {
  try {
    const config = PAYMENT_GATEWAYS.nagad;

    // Generate timestamp and order ID
    const timestamp = Date.now().toString();
    const orderId = `ORDER-${paymentId}-${timestamp}`;

    // Create payment data
    const paymentData = {
      merchantId: config.merchantId,
      orderId,
      amount: amount.toString(),
      currency: "BDT",
      challenge: crypto.randomBytes(16).toString("hex"),
    };

    // Generate signature
    const dataToSign = JSON.stringify(paymentData);
    const signature = generateNagadSignature(dataToSign, config.privateKey);

    // In production, make actual API call to Nagad
    if (process.env.NODE_ENV === "production") {
      const initializeResponse = await fetch(config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-KM-Api-Version": "v-0.2.0",
          "X-KM-IP-V4": "127.0.0.1",
          "X-KM-Client-Type": "PC_WEB",
        },
        body: JSON.stringify({
          ...paymentData,
          signature,
          callback: returnUrl,
        }),
      });

      if (!initializeResponse.ok) {
        throw new Error("Failed to initialize Nagad payment");
      }

      const initData = await initializeResponse.json();
      return initData.callBackUrl;
    }

    // Mock implementation for development
    const mockPaymentUrl = `https://sandbox.nagad.com.bd/checkout?amount=${amount}&reference=${paymentId}&redirect=${encodeURIComponent(
      returnUrl
    )}`;

    return mockPaymentUrl;
  } catch (error) {
    console.error("Error generating Nagad payment URL:", error);
    throw new Error("Failed to generate Nagad payment URL");
  }
}

/**
 * Generate a payment URL for Rocket
 * @param paymentId Payment reference ID
 * @param amount Payment amount
 * @param returnUrl Return URL after payment
 * @returns Payment URL
 */
export async function generateRocketPaymentUrl(
  paymentId: string,
  amount: number,
  returnUrl: string
): Promise<string> {
  try {
    const config = PAYMENT_GATEWAYS.rocket;

    // In a real implementation, you would:
    // 1. Create a payment using Rocket's API
    // 2. Return the payment URL

    // Mock implementation
    const mockPaymentUrl = `https://sandbox.rocket.com.bd/checkout?amount=${amount}&reference=${paymentId}&redirect=${encodeURIComponent(
      returnUrl
    )}`;

    return mockPaymentUrl;
  } catch (error) {
    console.error("Error generating Rocket payment URL:", error);
    throw new Error("Failed to generate Rocket payment URL");
  }
}

/**
 * Generate a payment URL for card payments (SSL Commerz)
 * @param paymentId Payment reference ID
 * @param amount Payment amount
 * @param returnUrl Return URL after payment
 * @returns Payment URL
 */
export async function generateCardPaymentUrl(
  paymentId: string,
  amount: number,
  returnUrl: string
): Promise<string> {
  try {
    const config = PAYMENT_GATEWAYS.card;

    // In a real implementation, you would:
    // 1. Initialize a payment session with SSL Commerz
    // 2. Return the payment URL

    // Mock implementation
    const mockPaymentUrl = `https://sandbox.sslcommerz.com/checkout?amount=${amount}&reference=${paymentId}&redirect=${encodeURIComponent(
      returnUrl
    )}`;

    return mockPaymentUrl;
  } catch (error) {
    console.error("Error generating card payment URL:", error);
    throw new Error("Failed to generate card payment URL");
  }
}

/**
 * Generate a payment URL based on the selected payment method
 * @param method Payment method
 * @param paymentId Payment reference ID
 * @param amount Payment amount
 * @param returnUrl Return URL after payment
 * @returns Payment URL
 */
export async function generatePaymentUrl(
  method: PaymentMethod,
  paymentId: string,
  amount: number,
  returnUrl: string
): Promise<string> {
  switch (method) {
    case "bkash":
      return generateBkashPaymentUrl(paymentId, amount, returnUrl);
    case "nagad":
      return generateNagadPaymentUrl(paymentId, amount, returnUrl);
    case "rocket":
      return generateRocketPaymentUrl(paymentId, amount, returnUrl);
    case "card":
      return generateCardPaymentUrl(paymentId, amount, returnUrl);
    case "cash":
      // Cash payments don't need a payment URL
      return "";
    default:
      throw new Error(`Unsupported payment method: ${method}`);
  }
}

/**
 * Verify bKash payment
 * @param paymentId Payment reference ID
 * @param transactionId Transaction ID from bKash
 * @returns Payment verification result
 */
async function verifyBkashPayment(
  paymentId: string,
  transactionId: string
): Promise<{ verified: boolean; amount?: number; status?: string }> {
  try {
    const config = PAYMENT_GATEWAYS.bkash;
    const authToken = await getBkashAuthToken();

    if (process.env.NODE_ENV === "production") {
      const response = await fetch(
        `${config.apiUrl.replace(
          "/checkout/payment/create",
          "/checkout/payment/query"
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: authToken,
            "X-APP-Key": config.appKey,
          },
          body: JSON.stringify({
            paymentID: transactionId,
          }),
        }
      );

      if (!response.ok) {
        return { verified: false };
      }

      const data = await response.json();
      return {
        verified: data.transactionStatus === "Completed",
        amount: parseFloat(data.amount),
        status: data.transactionStatus,
      };
    }

    // Mock verification for development
    return {
      verified: true,
      amount: 1500, // Mock amount
      status: "Completed",
    };
  } catch (error) {
    console.error("Error verifying bKash payment:", error);
    return { verified: false };
  }
}

/**
 * Verify Nagad payment
 * @param paymentId Payment reference ID
 * @param transactionId Transaction ID from Nagad
 * @returns Payment verification result
 */
async function verifyNagadPayment(
  paymentId: string,
  transactionId: string
): Promise<{ verified: boolean; amount?: number; status?: string }> {
  try {
    const config = PAYMENT_GATEWAYS.nagad;

    if (process.env.NODE_ENV === "production") {
      // Create verification request
      const verificationData = {
        merchantId: config.merchantId,
        orderId: paymentId,
        paymentRefId: transactionId,
      };

      const signature = generateNagadSignature(
        JSON.stringify(verificationData),
        config.privateKey
      );

      const response = await fetch(
        `${config.apiUrl.replace("/initialize", "/verify")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-KM-Api-Version": "v-0.2.0",
          },
          body: JSON.stringify({
            ...verificationData,
            signature,
          }),
        }
      );

      if (!response.ok) {
        return { verified: false };
      }

      const data = await response.json();
      return {
        verified: data.status === "Success",
        amount: parseFloat(data.amount),
        status: data.status,
      };
    }

    // Mock verification for development
    return {
      verified: true,
      amount: 1500, // Mock amount
      status: "Success",
    };
  } catch (error) {
    console.error("Error verifying Nagad payment:", error);
    return { verified: false };
  }
}

/**
 * Verify a payment with the payment gateway
 * @param method Payment method
 * @param paymentId Payment reference ID
 * @param transactionId Transaction ID from the payment gateway
 * @returns Payment verification result with details
 */
export async function verifyPaymentWithGateway(
  method: PaymentMethod,
  paymentId: string,
  transactionId: string
): Promise<{ verified: boolean; amount?: number; status?: string }> {
  try {
    switch (method) {
      case "bkash":
        return await verifyBkashPayment(paymentId, transactionId);
      case "nagad":
        return await verifyNagadPayment(paymentId, transactionId);
      case "rocket":
        // Mock verification for Rocket (implement similar to above)
        return { verified: true, amount: 1500, status: "Success" };
      case "card":
        // Mock verification for card payments (implement SSL Commerz verification)
        return { verified: true, amount: 1500, status: "Success" };
      case "cash":
        // Cash payments are always verified
        return { verified: true, status: "Completed" };
      default:
        return { verified: false };
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { verified: false };
  }
}
