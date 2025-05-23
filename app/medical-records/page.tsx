"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import MedicalRecordsDashboard from "@/components/medical-records/medical-records-dashboard";
import MedicalRecordViewer from "@/components/medical-records/medical-record-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Upload,
  Shield,
  Clock,
  Users,
  Activity,
  TrendingUp,
  Calendar,
  AlertCircle
} from "lucide-react";

interface MedicalRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  doctorName: string;
  hospitalName: string;
  description: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  isShared: boolean;
  sharedWith: string[];
  tags: string[];
  status: string;
  priority: string;
}

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  const handleRecordUpdate = (updatedRecord: MedicalRecord) => {
    // Handle record update logic
    console.log("Record updated:", updatedRecord);
    setSelectedRecord(null);
  };

  const handleRecordShare = (recordId: string, shareWith: string[]) => {
    // Handle record sharing logic
    console.log("Sharing record:", recordId, "with:", shareWith);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              Medical Records
            </h1>
            <p className="text-gray-600 mt-2">
              {isDoctor 
                ? "Manage patient medical records and documents" 
                : "Your complete medical history and health documents"
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
            
            {isDoctor && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            )}
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
                Doctor Access
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Patient Portal
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-gray-500 mt-1">+3 this month</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold text-green-600">8</p>
                <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shared Records</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
                <p className="text-xs text-gray-500 mt-1">With 4 doctors</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-orange-600">3</p>
                <p className="text-xs text-gray-500 mt-1">Require attention</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity for Doctors */}
      {isDoctor && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Patient Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">New lab report uploaded by রহিম আহমেদ</p>
                    <p className="text-sm text-gray-600">Blood test results - CBC and lipid profile</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">2 hours ago</span>
                  <Badge className="ml-2 bg-blue-100 text-blue-800">Lab Report</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Prescription reviewed by ফাতিমা খাতুন</p>
                    <p className="text-sm text-gray-600">Diabetes medication adjustment completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">5 hours ago</span>
                  <Badge className="ml-2 bg-green-100 text-green-800">Prescription</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Follow-up required for করিম উদ্দিন</p>
                    <p className="text-sm text-gray-600">Post-surgery check-up scheduled for tomorrow</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">1 day ago</span>
                  <Badge className="ml-2 bg-yellow-100 text-yellow-800">Follow-up</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Health Summary */}
      {isPatient && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Recent Consultations</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>General Checkup</span>
                    <span className="text-gray-500">Jan 15, 2024</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Diabetes Follow-up</span>
                    <span className="text-gray-500">Jan 08, 2024</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Blood Pressure Check</span>
                    <span className="text-gray-500">Dec 28, 2023</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Current Medications</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Metformin 500mg</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Lisinopril 10mg</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Vitamin D3</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Upcoming Appointments</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Dr. Rahman - Cardiology</span>
                    <span className="text-gray-500">Jan 25, 2024</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Lab Tests - Fasting</span>
                    <span className="text-gray-500">Jan 30, 2024</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Eye Exam - Routine</span>
                    <span className="text-gray-500">Feb 05, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Important Notices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Data Privacy & Security</p>
                <p className="text-sm text-blue-700">
                  Your medical records are encrypted and securely stored. Only authorized healthcare providers can access your information.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Regular Backups</p>
                <p className="text-sm text-green-700">
                  All medical records are automatically backed up daily to ensure your health information is never lost.
                </p>
              </div>
            </div>

            {isPatient && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Upcoming Lab Results</p>
                  <p className="text-sm text-yellow-700">
                    Your blood test results from January 20th will be available within 24-48 hours.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Medical Records Dashboard */}
      <MedicalRecordsDashboard 
        patientId={user?.id || ""}
        isDoctor={isDoctor}
      />

      {/* Medical Record Viewer Modal */}
      {selectedRecord && (
        <MedicalRecordViewer
          record={selectedRecord}
          isDoctor={isDoctor}
          onClose={() => setSelectedRecord(null)}
          onUpdate={handleRecordUpdate}
          onShare={handleRecordShare}
        />
      )}

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">For Patients:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Upload lab reports, prescriptions, and medical documents</li>
                <li>• Share records securely with your healthcare providers</li>
                <li>• Track your medical history and treatment progress</li>
                <li>• Download records for insurance or referral purposes</li>
                <li>• Add personal notes and comments to your records</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">For Doctors:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Access complete patient medical histories</li>
                <li>• Add clinical notes and observations</li>
                <li>• Share records with other healthcare providers</li>
                <li>• Track patient progress over time</li>
                <li>• Generate comprehensive medical reports</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
