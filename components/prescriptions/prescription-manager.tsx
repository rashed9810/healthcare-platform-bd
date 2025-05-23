"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Camera, 
  FileText, 
  Pill, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Calendar,
  User,
  Stethoscope
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  type: "tablet" | "syrup" | "injection" | "cream" | "drops";
  beforeFood: boolean;
  sideEffects?: string[];
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  notes: string;
  followUpDate?: string;
  status: "active" | "completed" | "cancelled";
  digitalSignature?: string;
}

interface PrescriptionManagerProps {
  isDoctor: boolean;
  userId: string;
  appointmentId?: string;
}

export default function PrescriptionManager({ isDoctor, userId, appointmentId }: PrescriptionManagerProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed" | "cancelled">("all");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<string>("");
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sample data for demonstration
  const samplePrescriptions: Prescription[] = [
    {
      id: "1",
      patientId: "patient1",
      patientName: "রহিম আহমেদ (Rahim Ahmed)",
      doctorId: "doctor1",
      doctorName: "ডা. ফাতিমা খান (Dr. Fatima Khan)",
      date: "2024-01-15",
      diagnosis: "Upper Respiratory Tract Infection",
      medications: [
        {
          id: "med1",
          name: "Amoxicillin 500mg",
          dosage: "500mg",
          frequency: "3 times daily",
          duration: "7 days",
          instructions: "Take with food",
          type: "tablet",
          beforeFood: false,
          sideEffects: ["Nausea", "Diarrhea"]
        },
        {
          id: "med2",
          name: "Paracetamol 500mg",
          dosage: "500mg",
          frequency: "As needed",
          duration: "5 days",
          instructions: "For fever and pain",
          type: "tablet",
          beforeFood: false
        }
      ],
      notes: "Rest and drink plenty of fluids. Return if symptoms worsen.",
      followUpDate: "2024-01-22",
      status: "active"
    }
  ];

  // Initialize with sample data
  useState(() => {
    setPrescriptions(samplePrescriptions);
  });

  const handleImageUpload = async (file: File) => {
    setIsProcessingOCR(true);
    
    // Convert file to base64 for display
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Simulate OCR processing
      setTimeout(() => {
        const mockOCRResult = `
Prescription Analysis:
- Medication: Amoxicillin 500mg
- Dosage: 1 tablet 3 times daily
- Duration: 7 days
- Instructions: Take with food

- Medication: Paracetamol 500mg  
- Dosage: 1 tablet as needed
- Duration: 5 days
- Instructions: For fever and pain
        `;
        setOcrResult(mockOCRResult);
        setIsProcessingOCR(false);
      }, 2000);
    } catch (error) {
      console.error("OCR processing failed:", error);
      setIsProcessingOCR(false);
    }
  };

  const createNewPrescription = (): Prescription => ({
    id: Date.now().toString(),
    patientId: isDoctor ? "" : userId,
    patientName: "",
    doctorId: isDoctor ? userId : "",
    doctorName: "",
    date: new Date().toISOString().split('T')[0],
    diagnosis: "",
    medications: [],
    notes: "",
    status: "active"
  });

  const addMedication = (prescription: Prescription): Medication => ({
    id: Date.now().toString(),
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    type: "tablet",
    beforeFood: false
  });

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || prescription.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getMedicationIcon = (type: string) => {
    switch (type) {
      case "tablet": return "💊";
      case "syrup": return "🍯";
      case "injection": return "💉";
      case "cream": return "🧴";
      case "drops": return "💧";
      default: return "💊";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prescription Management</h2>
          <p className="text-gray-600">
            {isDoctor ? "Create and manage patient prescriptions" : "View your prescription history"}
          </p>
        </div>
        
        {isDoctor && (
          <Button onClick={() => {
            setCurrentPrescription(createNewPrescription());
            setIsCreating(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            New Prescription
          </Button>
        )}
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">📋 Prescription List</TabsTrigger>
          <TabsTrigger value="ocr">📷 OCR Scanner</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
        </TabsList>

        {/* Prescription List */}
        <TabsContent value="list" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Prescription Cards */}
          <div className="grid gap-4">
            {filteredPrescriptions.map((prescription) => (
              <Card key={prescription.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        {prescription.patientName}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Stethoscope className="h-4 w-4" />
                          {prescription.doctorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(prescription.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(prescription.status)}>
                      {prescription.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Diagnosis</Label>
                      <p className="text-sm text-gray-700">{prescription.diagnosis}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Medications ({prescription.medications.length})</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {prescription.medications.slice(0, 3).map((med) => (
                          <Badge key={med.id} variant="outline" className="text-xs">
                            {getMedicationIcon(med.type)} {med.name}
                          </Badge>
                        ))}
                        {prescription.medications.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{prescription.medications.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {prescription.followUpDate && (
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <Clock className="h-4 w-4" />
                        Follow-up: {new Date(prescription.followUpDate).toLocaleDateString()}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      {isDoctor && (
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPrescriptions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search terms" : "No prescriptions available"}
              </p>
            </div>
          )}
        </TabsContent>

        {/* OCR Scanner */}
        <TabsContent value="ocr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Prescription OCR Scanner
              </CardTitle>
              <p className="text-sm text-gray-600">
                Upload or capture a prescription image to extract medication information
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <Button
                  variant="outline"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />

              {uploadedImage && (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <img
                      src={uploadedImage}
                      alt="Uploaded prescription"
                      className="max-w-full h-auto rounded"
                    />
                  </div>

                  {isProcessingOCR && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Processing image with AI... This may take a few moments.
                      </AlertDescription>
                    </Alert>
                  )}

                  {ocrResult && (
                    <div className="space-y-2">
                      <Label>Extracted Information</Label>
                      <Textarea
                        value={ocrResult}
                        onChange={(e) => setOcrResult(e.target.value)}
                        rows={8}
                        className="font-mono text-sm"
                      />
                      <Button className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Create Prescription from OCR
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                    <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Prescriptions</p>
                    <p className="text-2xl font-bold text-green-600">
                      {prescriptions.filter(p => p.status === "active").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {prescriptions.filter(p => 
                        new Date(p.date).getMonth() === new Date().getMonth()
                      ).length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Most Prescribed Medications */}
          <Card>
            <CardHeader>
              <CardTitle>Most Prescribed Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Paracetamol", "Amoxicillin", "Omeprazole", "Metformin", "Atorvastatin"].map((med, index) => (
                  <div key={med} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">💊</span>
                      <span className="font-medium">{med}</span>
                    </div>
                    <Badge variant="outline">{Math.floor(Math.random() * 50) + 10} times</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
