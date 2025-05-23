"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import HealthAnalyticsDashboard from "@/components/analytics/health-analytics-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Activity,
  Heart,
  Brain,
  Shield,
  Target,
  Zap,
  Users,
  Calendar,
  Download,
  Share2,
  Settings
} from "lucide-react";

export default function HealthAnalyticsPage() {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Health Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              {isDoctor 
                ? "Comprehensive patient health insights and data-driven care decisions" 
                : "Track your health journey with personalized insights and progress monitoring"
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Report
            </Button>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Data
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
                Clinical Analytics Dashboard
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Personal Health Insights
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Analytics Benefits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Data-Driven Insights</h3>
                <p className="text-sm text-gray-600">
                  Make informed health decisions based on comprehensive data analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Goal Tracking</h3>
                <p className="text-sm text-gray-600">
                  Monitor progress towards health goals with visual progress indicators
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
                <h3 className="font-semibold text-gray-900">Predictive Analytics</h3>
                <p className="text-sm text-gray-600">
                  Early warning system for potential health issues and trends
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctor-specific features */}
      {isDoctor && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Clinical Decision Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Patient Population Analytics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Aggregate health trends across patient cohorts</li>
                  <li>• Treatment effectiveness analysis and outcomes</li>
                  <li>• Risk stratification and early intervention alerts</li>
                  <li>• Medication adherence patterns and optimization</li>
                  <li>• Chronic disease management insights</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Clinical Intelligence</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Evidence-based treatment recommendations</li>
                  <li>• Drug interaction and allergy alerts</li>
                  <li>• Lab result trend analysis and interpretation</li>
                  <li>• Care gap identification and closure tracking</li>
                  <li>• Quality metrics and performance indicators</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Health Categories */}
      {isPatient && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Your Health Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-900">Vital Signs</h4>
                  <p className="text-sm text-red-700">Blood pressure, heart rate, temperature</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">Physical Activity</h4>
                  <p className="text-sm text-blue-700">Steps, exercise, fitness goals</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Medications</h4>
                  <p className="text-sm text-green-700">Adherence, effectiveness, side effects</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
                <div>
                  <h4 className="font-medium text-purple-900">Mental Health</h4>
                  <p className="text-sm text-purple-700">Sleep, mood, stress levels</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Advanced Analytics Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">📊 Real-Time Monitoring</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Live health metric tracking</li>
                <li>• Instant alerts for critical values</li>
                <li>• Continuous data synchronization</li>
                <li>• Wearable device integration</li>
                <li>• Emergency notification system</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">📈 Trend Analysis</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Historical data visualization</li>
                <li>• Pattern recognition algorithms</li>
                <li>• Seasonal health variations</li>
                <li>• Medication impact analysis</li>
                <li>• Lifestyle correlation insights</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">🎯 Personalized Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• AI-powered health recommendations</li>
                <li>• Customized goal setting</li>
                <li>• Risk factor identification</li>
                <li>• Preventive care suggestions</li>
                <li>• Behavioral change support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">🔒 Data Protection</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• End-to-end encryption for all health data</li>
                <li>• HIPAA-compliant data storage and transmission</li>
                <li>• Regular security audits and compliance checks</li>
                <li>• Granular access controls and permissions</li>
                <li>• Automatic data backup and recovery</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">👤 Privacy Controls</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• You control who sees your health data</li>
                <li>• Selective sharing with healthcare providers</li>
                <li>• Data anonymization for research purposes</li>
                <li>• Right to data portability and deletion</li>
                <li>• Transparent data usage policies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Dashboard */}
      <HealthAnalyticsDashboard 
        userId={user?.id || ""}
        isDoctor={isDoctor}
        patientId={selectedPatient || undefined}
      />

      {/* Help & Support */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Understanding Your Health Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">📊 Reading Your Charts</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Green indicators show healthy ranges</li>
                <li>• Yellow indicates areas needing attention</li>
                <li>• Red signals require immediate action</li>
                <li>• Trend arrows show improvement or decline</li>
                <li>• Progress bars track goal achievement</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">🎯 Taking Action</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Set realistic and achievable health goals</li>
                <li>• Review analytics weekly for best results</li>
                <li>• Share concerning trends with your doctor</li>
                <li>• Use insights to adjust lifestyle habits</li>
                <li>• Celebrate achievements and milestones</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
