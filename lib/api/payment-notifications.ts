/**
 * Payment Notification System
 * 
 * This module handles sending notifications for payment events
 * including SMS, email, and in-app notifications.
 */

import { PaymentStatus, PaymentMethod } from './types';

export interface NotificationConfig {
  sms: {
    enabled: boolean;
    provider: 'twilio' | 'local_sms';
    apiKey?: string;
    apiSecret?: string;
  };
  email: {
    enabled: boolean;
    provider: 'sendgrid' | 'smtp';
    apiKey?: string;
    smtpConfig?: {
      host: string;
      port: number;
      username: string;
      password: string;
    };
  };
  push: {
    enabled: boolean;
    provider: 'firebase' | 'onesignal';
    apiKey?: string;
  };
}

export interface PaymentNotification {
  type: 'payment_initiated' | 'payment_completed' | 'payment_failed' | 'payment_refunded';
  paymentId: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  timestamp: string;
}

// Default notification configuration
const defaultConfig: NotificationConfig = {
  sms: {
    enabled: process.env.SMS_NOTIFICATIONS_ENABLED === 'true',
    provider: 'local_sms',
    apiKey: process.env.SMS_API_KEY,
    apiSecret: process.env.SMS_API_SECRET,
  },
  email: {
    enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true',
    provider: 'smtp',
    apiKey: process.env.EMAIL_API_KEY,
    smtpConfig: {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      username: process.env.SMTP_USERNAME || '',
      password: process.env.SMTP_PASSWORD || '',
    },
  },
  push: {
    enabled: process.env.PUSH_NOTIFICATIONS_ENABLED === 'true',
    provider: 'firebase',
    apiKey: process.env.FIREBASE_API_KEY,
  },
};

/**
 * Send payment notification
 * @param notification Payment notification data
 * @param userPhone User's phone number
 * @param userEmail User's email address
 * @param config Notification configuration (optional)
 */
export async function sendPaymentNotification(
  notification: PaymentNotification,
  userPhone: string,
  userEmail: string,
  config: NotificationConfig = defaultConfig
): Promise<void> {
  const promises: Promise<void>[] = [];

  // Send SMS notification
  if (config.sms.enabled && userPhone) {
    promises.push(sendSMSNotification(notification, userPhone, config.sms));
  }

  // Send email notification
  if (config.email.enabled && userEmail) {
    promises.push(sendEmailNotification(notification, userEmail, config.email));
  }

  // Send push notification (if user has enabled it)
  if (config.push.enabled) {
    promises.push(sendPushNotification(notification, notification.patientId, config.push));
  }

  // Execute all notifications concurrently
  await Promise.allSettled(promises);
}

/**
 * Send SMS notification
 * @param notification Payment notification data
 * @param phoneNumber User's phone number
 * @param smsConfig SMS configuration
 */
async function sendSMSNotification(
  notification: PaymentNotification,
  phoneNumber: string,
  smsConfig: NotificationConfig['sms']
): Promise<void> {
  try {
    const message = generateSMSMessage(notification);
    
    if (smsConfig.provider === 'twilio') {
      // Implement Twilio SMS sending
      await sendTwilioSMS(phoneNumber, message, smsConfig);
    } else {
      // Implement local SMS provider
      await sendLocalSMS(phoneNumber, message, smsConfig);
    }
    
    console.log(`SMS notification sent to ${phoneNumber} for payment ${notification.paymentId}`);
  } catch (error) {
    console.error('Error sending SMS notification:', error);
  }
}

/**
 * Send email notification
 * @param notification Payment notification data
 * @param email User's email address
 * @param emailConfig Email configuration
 */
