"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Stethoscope, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Shield,
  BarChart3,
  PieChart,
  FileText,
  Bell,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalDoctors: number;
  verifiedDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  status: "active" | "inactive" | "pending";
  joinDate: string;
  lastActive: string;
  appointmentCount?: number;
  revenue?: number;
}

interface DoctorVerification {
  id: string;
  doctorName: string;
  email: string;
  specialty: string;
  qualifications: string[];
  experience: number;
  documents: string[];
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [adminStats] = useState<AdminStats>({
    totalUsers: 15420,
    activeUsers: 12350,
    totalDoctors: 450,
    verifiedDoctors: 380,
    totalAppointments: 8920,
    todayAppointments: 156,
    totalRevenue: 2450000,
    monthlyGrowth: 12.5
  });

  const [users] = useState<UserData[]>([
    {
      id: "1",
      name: "Dr. Ahmed Rahman",
      email: "ahmed.rahman@example.com",
      role: "doctor",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-01-20T10:30:00Z",
      appointmentCount: 45,
      revenue: 67500
    },
    {
      id: "2",
      name: "Fatima Khan",
      email: "fatima.khan@example.com",
      role: "patient",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "2024-01-20T09:15:00Z",
      appointmentCount: 3
    },
    {
      id: "3",
      name: "Dr. Sarah Ahmed",
      email: "sarah.ahmed@example.com",
      role: "doctor",
      status: "pending",
      joinDate: "2024-01-18",
      lastActive: "2024-01-19T16:45:00Z",
      appointmentCount: 0
    }
  ]);

  const [doctorVerifications] = useState<DoctorVerification[]>([
    {
      id: "1",
      doctorName: "Dr. Mohammad Hasan",
      email: "mohammad.hasan@example.com",
      specialty: "Cardiology",
      qualifications: ["MBBS", "MD Cardiology", "FCPS"],
      experience: 8,
      documents: ["medical_license.pdf", "degree_certificate.pdf", "experience_letter.pdf"],
      status: "pending",
      submittedDate: "2024-01-19T14:30:00Z"
    },
    {
      id: "2",
      doctorName: "Dr. Rashida Begum",
      email: "rashida.begum@example.com",
      specialty: "Pediatrics",
      qualifications: ["MBBS", "DCH", "MD Pediatrics"],
      experience: 12,
      documents: ["medical_license.pdf", "degree_certificate.pdf"],
      status: "pending",
      submittedDate: "2024-01-18T11:20:00Z"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "inactive": case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage users, doctors, and platform analytics
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
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{adminStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +{adminStats.monthlyGrowth}% this month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{adminStats.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((adminStats.activeUsers / adminStats.totalUsers) * 100)}% of total
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Doctors</p>
                <p className="text-2xl font-bold text-purple-600">
                  {adminStats.verifiedDoctors}/{adminStats.totalDoctors}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((adminStats.verifiedDoctors / adminStats.totalDoctors) * 100)}% verified
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Stethoscope className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(adminStats.totalRevenue)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +15% from last month
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="users">👥 Users</TabsTrigger>
          <TabsTrigger value="doctors">👨‍⚕️ Doctors</TabsTrigger>
          <TabsTrigger value="verification">✅ Verification</TabsTrigger>
          <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">New doctor registration</p>
                      <p className="text-sm text-gray-600">Dr. Mohammad Hasan - Cardiology</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Doctor verified</p>
                      <p className="text-sm text-gray-600">Dr. Sarah Ahmed - Pediatrics</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Pending verification</p>
                      <p className="text-sm text-gray-600">2 doctors awaiting approval</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {adminStats.todayAppointments}
                  </div>
                  <p className="text-gray-600">appointments scheduled today</p>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-green-600">89</div>
                      <div className="text-gray-500">Completed</div>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-600">45</div>
                      <div className="text-gray-500">Upcoming</div>
                    </div>
                    <div>
                      <div className="font-semibold text-red-600">22</div>
                      <div className="text-gray-500">Cancelled</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Doctor Verification Tab */}
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Doctor Verification Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctorVerifications.map((verification) => (
                  <div key={verification.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{verification.doctorName}</h3>
                        <p className="text-gray-600">{verification.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{verification.specialty}</Badge>
                          <Badge className={getStatusColor(verification.status)}>
                            {verification.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Submitted: {formatDate(verification.submittedDate)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Qualifications</h4>
                        <div className="space-y-1">
                          {verification.qualifications.map((qual, index) => (
                            <Badge key={index} variant="outline" className="mr-1">
                              {qual}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Experience</h4>
                        <p className="text-gray-600">{verification.experience} years</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Documents</h4>
                      <div className="flex gap-2">
                        {verification.documents.map((doc, index) => (
                          <Button key={index} variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            {doc}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="outline" className="text-red-600 border-red-600">
                        <UserX className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Review Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Platform Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>User Registrations</span>
                    <span className="font-semibold text-green-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Doctor Onboarding</span>
                    <span className="font-semibold text-blue-600">+8.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Appointment Bookings</span>
                    <span className="font-semibold text-purple-600">+15.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Revenue Growth</span>
                    <span className="font-semibold text-orange-600">+18.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  User Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Patients</span>
                    </div>
                    <span className="font-semibold">14,970 (97.1%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Doctors</span>
                    </div>
                    <span className="font-semibold">450 (2.9%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Active Today</span>
                    </div>
                    <span className="font-semibold">3,245 (21.0%)</span>
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
