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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Upload, 
  Download, 
  Share2, 
  Eye, 
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Stethoscope,
  Heart,
  Activity,
  FileImage,
  FileSpreadsheet,
  File,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MedicalRecord {
  id: string;
  title: string;
  type: "lab_report" | "prescription" | "imaging" | "consultation" | "vaccination" | "surgery" | "other";
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
  status: "active" | "archived" | "pending";
  priority: "low" | "medium" | "high" | "urgent";
}

interface MedicalRecordsDashboardProps {
  patientId: string;
  isDoctor?: boolean;
}

export default function MedicalRecordsDashboard({ patientId, isDoctor = false }: MedicalRecordsDashboardProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample medical records data
  const sampleRecords: MedicalRecord[] = [
    {
      id: "1",
      title: "Blood Test Results - Complete Blood Count",
      type: "lab_report",
      date: "2024-01-15",
      doctorName: "ডা. ফাতিমা খান (Dr. Fatima Khan)",
      hospitalName: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
      description: "Routine blood work showing normal values across all parameters",
      fileUrl: "/sample-lab-report.pdf",
      fileName: "CBC_Report_Jan2024.pdf",
      fileSize: "2.3 MB",
      fileType: "application/pdf",
      isShared: true,
      sharedWith: ["Dr. Rahman", "Dr. Ahmed"],
      tags: ["blood test", "routine", "normal"],
      status: "active",
      priority: "medium"
    },
    {
      id: "2", 
      title: "Chest X-Ray - Respiratory Check",
      type: "imaging",
      date: "2024-01-10",
      doctorName: "ডা. করিম উদ্দিন (Dr. Karim Uddin)",
      hospitalName: "স্কয়ার হাসপাতাল",
      description: "Chest X-ray showing clear lungs with no abnormalities",
      fileUrl: "/sample-xray.jpg",
      fileName: "Chest_Xray_Jan2024.jpg",
      fileSize: "5.1 MB",
      fileType: "image/jpeg",
      isShared: false,
      sharedWith: [],
      tags: ["x-ray", "chest", "respiratory", "clear"],
      status: "active",
      priority: "low"
    },
    {
      id: "3",
      title: "Diabetes Management Consultation",
      type: "consultation",
      date: "2024-01-08",
      doctorName: "ডা. নাসরিন আক্তার (Dr. Nasreen Akter)",
      hospitalName: "ইউনাইটেড হাসপাতাল",
      description: "Follow-up consultation for diabetes management and medication adjustment",
      isShared: true,
      sharedWith: ["Dr. Fatima Khan"],
      tags: ["diabetes", "consultation", "follow-up"],
      status: "active",
      priority: "high"
    }
  ];

  // Initialize with sample data
  useState(() => {
    setRecords(sampleRecords);
  });

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "lab_report": return <Activity className="h-5 w-5 text-blue-600" />;
      case "prescription": return <FileText className="h-5 w-5 text-green-600" />;
      case "imaging": return <FileImage className="h-5 w-5 text-purple-600" />;
      case "consultation": return <Stethoscope className="h-5 w-5 text-orange-600" />;
      case "vaccination": return <Heart className="h-5 w-5 text-red-600" />;
      case "surgery": return <FileSpreadsheet className="h-5 w-5 text-indigo-600" />;
      default: return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRecordTypeLabel = (type: string) => {
    const labels = {
      lab_report: "Lab Report",
      prescription: "Prescription", 
      imaging: "Medical Imaging",
      consultation: "Consultation",
      vaccination: "Vaccination",
      surgery: "Surgery Record",
      other: "Other"
    };
    return labels[type as keyof typeof labels] || "Unknown";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "archived": return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "all" || record.type === filterType;
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        type: "other",
        date: new Date().toISOString().split('T')[0],
        doctorName: "Current User",
        hospitalName: "Uploaded Document",
        description: "User uploaded medical document",
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        fileType: file.type,
        isShared: false,
        sharedWith: [],
        tags: ["uploaded"],
        status: "active",
        priority: "medium"
      };
      
      setRecords(prev => [newRecord, ...prev]);
      setShowUploadDialog(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const shareRecord = (recordId: string, doctorName: string) => {
    setRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { 
            ...record, 
            isShared: true, 
            sharedWith: [...record.sharedWith, doctorName] 
          }
        : record
    ));
  };

  const downloadRecord = (record: MedicalRecord) => {
    if (record.fileUrl) {
      const link = document.createElement('a');
      link.href = record.fileUrl;
      link.download = record.fileName || `${record.title}.pdf`;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-7 w-7 text-blue-600" />
            Medical Records
          </h2>
          <p className="text-gray-600 mt-1">
            {isDoctor ? "Patient medical history and documents" : "Your complete medical history"}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          
          {isDoctor && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{records.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shared Records</p>
                <p className="text-2xl font-bold text-green-600">
                  {records.filter(r => r.isShared).length}
                </p>
              </div>
              <Share2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Records</p>
                <p className="text-2xl font-bold text-purple-600">
                  {records.filter(r => {
                    const recordDate = new Date(r.date);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return recordDate >= thirtyDaysAgo;
                  }).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {records.filter(r => r.priority === "high" || r.priority === "urgent").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medical records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lab_report">Lab Reports</SelectItem>
                <SelectItem value="prescription">Prescriptions</SelectItem>
                <SelectItem value="imaging">Medical Imaging</SelectItem>
                <SelectItem value="consultation">Consultations</SelectItem>
                <SelectItem value="vaccination">Vaccinations</SelectItem>
                <SelectItem value="surgery">Surgery Records</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records found</h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search terms or filters"
                  : "Upload your first medical document to get started"
                }
              </p>
              {!searchTerm && filterType === "all" && filterStatus === "all" && (
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Document
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0">
                      {getRecordIcon(record.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {record.title}
                        </h3>
                        <div className="flex items-center gap-2 ml-4">
                          {getStatusIcon(record.status)}
                          <Badge className={getPriorityColor(record.priority)}>
                            {record.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(record.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {record.doctorName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Stethoscope className="h-4 w-4" />
                            {getRecordTypeLabel(record.type)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700">{record.description}</p>
                        
                        {record.fileName && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <File className="h-4 w-4" />
                            <span>{record.fileName}</span>
                            <span>({record.fileSize})</span>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-1">
                          {record.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {record.isShared && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Share2 className="h-4 w-4" />
                            <span>Shared with: {record.sharedWith.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {record.fileUrl && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadRecord(record)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    
                    {isDoctor && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
