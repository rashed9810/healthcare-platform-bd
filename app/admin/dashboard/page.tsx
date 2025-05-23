"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  UserPlus,
  CalendarCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Bell,
  Shield,
  Zap,
  Globe,
  Smartphone,
  Heart,
  Stethoscope,
  CreditCard,
  FileText,
  Star,
  Award,
  Target,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

export const dynamic = "force-dynamic";

// Enhanced mock data for demonstration
const mockStats = {
  totalUsers: 15420,
  totalDoctors: 342,
  totalPatients: 15078,
  totalAppointments: 8934,
  completedAppointments: 7821,
  pendingAppointments: 1113,
  totalRevenue: 2847392,
  monthlyGrowth: 12.5,
  userGrowth: 8.3,
  appointmentGrowth: 15.7,
  averageRating: 4.8,
  systemUptime: 99.9,
  activeUsers: 1247,
  newRegistrations: 89,
};

const recentActivities = [
  {
    id: 1,
    type: "user_registration",
    message: "New patient registered: রহিম আহমেদ",
    timestamp: "2 minutes ago",
    status: "success",
    icon: <UserPlus className="h-4 w-4" />,
    color: "text-green-600 bg-green-100",
  },
  {
    id: 2,
    type: "appointment_booked",
    message: "Appointment booked with ডা. ফাতিমা খান",
    timestamp: "5 minutes ago",
    status: "info",
    icon: <Calendar className="h-4 w-4" />,
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: 3,
    type: "payment_received",
    message: "Payment received: ৳1,500 via bKash",
    timestamp: "10 minutes ago",
    status: "success",
    icon: <CreditCard className="h-4 w-4" />,
    color: "text-green-600 bg-green-100",
  },
  {
    id: 4,
    type: "doctor_verification",
    message: "Doctor verification pending: ডা. করিম উদ্দিন",
    timestamp: "15 minutes ago",
    status: "warning",
    icon: <Shield className="h-4 w-4" />,
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    id: 5,
    type: "system_alert",
    message: "Server performance optimized - 15% faster response",
    timestamp: "30 minutes ago",
    status: "info",
    icon: <Zap className="h-4 w-4" />,
    color: "text-purple-600 bg-purple-100",
  },
];

const topDoctors = [
  {
    id: 1,
    name: "ডা. ফাতিমা খান",
    specialty: "Cardiology",
    rating: 4.9,
    appointments: 156,
    revenue: 234000,
    avatar: "👩‍⚕️",
  },
  {
    id: 2,
    name: "ডা. করিম উদ্দিন",
    specialty: "Pediatrics",
    rating: 4.8,
    appointments: 142,
    revenue: 213000,
    avatar: "👨‍⚕️",
  },
  {
    id: 3,
    name: "ডা. রহমান সাহেব",
    specialty: "Neurology",
    rating: 4.7,
    appointments: 128,
    revenue: 192000,
    avatar: "👨‍⚕️",
  },
];

