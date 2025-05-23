"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Smartphone,
  Wallet,
  AlertTriangle,
  Bell,
  Eye,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Users,
  Star,
  Gift,
  Shield,
  Zap,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { PaymentDetails, PaymentStatus, PaymentMethod } from "@/lib/api/types";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentTracker {
  attempts: number;
  lastChecked: string;
  status: PaymentStatus;
}

interface EnhancedPaymentDetails extends PaymentDetails {
  tracker?: PaymentTracker;
  realTimeStatus?: {
    isTracking: boolean;
    lastUpdate: string;
    nextCheckIn: string;
  };
}

interface EnhancedPaymentDashboardProps {
  payments: EnhancedPaymentDetails[];
  onRefresh?: () => void;
  onViewDetails?: (paymentId: string) => void;
  onRetryPayment?: (paymentId: string) => void;
}

export default function EnhancedPaymentDashboard({
  payments,
  onRefresh,
  onViewDetails,
  onRetryPayment,
}: EnhancedPaymentDashboardProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [timeRange, setTimeRange] = useState<string>("30d");

  // Auto-refresh every 30 seconds for pending payments
  useEffect(() => {
    const hasPendingPayments = payments.some(
      (p) => p.status === "pending" || p.status === "processing"
    );

    if (hasPendingPayments) {
      const interval = setInterval(() => {
        if (onRefresh) {
          onRefresh();
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [payments, onRefresh]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "bkash":
      case "nagad":
      case "rocket":
        return <Smartphone className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "cash":
        return <Wallet className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getMethodDisplayName = (method: PaymentMethod) => {
    switch (method) {
      case "bkash":
        return "bKash";
      case "nagad":
        return "Nagad";
      case "rocket":
        return "Rocket";
      case "card":
        return "Card";
      case "cash":
        return "Cash";
      default:
        return method;
    }
  };

  const getTrackingProgress = (tracker?: PaymentTracker) => {
    if (!tracker) return 0;

    // Calculate progress based on attempts (max 5 attempts)
    return Math.min((tracker.attempts / 5) * 100, 100);
  };

  const pendingPayments = payments.filter(
    (p) => p.status === "pending" || p.status === "processing"
  );
  const completedPayments = payments.filter((p) => p.status === "completed");
  const failedPayments = payments.filter((p) => p.status === "failed");

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Payments
                </p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingPayments.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedPayments.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {failedPayments.length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Notifications for pending payments */}
      {pendingPayments.length > 0 && (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertDescription>
            You have {pendingPayments.length} pending payment(s). Status will be
            automatically updated every 30 seconds.
          </AlertDescription>
        </Alert>
      )}

      {/* Payment List */}
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(payment.status)}
                    <div>
                      <p className="font-semibold">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {getMethodIcon(payment.method)}
                        <span>{getMethodDisplayName(payment.method)}</span>
                        {payment.transactionId && (
                          <span>• {payment.transactionId}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(payment.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    {onViewDetails && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(payment.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}

                    {payment.status === "failed" && onRetryPayment && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRetryPayment(payment.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Real-time tracking info */}
              {payment.realTimeStatus?.isTracking && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">
                      Real-time Tracking Active
                    </span>
                    <span className="text-xs text-blue-600">
                      Next check: {payment.realTimeStatus.nextCheckIn}
                    </span>
                  </div>
                  {payment.tracker && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-blue-600">
                        <span>
                          Verification attempts: {payment.tracker.attempts}/5
                        </span>
                        <span>
                          Last checked:{" "}
                          {new Date(
                            payment.tracker.lastChecked
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                      <Progress
                        value={getTrackingProgress(payment.tracker)}
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {payments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Payments Found
            </h3>
            <p className="text-gray-500">You haven't made any payments yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
