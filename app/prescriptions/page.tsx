"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import PrescriptionManager from "@/components/prescriptions/prescription-manager";
import PrescriptionForm from "@/components/prescriptions/prescription-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  ArrowLeft,
  Stethoscope,
  User,
  Calendar,
  Pill
} from "lucide-react";

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"list" | "create">("list");
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  const isDoctor = user?.role === "doctor";

  const handleCreatePrescription = (prescriptionData: any) => {
    console.log("Creating prescription:", prescriptionData);
    // Here you would typically save to your backend
    setCurrentView("list");
  };

  const handleCancelCreate = () => {
    setCurrentView("list");
    setSelectedAppointment(null);
  };

  // Sample patient data for demonstration
  const samplePatientData = {
    id: "patient123",
    name: "রহিম আহমেদ (Rahim Ahmed)",
    age: "35",
    gender: "male" as const
  };

  if (currentView === "create") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleCancelCreate}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Prescriptions
          </Button>
        </div>
        
        <PrescriptionForm
          appointmentId={selectedAppointment || undefined}
          patientData={samplePatientData}
          onSave={handleCreatePrescription}
          onCancel={handleCancelCreate}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              Prescription Management
            </h1>
            <p className="text-gray-600 mt-2">
              {isDoctor 
                ? "Create, manage, and track patient prescriptions" 
                : "View your prescription history and medication details"
              }
            </p>
          </div>
          
          {isDoctor && (
            <Button 
              onClick={() => setCurrentView("create")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Prescription
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Prescriptions</p>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
                <Pill className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isDoctor ? "Patients" : "Doctors"}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {isDoctor ? "156" : "3"}
                  </p>
                </div>
                {isDoctor ? (
                  <User className="h-8 w-8 text-orange-600" />
                ) : (
                  <Stethoscope className="h-8 w-8 text-orange-600" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Role Badge */}
        <div className="mt-4">
          <Badge 
            variant={isDoctor ? "default" : "secondary"}
            className="text-sm px-3 py-1"
          >
            {isDoctor ? (
              <>
                <Stethoscope className="h-4 w-4 mr-2" />
                Doctor Dashboard
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-2" />
                Patient Dashboard
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Recent Activity for Doctors */}
      {isDoctor && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Prescription created for রহিম আহমেদ</p>
                    <p className="text-sm text-gray-600">Upper Respiratory Tract Infection - 3 medications</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Prescription completed by ফাতিমা খাতুন</p>
                    <p className="text-sm text-gray-600">Diabetes management - Follow-up scheduled</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">5 hours ago</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Follow-up reminder for করিম উদ্দিন</p>
                    <p className="text-sm text-gray-600">Hypertension check-up due tomorrow</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prescription Manager Component */}
      <PrescriptionManager 
        isDoctor={isDoctor}
        userId={user?.id || ""}
        appointmentId={selectedAppointment || undefined}
      />

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">For Doctors:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use the OCR scanner to digitize handwritten prescriptions</li>
                <li>• Set follow-up dates for patient monitoring</li>
                <li>• Include detailed medication instructions</li>
                <li>• Add side effects and contraindications</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">For Patients:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• View all your prescription history in one place</li>
                <li>• Download prescription PDFs for pharmacy visits</li>
                <li>• Set medication reminders (coming soon)</li>
                <li>• Track medication adherence</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
