"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Zap,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Gift,
  Star,
  Users,
  TrendingUp
} from "lucide-react";
import type { PaymentMethod } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface PaymentDetails {
  amount: number;
  currency: string;
  method: PaymentMethod;
  appointmentId: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
}

interface EnhancedPaymentInterfaceProps {
  paymentDetails: PaymentDetails;
  onPaymentComplete: (result: any) => void;
  onCancel: () => void;
}

export default function EnhancedPaymentInterface({
  paymentDetails,
  onPaymentComplete,
  onCancel
}: EnhancedPaymentInterfaceProps) {
  const [step, setStep] = useState<"details" | "processing" | "success" | "failed">("details");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isMobilePayment = ["bkash", "nagad", "rocket"].includes(paymentDetails.method);
  const isCardPayment = paymentDetails.method === "card";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isMobilePayment) {
      if (!phoneNumber || phoneNumber.length !== 11) {
        newErrors.phoneNumber = language === "en" 
          ? "Please enter a valid 11-digit phone number" 
          : "দয়া করে একটি বৈধ ১১ সংখ্যার ফোন নম্বর দিন";
      }
      if (!pin || pin.length < 4) {
        newErrors.pin = language === "en" 
          ? "Please enter your PIN" 
          : "দয়া করে আপনার পিন দিন";
      }
    }

    if (isCardPayment) {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = language === "en" 
          ? "Please enter a valid card number" 
          : "দয়া করে একটি বৈধ কার্ড নম্বর দিন";
      }
      if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = language === "en" 
          ? "Please enter expiry date (MM/YY)" 
          : "দয়া করে মেয়াদ উত্তীর্ণের তারিখ দিন (MM/YY)";
      }
      if (!cvv || cvv.length < 3) {
        newErrors.cvv = language === "en" 
          ? "Please enter CVV" 
          : "দয়া করে CVV দিন";
      }
      if (!cardholderName) {
        newErrors.cardholderName = language === "en" 
          ? "Please enter cardholder name" 
          : "দয়া করে কার্ডধারীর নাম দিন";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setStep("processing");
    setProgress(0);

    // Simulate payment processing with progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setStep("success");
        onPaymentComplete({
          success: true,
          transactionId: `TXN${Date.now()}`,
          method: paymentDetails.method,
          amount: paymentDetails.amount
        });
      }, 500);
      
    } catch (error) {
      clearInterval(progressInterval);
      setStep("failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const getMethodInfo = () => {
    const methods = {
      bkash: { 
        name: "bKash", 
        nameBn: "বিকাশ", 
        color: "from-pink-500 to-red-500",
        icon: <Smartphone className="h-6 w-6" />
      },
      nagad: { 
        name: "Nagad", 
        nameBn: "নগদ", 
        color: "from-orange-500 to-yellow-500",
        icon: <Smartphone className="h-6 w-6" />
      },
      rocket: { 
        name: "Rocket", 
        nameBn: "রকেট", 
        color: "from-purple-500 to-indigo-500",
        icon: <Smartphone className="h-6 w-6" />
      },
      card: { 
        name: "Card Payment", 
        nameBn: "কার্ড পেমেন্ট", 
        color: "from-blue-500 to-cyan-500",
        icon: <CreditCard className="h-6 w-6" />
      }
    };
    return methods[paymentDetails.method as keyof typeof methods];
  };

  const methodInfo = getMethodInfo();

  if (step === "processing") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className={cn(
              "w-16 h-16 mx-auto rounded-full bg-gradient-to-r flex items-center justify-center",
              methodInfo.color
            )}>
              <div className="animate-pulse text-white">
                {methodInfo.icon}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === "en" ? "Processing Payment" : "পেমেন্ট প্রক্রিয়াকরণ"}
              </h3>
              <p className="text-gray-600">
                {language === "en" 
                  ? `Processing your ${methodInfo.name} payment...`
                  : `আপনার ${methodInfo.nameBn} পেমেন্ট প্রক্রিয়াকরণ করা হচ্ছে...`
                }
              </p>
            </div>

            <div className="space-y-3">
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-gray-500">
                {Math.round(progress)}% {language === "en" ? "complete" : "সম্পূর্ণ"}
              </p>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>{language === "en" ? "• Verifying payment details" : "• পেমেন্ট বিবরণ যাচাই করা হচ্ছে"}</p>
              <p>{language === "en" ? "• Connecting to payment gateway" : "• পেমেন্ট গেটওয়ের সাথে সংযোগ"}</p>
              <p>{language === "en" ? "• Confirming transaction" : "• লেনদেন নিশ্চিত করা হচ্ছে"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "success") {
    return (
      <Card className="max-w-md mx-auto border-green-200">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-green-900 mb-2">
                {language === "en" ? "Payment Successful!" : "পেমেন্ট সফল!"}
              </h3>
              <p className="text-green-700">
                {language === "en" 
                  ? "Your appointment has been confirmed"
                  : "আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে"
                }
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-700">
                  {language === "en" ? "Amount Paid:" : "প্রদত্ত পরিমাণ:"}
                </span>
                <span className="font-bold text-green-900">
                  ৳{paymentDetails.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">
                  {language === "en" ? "Transaction ID:" : "লেনদেন আইডি:"}
                </span>
                <span className="font-mono text-green-900">TXN{Date.now()}</span>
              </div>
            </div>

            <Button 
              onClick={() => onPaymentComplete({ success: true })}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {language === "en" ? "Continue" : "এগিয়ে যান"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card className={cn(
        "border-2 bg-gradient-to-r text-white overflow-hidden",
        methodInfo.color
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                {methodInfo.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {language === "en" ? methodInfo.name : methodInfo.nameBn}
                </h2>
                <p className="text-white/80">
                  {language === "en" ? "Secure Payment Gateway" : "নিরাপদ পেমেন্ট গেটওয়ে"}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-white/80 text-sm">
                {language === "en" ? "Amount to Pay" : "প্রদেয় পরিমাণ"}
              </p>
              <p className="text-2xl font-bold">৳{paymentDetails.amount.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <Button
            variant={language === "en" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage("en")}
            className="text-xs"
          >
            English
          </Button>
          <Button
            variant={language === "bn" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage("bn")}
            className="text-xs"
          >
            বাংলা
          </Button>
        </div>
      </div>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-600" />
            {language === "en" ? "Payment Details" : "পেমেন্ট বিবরণ"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Appointment Summary */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-blue-900">
              {language === "en" ? "Appointment Summary" : "অ্যাপয়েন্টমেন্ট সারসংক্ষেপ"}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">
                  {language === "en" ? "Doctor:" : "ডাক্তার:"}
                </span>
                <p className="font-medium text-blue-900">{paymentDetails.doctorName}</p>
              </div>
              <div>
                <span className="text-blue-700">
                  {language === "en" ? "Date:" : "তারিখ:"}
                </span>
                <p className="font-medium text-blue-900">{paymentDetails.appointmentDate}</p>
              </div>
            </div>
          </div>

          {/* Mobile Payment Form */}
          {isMobilePayment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  {language === "en" 
                    ? `${methodInfo.name} Phone Number` 
                    : `${methodInfo.nameBn} ফোন নম্বর`
                  }
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder={language === "en" ? "01XXXXXXXXX" : "০১XXXXXXXXX"}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                  maxLength={11}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin">
                  {language === "en" ? "PIN" : "পিন"}
                </Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? "text" : "password"}
                    placeholder={language === "en" ? "Enter your PIN" : "আপনার পিন দিন"}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className={errors.pin ? "border-red-500" : ""}
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.pin && (
                  <p className="text-sm text-red-500">{errors.pin}</p>
                )}
              </div>
            </div>
          )}

          {/* Card Payment Form */}
          {isCardPayment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">
                  {language === "en" ? "Card Number" : "কার্ড নম্বর"}
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className={errors.cardNumber ? "border-red-500" : ""}
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-red-500">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">
                    {language === "en" ? "Expiry Date" : "মেয়াদ উত্তীর্ণের তারিখ"}
                  </Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                      }
                      setExpiryDate(value);
                    }}
                    className={errors.expiryDate ? "border-red-500" : ""}
                    maxLength={5}
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-red-500">{errors.expiryDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    className={errors.cvv ? "border-red-500" : ""}
                    maxLength={4}
                  />
                  {errors.cvv && (
                    <p className="text-sm text-red-500">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardholderName">
                  {language === "en" ? "Cardholder Name" : "কার্ডধারীর নাম"}
                </Label>
                <Input
                  id="cardholderName"
                  placeholder={language === "en" ? "John Doe" : "নাম লিখুন"}
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className={errors.cardholderName ? "border-red-500" : ""}
                />
                {errors.cardholderName && (
                  <p className="text-sm text-red-500">{errors.cardholderName}</p>
                )}
              </div>
            </div>
          )}

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              {language === "en" 
                ? "Your payment information is encrypted and secure. We never store your payment details."
                : "আপনার পেমেন্ট তথ্য এনক্রিপ্ট করা এবং নিরাপদ। আমরা কখনও আপনার পেমেন্ট বিবরণ সংরক্ষণ করি না।"
              }
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              {language === "en" ? "Cancel" : "বাতিল"}
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className={cn(
                "flex-1 bg-gradient-to-r text-white",
                methodInfo.color
              )}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === "en" ? "Processing..." : "প্রক্রিয়াকরণ..."}
                </>
              ) : (
                <>
                  {language === "en" ? "Pay Now" : "এখনই পেমেন্ট করুন"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
