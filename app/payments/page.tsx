"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import PaymentMethodSelector from "@/components/payment/payment-method-selector";
import EnhancedPaymentInterface from "@/components/payment/enhanced-payment-interface";
import EnhancedPaymentDashboard from "@/components/payment/enhanced-payment-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Plus, 
  Shield,
  Smartphone,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Star,
  Gift,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Calendar
} from "lucide-react";
import type { PaymentMethod } from "@/lib/api/types";

export default function PaymentsPage() {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("bkash");
  const [showPaymentInterface, setShowPaymentInterface] = useState(false);
  const [language, setLanguage] = useState<"en" | "bn">("en");

  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  // Sample payment data for demonstration
  const samplePayments = [
    {
      id: "1",
      amount: 1500,
      currency: "BDT",
      method: "bkash" as PaymentMethod,
      status: "completed" as const,
      transactionId: "TXN123456789",
      createdAt: "2024-01-20T10:30:00Z",
      updatedAt: "2024-01-20T10:32:00Z",
      appointmentId: "apt_001",
      patientName: "রহিম আহমেদ",
      doctorName: "ডা. ফাতিমা খান"
    },
    {
      id: "2", 
      amount: 2000,
      currency: "BDT",
      method: "nagad" as PaymentMethod,
      status: "pending" as const,
      transactionId: "TXN123456790",
      createdAt: "2024-01-20T11:00:00Z",
      updatedAt: "2024-01-20T11:00:00Z",
      appointmentId: "apt_002",
      patientName: "ফাতিমা খাতুন",
      doctorName: "ডা. করিম উদ্দিন"
    }
  ];

  const samplePaymentDetails = {
    amount: 1500,
    currency: "BDT",
    method: selectedMethod,
    appointmentId: "apt_demo",
    patientName: "Demo Patient",
    doctorName: "ডা. রহমান",
    appointmentDate: "January 25, 2024 at 10:30 AM"
  };

  const handlePaymentComplete = (result: any) => {
    console.log("Payment completed:", result);
    setShowPaymentInterface(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {language === "en" ? "Payment Center" : "পেমেন্ট সেন্টার"}
            </h1>
            <p className="text-gray-600 mt-2">
              {language === "en" 
                ? "Secure and convenient payment solutions for your healthcare needs"
                : "আপনার স্বাস্থ্যসেবার প্রয়োজনের জন্য নিরাপদ এবং সুবিধাজনক পেমেন্ট সমাধান"
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
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
            
            <Button onClick={() => setShowPaymentInterface(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "Make Payment" : "পেমেন্ট করুন"}
            </Button>
          </div>
        </div>

        {/* User Role Badge */}
        <div className="mt-4">
          <Badge 
            variant={isDoctor ? "default" : "secondary"}
            className="text-sm px-3 py-1"
          >
            {isDoctor ? (
              <>
                <Shield className="h-4 w-4 mr-2" />
                {language === "en" ? "Doctor Dashboard" : "ডাক্তার ড্যাশবোর্ড"}
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                {language === "en" ? "Patient Payment Portal" : "রোগী পেমেন্ট পোর্টাল"}
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Payment Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-pink-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Smartphone className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {language === "en" ? "Mobile Payments" : "মোবাইল পেমেন্ট"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "en" ? "bKash, Nagad, Rocket" : "বিকাশ, নগদ, রকেট"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {language === "en" ? "Card Payments" : "কার্ড পেমেন্ট"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "en" ? "Visa, Mastercard, AMEX" : "ভিসা, মাস্টারকার্ড, AMEX"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {language === "en" ? "Secure & Safe" : "নিরাপদ ও সুরক্ষিত"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "en" ? "256-bit SSL encryption" : "২৫৬-বিট SSL এনক্রিপশন"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {language === "en" ? "Instant Processing" : "তাৎক্ষণিক প্রক্রিয়াকরণ"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "en" ? "Real-time confirmation" : "রিয়েল-টাইম নিশ্চিতকরণ"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="methods" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="methods">
            💳 {language === "en" ? "Payment Methods" : "পেমেন্ট পদ্ধতি"}
          </TabsTrigger>
          <TabsTrigger value="dashboard">
            📊 {language === "en" ? "Payment History" : "পেমেন্ট ইতিহাস"}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            📈 {language === "en" ? "Analytics" : "বিশ্লেষণ"}
          </TabsTrigger>
        </TabsList>

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {language === "en" ? "Choose Your Payment Method" : "আপনার পেমেন্ট পদ্ধতি বেছে নিন"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
                appointmentType="video"
                amount={1500}
              />
            </CardContent>
          </Card>

          {/* Payment Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                {language === "en" ? "Payment Benefits" : "পেমেন্ট সুবিধা"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h4 className="font-medium">
                    {language === "en" ? "Cashback Rewards" : "ক্যাশব্যাক পুরস্কার"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === "en" 
                      ? "Earn up to 2% cashback on every payment"
                      : "প্রতিটি পেমেন্টে ২% পর্যন্ত ক্যাশব্যাক পান"
                    }
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium">
                    {language === "en" ? "Instant Confirmation" : "তাৎক্ষণিক নিশ্চিতকরণ"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === "en" 
                      ? "Get immediate payment confirmation and appointment booking"
                      : "তাৎক্ষণিক পেমেন্ট নিশ্চিতকরণ এবং অ্যাপয়েন্টমেন্ট বুকিং পান"
                    }
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium">
                    {language === "en" ? "100% Secure" : "১০০% নিরাপদ"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === "en" 
                      ? "Bank-level security with fraud protection"
                      : "জালিয়াতি সুরক্ষা সহ ব্যাংক-স্তরের নিরাপত্তা"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <EnhancedPaymentDashboard
            payments={samplePayments}
            onRefresh={() => console.log("Refreshing payments...")}
            onViewDetails={(id) => console.log("Viewing details for:", id)}
            onRetryPayment={(id) => console.log("Retrying payment:", id)}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {language === "en" ? "Payment Statistics" : "পেমেন্ট পরিসংখ্যান"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {language === "en" ? "Total Payments" : "মোট পেমেন্ট"}
                    </span>
                    <span className="font-bold">৳45,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {language === "en" ? "This Month" : "এই মাসে"}
                    </span>
                    <span className="font-bold text-green-600">৳12,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {language === "en" ? "Success Rate" : "সফলতার হার"}
                    </span>
                    <span className="font-bold text-blue-600">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {language === "en" ? "Average Amount" : "গড় পরিমাণ"}
                    </span>
                    <span className="font-bold">৳1,875</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  {language === "en" ? "Payment Methods Usage" : "পেমেন্ট পদ্ধতির ব্যবহার"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      <span className="text-sm">bKash</span>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Nagad</span>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Card</span>
                    </div>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Rocket</span>
                    </div>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Interface Modal */}
      {showPaymentInterface && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <EnhancedPaymentInterface
                paymentDetails={samplePaymentDetails}
                onPaymentComplete={handlePaymentComplete}
                onCancel={() => setShowPaymentInterface(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
