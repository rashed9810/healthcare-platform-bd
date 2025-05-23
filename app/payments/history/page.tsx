"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Eye, Download } from "lucide-react";
import PaymentStatusBadge from "@/components/payment/payment-status-badge";
import type { PaymentDetails } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/date";

// Mock payment history data (in a real app, this would come from an API)
const mockPayments: PaymentDetails[] = [
  {
    id: "pay_123456789",
    appointmentId: "apt_123456",
    amount: 1500,
    currency: "BDT",
    method: "bkash",
    status: "completed",
    transactionId: "TXN123456",
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-15T10:35:00Z",
  },
  {
    id: "pay_987654321",
    appointmentId: "apt_654321",
    amount: 2000,
    currency: "BDT",
    method: "nagad",
    status: "completed",
    transactionId: "TXN654321",
    createdAt: "2023-06-10T14:20:00Z",
    updatedAt: "2023-06-10T14:25:00Z",
  },
  {
    id: "pay_456789123",
    appointmentId: "apt_789123",
    amount: 1800,
    currency: "BDT",
    method: "card",
    status: "failed",
    createdAt: "2023-06-05T09:15:00Z",
    updatedAt: "2023-06-05T09:20:00Z",
  },
  {
    id: "pay_789123456",
    appointmentId: "apt_456789",
    amount: 1200,
    currency: "BDT",
    method: "cash",
    status: "pending",
    createdAt: "2023-06-01T16:45:00Z",
    updatedAt: "2023-06-01T16:45:00Z",
  },
];

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentDetails[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Fetch payment history from API
    const fetchPayments = async () => {
      try {
        const response = await fetch("/api/payments/history");

        if (!response.ok) {
          throw new Error("Failed to fetch payment history");
        }

        const data = await response.json();
        setPayments(data);
        setFilteredPayments(data);
      } catch (error) {
        console.error("Error fetching payment history:", error);
        // Fallback to mock data if API fails
        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter payments based on search query and active tab
  useEffect(() => {
    let filtered = payments;

    // Filter by status if not "all"
    if (activeTab !== "all") {
      filtered = filtered.filter((payment) => payment.status === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment.id.toLowerCase().includes(query) ||
          payment.appointmentId.toLowerCase().includes(query) ||
          payment.method.toLowerCase().includes(query) ||
          (payment.transactionId &&
            payment.transactionId.toLowerCase().includes(query))
      );
    }

    setFilteredPayments(filtered);
  }, [payments, searchQuery, activeTab]);

  // Handle view payment details
  const handleViewPayment = (paymentId: string) => {
    router.push(`/payments/details?id=${paymentId}`);
  };

  // Handle download receipt
  const handleDownloadReceipt = (paymentId: string) => {
    // In a real app, this would download a PDF receipt
    alert(
      `This feature will download a receipt for payment ${paymentId} in the production version`
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Payment History
      </h1>

      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search payments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {formatDate(new Date(payment.createdAt))}
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.id.substring(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="capitalize">
                        {payment.method}
                      </TableCell>
                      <TableCell>৳{payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewPayment(payment.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {payment.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadReceipt(payment.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
