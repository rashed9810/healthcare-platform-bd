"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import HealthReminders from "@/components/notifications/health-reminders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Plus, 
  Settings,
  Smartphone,
  Mail,
  MessageSquare,
  Clock,
  Calendar,
  Activity,
  Heart,
  Shield,
  Zap,
  TrendingUp
} from "lucide-react";

export default function HealthRemindersPage() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-600" />
              Health Reminders
            </h1>
            <p className="text-gray-600 mt-2">
              {isDoctor 
                ? "Help patients stay on track with personalized health reminders" 
                : "Never miss important medications, appointments, or health checks"
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
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
                Doctor Dashboard
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Personal Health Assistant
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Quick Benefits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Never Miss a Dose</h3>
                <p className="text-sm text-gray-600">
                  Timely medication reminders improve treatment outcomes by 40%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Stay Organized</h3>
                <p className="text-sm text-gray-600">
                  Centralized health schedule reduces missed appointments by 60%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Better Health</h3>
                <p className="text-sm text-gray-600">
                  Consistent health habits lead to 25% better health outcomes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Methods Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Smart Notification System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Instant alerts on your phone with customizable sounds and vibration
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">Instant</Badge>
                  <Badge variant="outline" className="text-xs">Reliable</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Email Reminders</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed email notifications with medication instructions and tips
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">Detailed</Badge>
                  <Badge variant="outline" className="text-xs">Backup</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">SMS Alerts</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Text message reminders that work even without internet connection
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">Offline</Badge>
                  <Badge variant="outline" className="text-xs">Universal</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor-specific features */}
      {isDoctor && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Doctor Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Patient Reminder Management</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Set medication reminders for patients</li>
                  <li>• Schedule follow-up appointment alerts</li>
                  <li>• Monitor patient adherence to treatment</li>
                  <li>• Send custom health education reminders</li>
                  <li>• Track reminder effectiveness and outcomes</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Clinical Integration</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Sync with prescription management system</li>
                  <li>• Automated post-procedure care reminders</li>
                  <li>• Lab test preparation notifications</li>
                  <li>• Chronic disease management protocols</li>
                  <li>• Emergency contact notifications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Health Tips */}
      {isPatient && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Tips & Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Medication Management</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Take medications at the same time daily</li>
                  <li>• Use a pill organizer for multiple medications</li>
                  <li>• Never skip doses without consulting your doctor</li>
                  <li>• Keep a medication diary to track side effects</li>
                  <li>• Store medications properly (temperature, light)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Appointment Preparation</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Prepare questions in advance</li>
                  <li>• Bring current medication list</li>
                  <li>• Note any symptoms or changes</li>
                  <li>• Arrive 15 minutes early</li>
                  <li>• Bring insurance cards and ID</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Health Reminders Component */}
      <HealthReminders userId={user?.id || ""} />

      {/* Emergency Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Emergency Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">When to Seek Immediate Help</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Severe allergic reactions to medications</li>
                <li>• Chest pain or difficulty breathing</li>
                <li>• Severe side effects from medications</li>
                <li>• Signs of medication overdose</li>
                <li>• Sudden changes in health condition</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Emergency Contacts</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Emergency Services:</span>
                  <span className="font-medium">999</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Poison Control:</span>
                  <span className="font-medium">16263</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Health Helpline:</span>
                  <span className="font-medium">16263</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Doctor:</span>
                  <span className="font-medium">Contact via app</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
