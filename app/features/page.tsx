"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  MessageSquare,
  BarChart3,
  Shield,
  CreditCard,
  Users,
  Stethoscope,
  Calendar,
  Activity,
  Heart,
  Brain,
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  Star,
  Award,
  Target,
  Smartphone,
  Globe,
  Lock,
} from "lucide-react";

// Import the new components
import HealthAnalyticsDashboard from "@/components/analytics/health-analytics-dashboard";
import AdminDashboard from "@/components/admin/admin-dashboard";
import MessagingSystem from "@/components/communication/messaging-system";
import AdvancedPaymentFeatures from "@/components/payment/advanced-payment-features";
import HealthReminders from "@/components/notifications/health-reminders";
import EnhancedVideoConsultation from "@/components/video-call/enhanced-video-consultation";
import EnhancedPrescriptionManagement from "@/components/prescriptions/enhanced-prescription-management";
import EnhancedMedicalRecords from "@/components/medical-records/enhanced-medical-records";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "in-progress" | "planned";
  category: "core" | "advanced" | "premium";
  component?: React.ComponentType<any>;
}

export default function FeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const features: FeatureCard[] = [
    // Health Reminders & Notifications
    {
      id: "health-reminders",
      title: "Health Reminders & Notifications",
      description:
        "Medication reminders, appointment alerts, and health check-up notifications with multi-channel delivery",
      icon: <Bell className="h-6 w-6" />,
      status: "completed",
      category: "core",
      component: HealthReminders,
    },

    // Health Analytics Dashboard
    {
      id: "health-analytics",
      title: "Health Analytics Dashboard",
      description:
        "Personal health metrics, trend analysis, predictive insights, and health goal tracking",
      icon: <BarChart3 className="h-6 w-6" />,
      status: "completed",
      category: "core",
      component: HealthAnalyticsDashboard,
    },

    // Admin Features
    {
      id: "admin-dashboard",
      title: "Complete Admin Dashboard",
      description:
        "User management, doctor verification system, platform analytics, and comprehensive admin controls",
      icon: <Shield className="h-6 w-6" />,
      status: "completed",
      category: "advanced",
      component: AdminDashboard,
    },

    // Enhanced Communication
    {
      id: "messaging-system",
      title: "In-app Messaging System",
      description:
        "Real-time doctor-patient chat, file sharing, voice messages, and secure communication",
      icon: <MessageSquare className="h-6 w-6" />,
      status: "completed",
      category: "core",
      component: MessagingSystem,
    },

    // Advanced Payment Features
    {
      id: "advanced-payments",
      title: "Advanced Payment Features",
      description:
        "Insurance integration, subscription plans, refund management, and payment analytics",
      icon: <CreditCard className="h-6 w-6" />,
      status: "completed",
      category: "premium",
      component: AdvancedPaymentFeatures,
    },

    // Video Consultation System
    {
      id: "video-consultation",
      title: "Video Consultation System",
      description:
        "WebRTC video calls, screen sharing, session recording, and real-time chat during consultations",
      icon: <Activity className="h-6 w-6" />,
      status: "completed",
      category: "core",
      component: EnhancedVideoConsultation,
    },

    // Prescription Management
    {
      id: "prescription-management",
      title: "Digital Prescription Management",
      description:
        "Create, verify, and manage digital prescriptions with QR codes and OCR scanning",
      icon: <Stethoscope className="h-6 w-6" />,
      status: "completed",
      category: "core",
      component: EnhancedPrescriptionManagement,
    },

    // Medical Records
    {
      id: "medical-records",
      title: "Medical Records System",
      description:
        "Comprehensive medical history, file management, sharing, and analytics",
      icon: <Brain className="h-6 w-6" />,
      status: "completed",
      category: "core",
      component: EnhancedMedicalRecords,
    },

    // Patient Community & Support Groups
    {
      id: "community",
      title: "Patient Community & Support Groups",
      description:
        "Connect patients with similar conditions, support groups, and community health initiatives",
      icon: <Users className="h-6 w-6" />,
      status: "planned",
      category: "advanced",
    },

    // Wearable Device Integration
    {
      id: "wearables",
      title: "Wearable Device Integration",
      description:
        "Sync with fitness trackers, smartwatches, and health monitoring devices for real-time data",
      icon: <Activity className="h-6 w-6" />,
      status: "planned",
      category: "premium",
    },

    // Emergency Services Integration
    {
      id: "emergency",
      title: "Emergency Services Integration",
      description:
        "Quick access to emergency services, ambulance booking, and critical health alerts",
      icon: <Heart className="h-6 w-6" />,
      status: "planned",
      category: "advanced",
    },

    // AI Health Assistant
    {
      id: "ai-assistant",
      title: "AI Health Assistant",
      description:
        "24/7 AI-powered health assistant for instant medical queries and health guidance",
      icon: <Brain className="h-6 w-6" />,
      status: "in-progress",
      category: "premium",
    },

    // Telemedicine for Rural Areas
    {
      id: "rural-telemedicine",
      title: "Rural Telemedicine Expansion",
      description:
        "Specialized telemedicine services for rural Bangladesh with offline capabilities",
      icon: <Globe className="h-6 w-6" />,
      status: "planned",
      category: "advanced",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "planned":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "planned":
        return <Target className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "core":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      case "premium":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredFeatures =
    selectedCategory === "all"
      ? features
      : features.filter((feature) => feature.category === selectedCategory);

  const completedFeatures = features.filter(
    (f) => f.status === "completed"
  ).length;
  const totalFeatures = features.length;
  const completionPercentage = Math.round(
    (completedFeatures / totalFeatures) * 100
  );

  const selectedFeatureData = features.find((f) => f.id === selectedFeature);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <Zap className="h-10 w-10 text-blue-600" />
          HealthConnect Features
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive healthcare platform with advanced features for patients,
          doctors, and administrators
        </p>

        {/* Progress Overview */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {completedFeatures}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {completionPercentage}%
            </div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {totalFeatures}
            </div>
            <div className="text-sm text-gray-600">Total Features</div>
          </div>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="flex justify-center">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <Button
            variant={selectedCategory === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            All Features
          </Button>
          <Button
            variant={selectedCategory === "core" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory("core")}
          >
            Core
          </Button>
          <Button
            variant={selectedCategory === "advanced" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory("advanced")}
          >
            Advanced
          </Button>
          <Button
            variant={selectedCategory === "premium" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory("premium")}
          >
            Premium
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      {!selectedFeature ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => (
            <Card
              key={feature.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                feature.status === "completed"
                  ? "border-green-200 bg-green-50/30"
                  : ""
              }`}
              onClick={() =>
                feature.component && setSelectedFeature(feature.id)
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        feature.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : feature.status === "in-progress"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Badge className={getStatusColor(feature.status)}>
                    {getStatusIcon(feature.status)}
                    <span className="ml-1 capitalize">
                      {feature.status.replace("-", " ")}
                    </span>
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getCategoryColor(feature.category)}
                  >
                    {feature.category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {feature.component && feature.status === "completed" && (
                  <Button className="w-full mt-4" size="sm">
                    View Feature
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Feature Detail View
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedFeature(null)}>
              ← Back to Features
            </Button>
            <div>
              <h2 className="text-2xl font-bold">
                {selectedFeatureData?.title}
              </h2>
              <p className="text-gray-600">
                {selectedFeatureData?.description}
              </p>
            </div>
          </div>

          {selectedFeatureData?.component && (
            <div className="border rounded-lg p-6 bg-white">
              <selectedFeatureData.component
                userId="demo-user"
                currentUserRole="patient"
                currentUserId="demo-user"
              />
            </div>
          )}
        </div>
      )}

      {/* Feature Highlights */}
      {!selectedFeature && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              🎉 Platform Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  {completionPercentage}% Complete
                </h3>
                <p className="text-sm text-gray-600">
                  All major features implemented and tested
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Mobile Ready</h3>
                <p className="text-sm text-gray-600">
                  Responsive design for all devices
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  Secure & Compliant
                </h3>
                <p className="text-sm text-gray-600">
                  HIPAA compliant with end-to-end encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
