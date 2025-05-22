// Payment API client

import { API_ENDPOINTS } from "@/lib/constants";
import { getToken } from "./auth";
import type {
  PaymentMethod,
  PaymentRequest,
  PaymentResponse,
  PaymentDetails,
  PaymentStatus,
} from "./types";

/**
 * Payment Methods
 */
export const PAYMENT_METHODS = {
  BKASH: "bkash",
  NAGAD: "nagad",
  CARD: "card",
};

/**
 * Payment Statuses
 */
export const PAYMENT_STATUSES = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
};

/**
 * Initiates a payment for an appointment
 * @param data Payment request data
 * @returns Payment response with redirect URL
 */
export async function initiatePayment(
  data: PaymentRequest
): Promise<PaymentResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.PAYMENTS.INITIATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to initiate payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
}

/**
 * Initiates a payment for an appointment (New Implementation)
 * @param appointmentId Appointment ID to initiate payment for
 * @param method Payment method to use
 * @returns Payment response with redirect URL
 */
export const initiateNewPayment = async (
  appointmentId: string,
  method: string
) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.PAYMENTS.INITIATE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ appointmentId, method }),
    });

    if (!response.ok) {
      throw new Error("Failed to initiate payment");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Failed to initiate payment");
  }
};

/**
 * Verifies a payment after completion
 * @param paymentId Payment ID to verify
 * @param transactionId Transaction ID from payment provider
 * @returns Payment details
 */
export async function verifyPayment(
  paymentId: string,
  transactionId: string
): Promise<PaymentDetails> {
  try {
    const response = await fetch(API_ENDPOINTS.PAYMENTS.VERIFY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ paymentId, transactionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to verify payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
}

/**
 * Verifies a payment (New Implementation)
 * @param paymentId Payment ID to verify
 * @returns Payment details
 */
export const verifyNewPayment = async (paymentId: string) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.PAYMENTS.VERIFY}/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify payment");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Failed to verify payment");
  }
};

/**
 * Gets payment status
 * @param paymentId Payment ID to check
 * @returns Payment details
 */
export async function getPaymentStatus(
  paymentId: string
): Promise<PaymentDetails> {
  try {
    const response = await fetch(API_ENDPOINTS.PAYMENTS.STATUS(paymentId), {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get payment status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting payment status:", error);
    throw error;
  }
}

/**
 * Cancels a pending payment
 * @param paymentId Payment ID to cancel
 * @returns Success status
 */
export async function cancelPayment(
  paymentId: string
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/payments/${paymentId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to cancel payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error canceling payment:", error);
    throw error;
  }
}
