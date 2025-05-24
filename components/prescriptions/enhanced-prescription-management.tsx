"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  QrCode,
  Pill,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Stethoscope,
  Upload,
  Eye,
  Edit,
  Share,
  Printer,
  Camera,
  Scan
} from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  beforeFood: boolean;
}

interface Prescription {
  id: string;
  prescriptionNumber: string;
  doctorName: string;
  doctorLicense: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  notes: string;
  followUpDate?: string;
  status: "active" | "dispensed" | "expired";
  qrCode: string;
  digitalSignature: string;
}

interface PrescriptionManagementProps {
  userRole: "doctor" | "patient" | "pharmacist";
  userId: string;
}

export default function EnhancedPrescriptionManagement({ userRole, userId }: PrescriptionManagementProps) {
  const [selectedTab, setSelectedTab] = useState("list");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: "1",
      prescriptionNumber: "RX-20240120-ABC123",
      doctorName: "Dr. Ahmed Rahman",
      doctorLicense: "BD-DOC-12345",
      patientName: "Fatima Khan",
      patientAge: "35",
      patientGender: "Female",
      date: "2024-01-20T10:30:00Z",
      diagnosis: "Upper Respiratory Tract Infection",
      medications: [
        {
          id: "med1",
          name: "Amoxicillin",
          dosage: "500mg",
          frequency: "3 times daily",
          duration: "7 days",
          instructions: "Take with food",
          beforeFood: false
        },
        {
          id: "med2",
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "As needed",
          duration: "5 days",
          instructions: "For fever and pain",
          beforeFood: false
        }
      ],
      notes: "Rest and drink plenty of fluids. Return if symptoms worsen.",
      followUpDate: "2024-01-27",
      status: "active",
      qrCode: "QR123456789",
      digitalSignature: "Dr. Ahmed Rahman - 2024-01-20T10:30:00Z"
    }
  ]);

  const [newPrescription, setNewPrescription] = useState({
    patientId: "",
    diagnosis: "",
    medications: [] as Medication[],
    notes: "",
    followUpDate: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "dispensed": return "bg-blue-100 text-blue-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Clock className="h-4 w-4" />;
      case "dispensed": return <CheckCircle className="h-4 w-4" />;
      case "expired": return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const addMedication = () => {
    const newMed: Medication = {
      id: `med_${Date.now()}`,
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      beforeFood: false
    };
    setNewPrescription(prev => ({
      ...prev,
      medications: [...prev.medications, newMed]
    }));
  };

  const updateMedication = (index: number, field: keyof Medication, value: any) => {
    setNewPrescription(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const removeMedication = (index: number) => {
    setNewPrescription(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleOCRUpload = async (file: File) => {
    setOcrProcessing(true);
    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock OCR result
      const ocrResult = {
        medications: [
          {
            id: `med_${Date.now()}`,
            name: "Amoxicillin",
            dosage: "500mg",
            frequency: "3 times daily",
            duration: "7 days",
            instructions: "Take with food",
            beforeFood: false
          }
        ],
        diagnosis: "Upper Respiratory Tract Infection",
        notes: "Rest and drink plenty of fluids"
      };
      
      setNewPrescription(prev => ({
        ...prev,
        diagnosis: ocrResult.diagnosis,
        medications: ocrResult.medications,
        notes: ocrResult.notes
      }));
      
    } catch (error) {
      console.error("OCR processing failed:", error);
    } finally {
      setOcrProcessing(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || prescription.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-7 w-7 text-blue-600" />
            Prescription Management
          </h2>
          <p className="text-gray-600 mt-1">
            Digital prescriptions with QR verification and medication tracking
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {userRole === "doctor" && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Prescription
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">📋 Prescriptions</TabsTrigger>
          <TabsTrigger value="create">➕ Create</TabsTrigger>
          <TabsTrigger value="ocr">📷 OCR Scan</TabsTrigger>
          <TabsTrigger value="verify">✅ Verify</TabsTrigger>
        </TabsList>

        {/* Prescriptions List */}
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Prescription History</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search prescriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="dispensed">Dispensed</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{prescription.prescriptionNumber}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {prescription.patientName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Stethoscope className="h-4 w-4" />
                            {prescription.doctorName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(prescription.date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(prescription.status)}>
                          {getStatusIcon(prescription.status)}
                          <span className="ml-1 capitalize">{prescription.status}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                        <p className="text-gray-700">{prescription.diagnosis}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Medications ({prescription.medications.length})</h4>
                        <div className="space-y-1">
                          {prescription.medications.slice(0, 2).map((med, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Pill className="h-3 w-3 text-blue-600" />
                              <span className="text-sm">{med.name} - {med.dosage}</span>
                            </div>
                          ))}
                          {prescription.medications.length > 2 && (
                            <p className="text-sm text-gray-500">+{prescription.medications.length - 2} more</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedPrescription(prescription)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4 mr-2" />
                        QR Code
                      </Button>
                      <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      {userRole === "patient" && (
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Prescription */}
        <TabsContent value="create" className="space-y-4">
          {userRole === "doctor" ? (
            <Card>
              <CardHeader>
                <CardTitle>Create New Prescription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Patient ID</label>
                    <Input
                      value={newPrescription.patientId}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, patientId: e.target.value }))}
                      placeholder="Enter patient ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Follow-up Date</label>
                    <Input
                      type="date"
                      value={newPrescription.followUpDate}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, followUpDate: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Diagnosis</label>
                  <Textarea
                    value={newPrescription.diagnosis}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, diagnosis: e.target.value }))}
                    placeholder="Enter diagnosis"
                    rows={3}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Medications</h3>
                    <Button onClick={addMedication} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {newPrescription.medications.map((medication, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Medication Name</label>
                            <Input
                              value={medication.name}
                              onChange={(e) => updateMedication(index, "name", e.target.value)}
                              placeholder="e.g., Amoxicillin"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Dosage</label>
                            <Input
                              value={medication.dosage}
                              onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                              placeholder="e.g., 500mg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Frequency</label>
                            <Select 
                              value={medication.frequency}
                              onValueChange={(value) => updateMedication(index, "frequency", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="once daily">Once daily</SelectItem>
                                <SelectItem value="twice daily">Twice daily</SelectItem>
                                <SelectItem value="3 times daily">3 times daily</SelectItem>
                                <SelectItem value="4 times daily">4 times daily</SelectItem>
                                <SelectItem value="as needed">As needed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Duration</label>
                            <Input
                              value={medication.duration}
                              onChange={(e) => updateMedication(index, "duration", e.target.value)}
                              placeholder="e.g., 7 days"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Instructions</label>
                          <Input
                            value={medication.instructions}
                            onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                            placeholder="e.g., Take with food"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={medication.beforeFood}
                              onChange={(e) => updateMedication(index, "beforeFood", e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm">Take before food</span>
                          </label>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeMedication(index)}
                            className="text-red-600"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes</label>
                  <Textarea
                    value={newPrescription.notes}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional instructions or notes"
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    Create Prescription
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Doctor Access Required
                </h3>
                <p className="text-gray-600">
                  Only doctors can create prescriptions
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* OCR Scan */}
        <TabsContent value="ocr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                OCR Prescription Scanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {ocrProcessing ? (
                  <div className="space-y-4">
                    <Scan className="h-12 w-12 text-blue-600 mx-auto animate-pulse" />
                    <div>
                      <h3 className="text-lg font-medium">Processing Image...</h3>
                      <p className="text-gray-600">Extracting prescription data using OCR</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-medium">Upload Prescription Image</h3>
                      <p className="text-gray-600">
                        Take a photo or upload an image of a prescription to extract data automatically
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button>
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verify Prescription */}
        <TabsContent value="verify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Verify Prescription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prescription Number or QR Code</label>
                  <div className="flex gap-2">
                    <Input placeholder="Enter prescription number or scan QR code" className="flex-1" />
                    <Button variant="outline">
                      <QrCode className="h-4 w-4 mr-2" />
                      Scan QR
                    </Button>
                  </div>
                </div>
                
                <Button className="w-full">
                  Verify Prescription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
