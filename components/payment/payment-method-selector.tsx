"use client";

import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PaymentMethod } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import {
  Smartphone,
  CreditCard,
  Wallet,
  CheckCircle,
  Star,
  Shield,
  Zap,
  Clock,
  Gift,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  appointmentType: "video" | "in-person";
  amount?: number;
  className?: string;
}

interface PaymentMethodInfo {
  value: PaymentMethod;
  label: string;
  labelBn: string;
  description: string;
  descriptionBn: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  features: string[];
  featuresBn: string[];
  processingTime: string;
  processingTimeBn: string;
  fee: string;
  feeBn: string;
  popularity: number;
  cashback?: string;
  cashbackBn?: string;
  isRecommended?: boolean;
  isFastest?: boolean;
  isSecure?: boolean;
}

const ENHANCED_PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    value: "bkash",
    label: "bKash",
    labelBn: "বিকাশ",
    description: "Most popular mobile payment in Bangladesh",
    descriptionBn: "বাংলাদেশের সবচেয়ে জনপ্রিয় মোবাইল পেমেন্ট",
    icon: <Smartphone className="h-6 w-6" />,
    color: "from-pink-500 to-red-500",
    gradient: "bg-gradient-to-br from-pink-50 to-red-50",
    features: ["Instant Transfer", "24/7 Available", "Cashback Offers"],
    featuresBn: ["তাৎক্ষণিক স্থানান্তর", "২৪/৭ উপলব্ধ", "ক্যাশব্যাক অফার"],
    processingTime: "Instant",
    processingTimeBn: "তাৎক্ষণিক",
    fee: "Free",
    feeBn: "বিনামূল্যে",
    popularity: 95,
    cashback: "2% Cashback",
    cashbackBn: "২% ক্যাশব্যাক",
    isRecommended: true,
    isFastest: true,
    isSecure: true,
  },
  {
    value: "nagad",
    label: "Nagad",
    labelBn: "নগদ",
    description: "Government-backed digital payment solution",
    descriptionBn: "সরকার সমর্থিত ডিজিটাল পেমেন্ট সমাধান",
    icon: <Smartphone className="h-6 w-6" />,
    color: "from-orange-500 to-yellow-500",
    gradient: "bg-gradient-to-br from-orange-50 to-yellow-50",
    features: ["Government Backed", "High Security", "Wide Acceptance"],
    featuresBn: ["সরকার সমর্থিত", "উচ্চ নিরাপত্তা", "ব্যাপক গ্রহণযোগ্যতা"],
    processingTime: "Instant",
    processingTimeBn: "তাৎক্ষণিক",
    fee: "Free",
    feeBn: "বিনামূল্যে",
    popularity: 85,
    cashback: "1.5% Cashback",
    cashbackBn: "১.৫% ক্যাশব্যাক",
    isSecure: true,
  },
  {
    value: "rocket",
    label: "Rocket",
    labelBn: "রকেট",
    description: "Dutch-Bangla Bank's mobile financial service",
    descriptionBn: "ডাচ-বাংলা ব্যাংকের মোবাইল আর্থিক সেবা",
    icon: <Smartphone className="h-6 w-6" />,
    color: "from-purple-500 to-indigo-500",
    gradient: "bg-gradient-to-br from-purple-50 to-indigo-50",
    features: ["Bank Backed", "Reliable", "Easy to Use"],
    featuresBn: ["ব্যাংক সমর্থিত", "নির্ভরযোগ্য", "ব্যবহার সহজ"],
    processingTime: "Instant",
    processingTimeBn: "তাৎক্ষণিক",
    fee: "Free",
    feeBn: "বিনামূল্যে",
    popularity: 75,
    cashback: "1% Cashback",
    cashbackBn: "১% ক্যাশব্যাক",
    isSecure: true,
  },
  {
    value: "card",
    label: "Credit/Debit Card",
    labelBn: "ক্রেডিট/ডেবিট কার্ড",
    description: "International cards accepted with secure processing",
    descriptionBn: "নিরাপদ প্রক্রিয়াকরণ সহ আন্তর্জাতিক কার্ড গৃহীত",
    icon: <CreditCard className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-500",
    gradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
    features: ["International", "Secure", "EMI Available"],
    featuresBn: ["আন্তর্জাতিক", "নিরাপদ", "ইএমআই উপলব্ধ"],
    processingTime: "2-3 minutes",
    processingTimeBn: "২-৩ মিনিট",
    fee: "2.5% + VAT",
    feeBn: "২.৫% + ভ্যাট",
    popularity: 60,
    isSecure: true,
  },
  {
    value: "cash",
    label: "Cash Payment",
    labelBn: "নগদ অর্থ প্রদান",
    description: "Pay in cash during your visit",
    descriptionBn: "আপনার ভিজিটের সময় নগদ অর্থ প্রদান করুন",
    icon: <Wallet className="h-6 w-6" />,
    color: "from-green-500 to-emerald-500",
    gradient: "bg-gradient-to-br from-green-50 to-emerald-50",
    features: ["No Processing Fee", "Traditional", "Immediate"],
    featuresBn: ["কোন প্রক্রিয়াকরণ ফি নেই", "ঐতিহ্যবাহী", "তাৎক্ষণিক"],
    processingTime: "At visit",
    processingTimeBn: "ভিজিটের সময়",
    fee: "Free",
    feeBn: "বিনামূল্যে",
    popularity: 40,
  },
];

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  appointmentType,
  amount = 0,
  className,
}: PaymentMethodSelectorProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [language, setLanguage] = useState<"en" | "bn">("en");

  const availableMethods = ENHANCED_PAYMENT_METHODS.filter(
    (method) => method.value !== "cash" || appointmentType === "in-person"
  );

  const handleMethodChange = (method: PaymentMethod) => {
    setIsAnimating(true);
    onMethodChange(method);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const calculateSavings = (method: PaymentMethodInfo) => {
    if (!method.cashback || !amount) return 0;
    const percentage = parseFloat(method.cashback.replace(/[^\d.]/g, ""));
    return (amount * percentage) / 100;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {language === "en"
            ? "Choose Your Payment Method"
            : "আপনার পেমেন্ট পদ্ধতি বেছে নিন"}
        </h3>
        <p className="text-gray-600">
          {language === "en"
            ? "Secure, fast, and convenient payment options for your healthcare needs"
            : "আপনার স্বাস্থ্যসেবার প্রয়োজনের জন্য নিরাপদ, দ্রুত এবং সুবিধাজনক পেমেন্ট অপশন"}
        </p>

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
      </div>

      {/* Payment Amount Display */}
      {amount > 0 && (
        <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-blue-900">
                {language === "en" ? "Payment Amount" : "পেমেন্ট পরিমাণ"}
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              ৳{amount.toLocaleString()}
            </div>
            <p className="text-sm text-blue-700 mt-1">
              {language === "en"
                ? "Healthcare consultation fee"
                : "স্বাস্থ্যসেবা পরামর্শ ফি"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods Grid */}
      <RadioGroup
        value={selectedMethod}
        onValueChange={handleMethodChange}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {availableMethods.map((method) => {
          const isSelected = selectedMethod === method.value;
          const savings = calculateSavings(method);

          return (
            <Label
              key={method.value}
              className={cn(
                "relative cursor-pointer group transition-all duration-300 transform hover:scale-105",
                isSelected && "scale-105 z-10"
              )}
            >
              <Card
                className={cn(
                  "border-2 transition-all duration-300 overflow-hidden",
                  isSelected
                    ? "border-blue-500 shadow-xl shadow-blue-200/50 ring-4 ring-blue-100"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-lg",
                  method.gradient
                )}
              >
                <CardContent className="p-0">
                  {/* Header with gradient */}
                  <div
                    className={cn(
                      "p-4 bg-gradient-to-r text-white relative overflow-hidden",
                      method.color
                    )}
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      ></div>
                    </div>

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          {method.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">
                            {language === "en" ? method.label : method.labelBn}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-3 w-3",
                                    i < Math.floor(method.popularity / 20)
                                      ? "text-yellow-300 fill-current"
                                      : "text-white/30"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-white/80">
                              {method.popularity}%{" "}
                              {language === "en" ? "popular" : "জনপ্রিয়"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-col gap-1">
                        {method.isRecommended && (
                          <Badge className="bg-yellow-400 text-yellow-900 text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {language === "en" ? "Recommended" : "প্রস্তাবিত"}
                          </Badge>
                        )}
                        {method.isFastest && (
                          <Badge className="bg-green-400 text-green-900 text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            {language === "en" ? "Fastest" : "দ্রুততম"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-600">
                      {language === "en"
                        ? method.description
                        : method.descriptionBn}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {language === "en" ? "Features" : "বৈশিষ্ট্য"}
                      </h5>
                      <ul className="space-y-1">
                        {(language === "en"
                          ? method.features
                          : method.featuresBn
                        ).map((feature, index) => (
                          <li
                            key={index}
                            className="text-xs text-gray-600 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs font-medium text-gray-700">
                            {language === "en" ? "Processing" : "প্রক্রিয়াকরণ"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {language === "en"
                            ? method.processingTime
                            : method.processingTimeBn}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <TrendingUp className="h-3 w-3 text-gray-400" />
                          <span className="text-xs font-medium text-gray-700">
                            {language === "en" ? "Fee" : "ফি"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {language === "en" ? method.fee : method.feeBn}
                        </p>
                      </div>
                    </div>

                    {/* Cashback */}
                    {method.cashback && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              {language === "en"
                                ? method.cashback
                                : method.cashbackBn}
                            </span>
                          </div>
                          {savings > 0 && (
                            <span className="text-xs text-green-600 font-medium">
                              ৳{savings.toFixed(0)}{" "}
                              {language === "en" ? "saved" : "সাশ্রয়"}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Security Badge */}
                    {method.isSecure && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Shield className="h-3 w-3" />
                        <span>
                          {language === "en"
                            ? "256-bit SSL encrypted & secure"
                            : "২৫৬-বিট এসএসএল এনক্রিপ্টেড এবং নিরাপদ"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  <div
                    className={cn(
                      "absolute top-4 right-4 transition-all duration-300",
                      isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    )}
                  >
                    <div className="bg-white rounded-full p-1">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>

                  {/* Radio Input */}
                  <RadioGroupItem
                    value={method.value}
                    id={method.value}
                    className="sr-only"
                  />
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>

      {/* Security Notice */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 mb-1">
                {language === "en"
                  ? "Your Payment is Secure"
                  : "আপনার পেমেন্ট নিরাপদ"}
              </h4>
              <p className="text-sm text-green-700">
                {language === "en"
                  ? "All transactions are encrypted with bank-level security. Your financial information is never stored on our servers."
                  : "সমস্ত লেনদেন ব্যাংক-স্তরের নিরাপত্তা দিয়ে এনক্রিপ্ট করা হয়। আপনার আর্থিক তথ্য কখনও আমাদের সার্ভারে সংরক্ষিত হয় না।"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Choice Indicator */}
      {selectedMethod && (
        <div
          className={cn(
            "text-center transition-all duration-500",
            isAnimating
              ? "opacity-0 transform scale-95"
              : "opacity-100 transform scale-100"
          )}
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">
              {language === "en"
                ? `${
                    availableMethods.find((m) => m.value === selectedMethod)
                      ?.popularity
                  }% of users choose this method`
                : `${
                    availableMethods.find((m) => m.value === selectedMethod)
                      ?.popularity
                  }% ব্যবহারকারী এই পদ্ধতি বেছে নেন`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
