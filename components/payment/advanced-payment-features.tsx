"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreditCard, 
  Shield, 
  RefreshCw, 
  TrendingUp, 
  DollarSign,
  Calendar,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  PieChart,
  Receipt,
  Banknote,
  Wallet,
  Building,
  Gift,
  Target,
  Star,
  Crown,
  Zap
} from "lucide-react";

interface PaymentPlan {
  id: string;
  name: string;
  type: "basic" | "premium" | "family" | "corporate";
  price: number;
  currency: string;
  billing: "monthly" | "yearly";
  features: string[];
  isPopular: boolean;
  discount?: number;
}

interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
  coverage: number;
  network: string[];
  status: "active" | "pending" | "expired";
}

interface PaymentAnalytics {
  totalRevenue: number;
  monthlyGrowth: number;
  totalTransactions: number;
  averageTransaction: number;
  refundRate: number;
  popularPaymentMethod: string;
}

interface RefundRequest {
  id: string;
  transactionId: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  patientName: string;
  doctorName: string;
}

export default function AdvancedPaymentFeatures() {
  const [selectedTab, setSelectedTab] = useState("subscriptions");
  
  const [paymentPlans] = useState<PaymentPlan[]>([
    {
      id: "basic",
      name: "Basic Health",
      type: "basic",
      price: 500,
      currency: "BDT",
      billing: "monthly",
      features: [
        "5 Doctor Consultations",
        "Basic Health Tracking",
        "Appointment Booking",
        "Prescription Management"
      ],
      isPopular: false
    },
    {
      id: "premium",
      name: "Premium Care",
      type: "premium",
      price: 1200,
      currency: "BDT",
      billing: "monthly",
      features: [
        "Unlimited Consultations",
        "Advanced Health Analytics",
        "Priority Booking",
        "24/7 Support",
        "Specialist Access",
        "Health Insurance Coverage"
      ],
      isPopular: true,
      discount: 20
    },
    {
      id: "family",
      name: "Family Plan",
      type: "family",
      price: 2000,
      currency: "BDT",
      billing: "monthly",
      features: [
        "Up to 6 Family Members",
        "All Premium Features",
        "Family Health Dashboard",
        "Emergency Services",
        "Health Education Resources"
      ],
      isPopular: false
    }
  ]);

  const [insuranceProviders] = useState<InsuranceProvider[]>([
    {
      id: "1",
      name: "Pragati Life Insurance",
      logo: "/insurance/pragati.png",
      coverage: 80,
      network: ["Square Hospital", "Apollo Hospital", "United Hospital"],
      status: "active"
    },
    {
      id: "2",
      name: "MetLife Bangladesh",
      logo: "/insurance/metlife.png",
      coverage: 75,
      network: ["Evercare Hospital", "BIRDEM Hospital"],
      status: "active"
    },
    {
      id: "3",
      name: "Green Delta Insurance",
      logo: "/insurance/green-delta.png",
      coverage: 70,
      network: ["Popular Medical Centre", "Ibn Sina Hospital"],
      status: "pending"
    }
  ]);

  const [paymentAnalytics] = useState<PaymentAnalytics>({
    totalRevenue: 2450000,
    monthlyGrowth: 15.7,
    totalTransactions: 8920,
    averageTransaction: 275,
    refundRate: 2.3,
    popularPaymentMethod: "bKash"
  });

  const [refundRequests] = useState<RefundRequest[]>([
    {
      id: "1",
      transactionId: "TXN001234",
      amount: 1500,
      reason: "Doctor cancelled appointment",
      status: "pending",
      requestDate: "2024-01-20T10:30:00Z",
      patientName: "Fatima Khan",
      doctorName: "Dr. Ahmed Rahman"
    },
    {
      id: "2",
      transactionId: "TXN001235",
      amount: 800,
      reason: "Duplicate payment",
      status: "approved",
      requestDate: "2024-01-19T14:20:00Z",
      patientName: "Mohammad Ali",
      doctorName: "Dr. Sarah Ahmed"
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "expired": case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanIcon = (type: string) => {
    switch (type) {
      case "basic": return <Zap className="h-5 w-5 text-blue-600" />;
      case "premium": return <Crown className="h-5 w-5 text-purple-600" />;
      case "family": return <Users className="h-5 w-5 text-green-600" />;
      case "corporate": return <Building className="h-5 w-5 text-orange-600" />;
      default: return <Star className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-7 w-7 text-blue-600" />
            Advanced Payment Features
          </h2>
          <p className="text-gray-600 mt-1">
            Manage subscriptions, insurance, refunds, and payment analytics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Payment Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(paymentAnalytics.totalRevenue)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +{paymentAnalytics.monthlyGrowth}% this month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {paymentAnalytics.totalTransactions.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg: {formatCurrency(paymentAnalytics.averageTransaction)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Refund Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {paymentAnalytics.refundRate}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Low refund rate
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <RefreshCw className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Method</p>
                <p className="text-2xl font-bold text-orange-600">
                  {paymentAnalytics.popularPaymentMethod}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Most used payment
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Wallet className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subscriptions">💳 Subscriptions</TabsTrigger>
          <TabsTrigger value="insurance">🏥 Insurance</TabsTrigger>
          <TabsTrigger value="refunds">↩️ Refunds</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
        </TabsList>

        {/* Subscription Plans Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-2 border-purple-500 shadow-lg' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    {getPlanIcon(plan.type)}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(plan.price)}
                    <span className="text-sm font-normal text-gray-600">/{plan.billing}</span>
                  </div>
                  {plan.discount && (
                    <Badge variant="outline" className="bg-green-50 text-green-600">
                      {plan.discount}% OFF
                    </Badge>
                  )}
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className={`w-full ${plan.isPopular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}>
                    {plan.isPopular ? 'Get Premium' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insurance Integration Tab */}
        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Insurance Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insuranceProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{provider.name}</h3>
                        <p className="text-sm text-gray-600">
                          {provider.coverage}% coverage • {provider.network.length} hospitals
                        </p>
                        <div className="flex gap-1 mt-1">
                          {provider.network.slice(0, 2).map((hospital, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {hospital}
                            </Badge>
                          ))}
                          {provider.network.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{provider.network.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(provider.status)}>
                        {provider.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refund Management Tab */}
        <TabsContent value="refunds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Refund Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {refundRequests.map((refund) => (
                  <div key={refund.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Transaction {refund.transactionId}</h3>
                        <p className="text-sm text-gray-600">
                          {refund.patientName} → {refund.doctorName}
                        </p>
                      </div>
                      <Badge className={getStatusColor(refund.status)}>
                        {refund.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Amount</p>
                        <p className="text-lg font-bold text-red-600">
                          {formatCurrency(refund.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Reason</p>
                        <p className="text-sm">{refund.reason}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Request Date</p>
                        <p className="text-sm">
                          {new Date(refund.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {refund.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>This Month</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(450000)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Month</span>
                    <span className="font-semibold">
                      {formatCurrency(389000)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Growth Rate</span>
                    <span className="font-semibold text-green-600">+15.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>bKash</span>
                    </div>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Nagad</span>
                    </div>
                    <span className="font-semibold">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Credit Card</span>
                    </div>
                    <span className="font-semibold">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