export default function AdminDashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState<"en" | "bn">("en");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (growth < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <Heart className="h-6 w-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Loading Dashboard
            </h3>
            <p className="text-gray-600">
              Preparing your healthcare analytics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {language === "en"
                      ? "Admin Dashboard"
                      : "অ্যাডমিন ড্যাশবোর্ড"}
                  </h1>
                  <p className="text-gray-600">
                    {language === "en"
                      ? "Welcome back! Here's what's happening with HealthConnect today."
                      : "স্বাগতম! আজ হেলথকানেক্টে কী ঘটছে তা এখানে দেখুন।"}
                  </p>
                </div>
              </div>

              {/* Live Status Indicators */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    {language === "en" ? "System Online" : "সিস্টেম অনলাইন"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {mockStats.activeUsers}{" "}
                    {language === "en" ? "active users" : "সক্রিয় ব্যবহারকারী"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    {mockStats.systemUptime}%{" "}
                    {language === "en" ? "uptime" : "আপটাইম"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Language Toggle */}
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <Button
                  variant={language === "en" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                  className="text-xs px-3"
                >
                  English
                </Button>
                <Button
                  variant={language === "bn" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("bn")}
                  className="text-xs px-3"
                >
                  বাংলা
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {language === "en" ? "Export" : "এক্সপোর্ট"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  {language === "en" ? "Refresh" : "রিফ্রেশ"}
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {language === "en" ? "Add User" : "ব্যবহারকারী যোগ করুন"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-700">
                    {language === "en" ? "Total Users" : "মোট ব্যবহারকারী"}
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {mockStats.totalUsers.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(mockStats.userGrowth)}
                    <span
                      className={`text-sm font-medium ${getGrowthColor(
                        mockStats.userGrowth
                      )}`}
                    >
                      +{mockStats.userGrowth}%{" "}
                      {language === "en" ? "this month" : "এই মাসে"}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-blue-200 rounded-xl">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Doctors */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700">
                    {language === "en" ? "Active Doctors" : "সক্রিয় ডাক্তার"}
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {mockStats.totalDoctors.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      {language === "en" ? "All verified" : "সবাই যাচাইকৃত"}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-green-200 rounded-xl">
                  <Stethoscope className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Appointments */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-700">
                    {language === "en"
                      ? "Total Appointments"
                      : "মোট অ্যাপয়েন্টমেন্ট"}
                  </p>
                  <p className="text-3xl font-bold text-purple-900">
                    {mockStats.totalAppointments.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(mockStats.appointmentGrowth)}
                    <span
                      className={`text-sm font-medium ${getGrowthColor(
                        mockStats.appointmentGrowth
                      )}`}
                    >
                      +{mockStats.appointmentGrowth}%{" "}
                      {language === "en" ? "this month" : "এই মাসে"}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-purple-200 rounded-xl">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-700">
                    {language === "en" ? "Total Revenue" : "মোট আয়"}
                  </p>
                  <p className="text-3xl font-bold text-orange-900">
                    ৳{(mockStats.totalRevenue / 1000000).toFixed(1)}M
                  </p>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(mockStats.monthlyGrowth)}
                    <span
                      className={`text-sm font-medium ${getGrowthColor(
                        mockStats.monthlyGrowth
                      )}`}
                    >
                      +{mockStats.monthlyGrowth}%{" "}
                      {language === "en" ? "this month" : "এই মাসে"}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-orange-200 rounded-xl">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-xl p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              📊 {language === "en" ? "Overview" : "সংক্ষিপ্ত বিবরণ"}
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              👥 {language === "en" ? "Users" : "ব্যবহারকারী"}
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              📈 {language === "en" ? "Analytics" : "বিশ্লেষণ"}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              ⚙️ {language === "en" ? "Settings" : "সেটিংস"}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    {language === "en"
                      ? "Recent Activities"
                      : "সাম্প্রতিক কার্যক্রম"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`p-2 rounded-lg ${activity.color}`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.timestamp}
                          </p>
                        </div>
                        <Badge
                          variant={
                            activity.status === "success"
                              ? "default"
                              : activity.status === "warning"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Doctors */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    {language === "en"
                      ? "Top Performing Doctors"
                      : "শীর্ষ পারফরমিং ডাক্তার"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topDoctors.map((doctor, index) => (
                      <div
                        key={doctor.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{doctor.avatar}</div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {doctor.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {doctor.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">
                              {doctor.rating}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {doctor.appointments} appointments
                          </p>
                          <p className="text-xs font-medium text-green-600">
                            ৳{(doctor.revenue / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          #{index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  {language === "en" ? "System Health" : "সিস্টেম স্বাস্থ্য"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {language === "en" ? "Server Uptime" : "সার্ভার আপটাইম"}
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {mockStats.systemUptime}%
                      </span>
                    </div>
                    <Progress value={mockStats.systemUptime} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {language === "en"
                          ? "Database Performance"
                          : "ডেটাবেস পারফরমেন্স"}
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        98.2%
                      </span>
                    </div>
                    <Progress value={98.2} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {language === "en"
                          ? "API Response Time"
                          : "API রেসপন্স টাইম"}
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        145ms
                      </span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>
                  {language === "en"
                    ? "User Management"
                    : "ব্যবহারকারী ব্যবস্থাপনা"}
                </CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Manage doctors, patients, and admin users"
                    : "ডাক্তার, রোগী এবং অ্যাডমিন ব্যবহারকারীদের পরিচালনা করুন"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder={
                        language === "en"
                          ? "Search users..."
                          : "ব্যবহারকারী খুঁজুন..."
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue
                        placeholder={
                          language === "en"
                            ? "Filter by role"
                            : "ভূমিকা অনুযায়ী ফিল্টার"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {language === "en" ? "All Users" : "সব ব্যবহারকারী"}
                      </SelectItem>
                      <SelectItem value="doctor">
                        {language === "en" ? "Doctors" : "ডাক্তার"}
                      </SelectItem>
                      <SelectItem value="patient">
                        {language === "en" ? "Patients" : "রোগী"}
                      </SelectItem>
                      <SelectItem value="admin">
                        {language === "en" ? "Admins" : "অ্যাডমিন"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === "en"
                      ? "User Management Coming Soon"
                      : "ব্যবহারকারী ব্যবস্থাপনা শীঘ্রই আসছে"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "en"
                      ? "Advanced user management features will be available in the next update."
                      : "উন্নত ব্যবহারকারী ব্যবস্থাপনা বৈশিষ্ট্য পরবর্তী আপডেটে উপলব্ধ হবে।"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {language === "en" ? "Revenue Analytics" : "আয় বিশ্লেষণ"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {language === "en"
                        ? "Revenue charts coming soon"
                        : "আয়ের চার্ট শীঘ্রই আসছে"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    {language === "en"
                      ? "User Distribution"
                      : "ব্যবহারকারী বিতরণ"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">
                          {language === "en" ? "Patients" : "রোগী"}
                        </span>
                      </div>
                      <span className="text-sm font-medium">97.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">
                          {language === "en" ? "Doctors" : "ডাক্তার"}
                        </span>
                      </div>
                      <span className="text-sm font-medium">2.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">
                          {language === "en" ? "Admins" : "অ্যাডমিন"}
                        </span>
                      </div>
                      <span className="text-sm font-medium">0.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {language === "en" ? "System Settings" : "সিস্টেম সেটিংস"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === "en"
                      ? "Settings Panel Coming Soon"
                      : "সেটিংস প্যানেল শীঘ্রই আসছে"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "en"
                      ? "Advanced system configuration options will be available in the next update."
                      : "উন্নত সিস্টেম কনফিগারেশন অপশন পরবর্তী আপডেটে উপলব্ধ হবে।"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
