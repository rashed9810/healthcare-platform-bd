/**
 * Payment Status Tracking System
 * 
 * This module provides real-time payment status tracking and notifications
 * for the HealthConnect payment system.
 */

import { PaymentMethod, PaymentStatus } from './types';
import { verifyPaymentWithGateway } from './payment-gateways';

export interface PaymentStatusUpdate {
  paymentId: string;
  status: PaymentStatus;
  transactionId?: string;
  amount?: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PaymentTracker {
  paymentId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  attempts: number;
  lastChecked: string;
  createdAt: string;
}

// In-memory storage for payment tracking (in production, use Redis or database)
const paymentTrackers = new Map<string, PaymentTracker>();
const statusUpdateCallbacks = new Map<string, ((update: PaymentStatusUpdate) => void)[]>();

/**
 * Start tracking a payment
 * @param paymentId Payment ID to track
 * @param method Payment method
 * @param amount Payment amount
 */
export function startPaymentTracking(
  paymentId: string,
  method: PaymentMethod,
  amount: number
): void {
  const tracker: PaymentTracker = {
    paymentId,
    method,
    amount,
    status: 'pending',
    attempts: 0,
    lastChecked: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  paymentTrackers.set(paymentId, tracker);
  
  // Start periodic status checking for non-cash payments
  if (method !== 'cash') {
    scheduleStatusCheck(paymentId);
  }
}

/**
 * Stop tracking a payment
 * @param paymentId Payment ID to stop tracking
 */
export function stopPaymentTracking(paymentId: string): void {
  paymentTrackers.delete(paymentId);
  statusUpdateCallbacks.delete(paymentId);
}

/**
 * Get payment tracker status
 * @param paymentId Payment ID
 * @returns Payment tracker or null if not found
 */
export function getPaymentTracker(paymentId: string): PaymentTracker | null {
  return paymentTrackers.get(paymentId) || null;
}

/**
 * Subscribe to payment status updates
 * @param paymentId Payment ID
 * @param callback Callback function for status updates
 */
export function subscribeToPaymentUpdates(
  paymentId: string,
  callback: (update: PaymentStatusUpdate) => void
): void {
  if (!statusUpdateCallbacks.has(paymentId)) {
    statusUpdateCallbacks.set(paymentId, []);
  }
  statusUpdateCallbacks.get(paymentId)!.push(callback);
}

/**
 * Unsubscribe from payment status updates
 * @param paymentId Payment ID
 * @param callback Callback function to remove
 */
export function unsubscribeFromPaymentUpdates(
  paymentId: string,
  callback: (update: PaymentStatusUpdate) => void
): void {
  const callbacks = statusUpdateCallbacks.get(paymentId);
  if (callbacks) {
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }
}

/**
 * Manually check payment status
 * @param paymentId Payment ID
 * @param transactionId Transaction ID (optional)
 * @returns Updated payment status
 */
export async function checkPaymentStatus(
  paymentId: string,
  transactionId?: string
): Promise<PaymentStatusUpdate | null> {
  const tracker = paymentTrackers.get(paymentId);
  if (!tracker) {
    return null;
  }

  try {
    // Skip verification for cash payments
    if (tracker.method === 'cash') {
      return {
        paymentId,
        status: 'completed',
        timestamp: new Date().toISOString(),
      };
    }

    // Verify payment with gateway
    const verification = await verifyPaymentWithGateway(
      tracker.method,
      paymentId,
      transactionId || ''
    );

    // Update tracker
    tracker.attempts += 1;
    tracker.lastChecked = new Date().toISOString();

    let newStatus: PaymentStatus = tracker.status;
    if (verification.verified) {
      newStatus = 'completed';
    } else if (tracker.attempts >= 5) {
      // After 5 failed attempts, mark as failed
      newStatus = 'failed';
    }

    tracker.status = newStatus;

    // Create status update
    const statusUpdate: PaymentStatusUpdate = {
      paymentId,
      status: newStatus,
      transactionId,
      amount: verification.amount || tracker.amount,
      timestamp: new Date().toISOString(),
      metadata: {
        attempts: tracker.attempts,
        gatewayStatus: verification.status,
      },
    };

    // Notify subscribers
    notifyStatusUpdate(statusUpdate);

    return statusUpdate;
  } catch (error) {
    console.error('Error checking payment status:', error);
    
    // Update tracker with error
    tracker.attempts += 1;
    tracker.lastChecked = new Date().toISOString();

    return {
      paymentId,
      status: 'failed',
      timestamp: new Date().toISOString(),
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error',
        attempts: tracker.attempts,
      },
    };
  }
}

/**
 * Schedule periodic status check
 * @param paymentId Payment ID
 */
function scheduleStatusCheck(paymentId: string): void {
  const tracker = paymentTrackers.get(paymentId);
  if (!tracker || tracker.status === 'completed' || tracker.status === 'failed') {
    return;
  }

  // Check status every 30 seconds for the first 5 minutes
  // Then every 2 minutes for the next 10 minutes
  // Then every 5 minutes for up to 1 hour
  const now = new Date();
  const createdAt = new Date(tracker.createdAt);
  const minutesElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60);

  let checkInterval: number;
  if (minutesElapsed < 5) {
    checkInterval = 30 * 1000; // 30 seconds
  } else if (minutesElapsed < 15) {
    checkInterval = 2 * 60 * 1000; // 2 minutes
  } else if (minutesElapsed < 60) {
    checkInterval = 5 * 60 * 1000; // 5 minutes
  } else {
    // Stop checking after 1 hour
    tracker.status = 'failed';
    notifyStatusUpdate({
      paymentId,
      status: 'failed',
      timestamp: new Date().toISOString(),
      metadata: { reason: 'Timeout after 1 hour' },
    });
    return;
  }

  setTimeout(async () => {
    await checkPaymentStatus(paymentId);
    scheduleStatusCheck(paymentId); // Schedule next check
  }, checkInterval);
}

/**
 * Notify all subscribers of a status update
 * @param update Status update
 */
function notifyStatusUpdate(update: PaymentStatusUpdate): void {
  const callbacks = statusUpdateCallbacks.get(update.paymentId);
  if (callbacks) {
    callbacks.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in payment status callback:', error);
      }
    });
  }
}

/**
 * Get all active payment trackers
 * @returns Array of active payment trackers
 */
export function getActivePaymentTrackers(): PaymentTracker[] {
  return Array.from(paymentTrackers.values()).filter(
    tracker => tracker.status === 'pending' || tracker.status === 'processing'
  );
}

/**
 * Clean up old payment trackers
 * @param maxAgeHours Maximum age in hours before cleanup
 */
export function cleanupOldTrackers(maxAgeHours: number = 24): void {
  const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
  
  for (const [paymentId, tracker] of paymentTrackers.entries()) {
    const createdAt = new Date(tracker.createdAt);
    if (createdAt < cutoffTime) {
      stopPaymentTracking(paymentId);
    }
  }
}