async function sendEmailNotification(
  notification: PaymentNotification,
  email: string,
  emailConfig: NotificationConfig['email']
): Promise<void> {
  try {
    const { subject, html, text } = generateEmailContent(notification);
    
    if (emailConfig.provider === 'sendgrid') {
      // Implement SendGrid email sending
      await sendSendGridEmail(email, subject, html, emailConfig);
    } else {
      // Implement SMTP email sending
      await sendSMTPEmail(email, subject, html, text, emailConfig);
    }
    
    console.log(`Email notification sent to ${email} for payment ${notification.paymentId}`);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

/**
 * Send push notification
 * @param notification Payment notification data
 * @param userId User ID
 * @param pushConfig Push notification configuration
 */
async function sendPushNotification(
  notification: PaymentNotification,
  userId: string,
  pushConfig: NotificationConfig['push']
): Promise<void> {
  try {
    const { title, body } = generatePushContent(notification);
    
    if (pushConfig.provider === 'firebase') {
      // Implement Firebase push notification
      await sendFirebasePush(userId, title, body, pushConfig);
    } else {
      // Implement OneSignal push notification
      await sendOneSignalPush(userId, title, body, pushConfig);
    }
    
    console.log(`Push notification sent to user ${userId} for payment ${notification.paymentId}`);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

/**
 * Generate SMS message content
 * @param notification Payment notification data
 * @returns SMS message
 */
function generateSMSMessage(notification: PaymentNotification): string {
  const amount = `৳${notification.amount}`;
  const method = getPaymentMethodDisplayName(notification.method);
  
  switch (notification.type) {
    case 'payment_initiated':
      return `HealthConnect: Your payment of ${amount} via ${method} has been initiated. Payment ID: ${notification.paymentId}`;
    
    case 'payment_completed':
      return `HealthConnect: Your payment of ${amount} via ${method} has been completed successfully. Transaction ID: ${notification.transactionId}`;
    
    case 'payment_failed':
      return `HealthConnect: Your payment of ${amount} via ${method} has failed. Please try again or contact support.`;
    
    case 'payment_refunded':
      return `HealthConnect: Your payment of ${amount} has been refunded. The amount will be credited to your account within 3-5 business days.`;
    
    default:
      return `HealthConnect: Payment update for ${amount} via ${method}. Status: ${notification.status}`;
  }
}

/**
 * Generate email content
 * @param notification Payment notification data
 * @returns Email subject and content
 */
function generateEmailContent(notification: PaymentNotification): {
  subject: string;
  html: string;
  text: string;
} {
  const amount = `৳${notification.amount}`;
  const method = getPaymentMethodDisplayName(notification.method);
  
  let subject: string;
  let content: string;
  
  switch (notification.type) {
    case 'payment_initiated':
      subject = 'Payment Initiated - HealthConnect';
      content = `Your payment of ${amount} via ${method} has been initiated.`;
      break;
    
    case 'payment_completed':
      subject = 'Payment Successful - HealthConnect';
      content = `Your payment of ${amount} via ${method} has been completed successfully.`;
      break;
    
    case 'payment_failed':
      subject = 'Payment Failed - HealthConnect';
      content = `Your payment of ${amount} via ${method} has failed. Please try again.`;
      break;
    
    case 'payment_refunded':
      subject = 'Payment Refunded - HealthConnect';
      content = `Your payment of ${amount} has been refunded.`;
      break;
    
    default:
      subject = 'Payment Update - HealthConnect';
      content = `Payment update for ${amount} via ${method}.`;
  }
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">HealthConnect</h2>
      <p>${content}</p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Payment Details:</h3>
        <p><strong>Payment ID:</strong> ${notification.paymentId}</p>
        <p><strong>Amount:</strong> ${amount}</p>
        <p><strong>Method:</strong> ${method}</p>
        <p><strong>Status:</strong> ${notification.status}</p>
        ${notification.transactionId ? `<p><strong>Transaction ID:</strong> ${notification.transactionId}</p>` : ''}
        <p><strong>Date:</strong> ${new Date(notification.timestamp).toLocaleString()}</p>
      </div>
      <p>Thank you for using HealthConnect!</p>
    </div>
  `;
  
  const text = `
    HealthConnect
    
    ${content}
    
    Payment Details:
    Payment ID: ${notification.paymentId}
    Amount: ${amount}
    Method: ${method}
    Status: ${notification.status}
    ${notification.transactionId ? `Transaction ID: ${notification.transactionId}` : ''}
    Date: ${new Date(notification.timestamp).toLocaleString()}
    
    Thank you for using HealthConnect!
  `;
  
  return { subject, html, text };
}

/**
 * Generate push notification content
 * @param notification Payment notification data
 * @returns Push notification title and body
 */
function generatePushContent(notification: PaymentNotification): {
  title: string;
  body: string;
} {
  const amount = `৳${notification.amount}`;
  
  switch (notification.type) {
    case 'payment_completed':
      return {
        title: 'Payment Successful',
        body: `Your payment of ${amount} has been completed successfully.`,
      };
    
    case 'payment_failed':
      return {
        title: 'Payment Failed',
        body: `Your payment of ${amount} has failed. Please try again.`,
      };
    
    default:
      return {
        title: 'Payment Update',
        body: `Payment update for ${amount}. Status: ${notification.status}`,
      };
  }
}

/**
 * Get display name for payment method
 * @param method Payment method
 * @returns Display name
 */
function getPaymentMethodDisplayName(method: PaymentMethod): string {
  switch (method) {
    case 'bkash':
      return 'bKash';
    case 'nagad':
      return 'Nagad';
    case 'rocket':
      return 'Rocket';
    case 'card':
      return 'Card';
    case 'cash':
      return 'Cash';
    default:
      return method;
  }
}

// Mock implementations for different providers
async function sendTwilioSMS(phone: string, message: string, config: any): Promise<void> {
  // Mock implementation - replace with actual Twilio API call
  console.log(`[MOCK] Twilio SMS to ${phone}: ${message}`);
}

async function sendLocalSMS(phone: string, message: string, config: any): Promise<void> {
  // Mock implementation - replace with local SMS provider API call
  console.log(`[MOCK] Local SMS to ${phone}: ${message}`);
}

async function sendSendGridEmail(email: string, subject: string, html: string, config: any): Promise<void> {
  // Mock implementation - replace with actual SendGrid API call
  console.log(`[MOCK] SendGrid email to ${email}: ${subject}`);
}

async function sendSMTPEmail(email: string, subject: string, html: string, text: string, config: any): Promise<void> {
  // Mock implementation - replace with actual SMTP sending
  console.log(`[MOCK] SMTP email to ${email}: ${subject}`);
}

async function sendFirebasePush(userId: string, title: string, body: string, config: any): Promise<void> {
  // Mock implementation - replace with actual Firebase push notification
  console.log(`[MOCK] Firebase push to ${userId}: ${title} - ${body}`);
}

async function sendOneSignalPush(userId: string, title: string, body: string, config: any): Promise<void> {
  // Mock implementation - replace with actual OneSignal push notification
  console.log(`[MOCK] OneSignal push to ${userId}: ${title} - ${body}`);
}
