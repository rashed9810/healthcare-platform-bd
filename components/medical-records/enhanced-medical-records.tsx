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
  FolderOpen, 
  Plus, 
  Search, 
  Download, 
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  Share,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Stethoscope,
  Tag,
  Filter,
  BarChart3,
  TrendingUp,
  Clock,
  Shield,
  Archive
} from "lucide-react";

interface MedicalFile {
  id: string;
  filename: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  fileUrl: string;
}

interface MedicalRecord {
  id: string;
  title: string;
  type: "consultation" | "lab_report" | "imaging" | "prescription" | "vaccination" | "surgery" | "other";
  description: string;
  diagnosis?: string;
  treatment?: string;
  notes: string;
  tags: string[];
  priority: "low" | "medium" | "high";
  date: string;
  doctorName: string;
  hospitalName: string;
  status: "active" | "archived";
  isShared: boolean;
  sharedWith: string[];
  files: MedicalFile[];
  createdAt: string;
  updatedAt: string;
}

interface MedicalRecordsProps {
  patientId: string;
  userRole: "patient" | "doctor" | "admin";
}

export default function EnhancedMedicalRecords({ patientId, userRole }: MedicalRecordsProps) {
  const [selectedTab, setSelectedTab] = useState("records");
  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: "1",
      title: "Annual Health Checkup",
      type: "consultation",
      description: "Routine annual health examination with blood work",
      diagnosis: "Overall good health, mild vitamin D deficiency",
      treatment: "Vitamin D supplements recommended",
      notes: "Patient reports feeling well. All vital signs normal.",
      tags: ["annual", "checkup", "routine"],
      priority: "medium",
      date: "2024-01-20T10:30:00Z",
      doctorName: "Dr. Ahmed Rahman",
      hospitalName: "HealthConnect Clinic",
      status: "active",
      isShared: false,
      sharedWith: [],
      files: [
        {
          id: "file1",
          filename: "blood_test_results.pdf",
          fileType: "application/pdf",
          fileSize: "2.3 MB",
          uploadedAt: "2024-01-20T10:30:00Z",
          fileUrl: "/uploads/medical/blood_test_results.pdf"
        }
      ],
      createdAt: "2024-01-20T10:30:00Z",
      updatedAt: "2024-01-20T10:30:00Z"
    },
    {
      id: "2",
      title: "X-Ray Chest",
      type: "imaging",
      description: "Chest X-ray for persistent cough",
      diagnosis: "Clear lungs, no abnormalities detected",
      treatment: "No treatment required",
      notes: "Follow up if cough persists beyond 2 weeks",
      tags: ["x-ray", "chest", "cough"],
      priority: "low",
      date: "2024-01-15T14:20:00Z",
      doctorName: "Dr. Sarah Ahmed",
      hospitalName: "City Medical Center",
      status: "active",
      isShared: true,
      sharedWith: ["Dr. Ahmed Rahman"],
      files: [
        {
          id: "file2",
          filename: "chest_xray.jpg",
          fileType: "image/jpeg",
          fileSize: "1.8 MB",
          uploadedAt: "2024-01-15T14:20:00Z",
          fileUrl: "/uploads/medical/chest_xray.jpg"
        }
      ],
      createdAt: "2024-01-15T14:20:00Z",
      updatedAt: "2024-01-15T14:20:00Z"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [newRecord, setNewRecord] = useState({
    title: "",
    type: "consultation" as const,
    description: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    tags: [] as string[],
    priority: "medium" as const
  });

  const recordTypes = [
    { value: "consultation", label: "Consultation", icon: <Stethoscope className="h-4 w-4" /> },
    { value: "lab_report", label: "Lab Report", icon: <FileText className="h-4 w-4" /> },
    { value: "imaging", label: "Imaging", icon: <ImageIcon className="h-4 w-4" /> },
    { value: "prescription", label: "Prescription", icon: <File className="h-4 w-4" /> },
    { value: "vaccination", label: "Vaccination", icon: <Shield className="h-4 w-4" /> },
    { value: "surgery", label: "Surgery", icon: <Stethoscope className="h-4 w-4" /> },
    { value: "other", label: "Other", icon: <FolderOpen className="h-4 w-4" /> }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "consultation": return "bg-blue-100 text-blue-800";
      case "lab_report": return "bg-green-100 text-green-800";
      case "imaging": return "bg-purple-100 text-purple-800";
      case "prescription": return "bg-orange-100 text-orange-800";
      case "vaccination": return "bg-teal-100 text-teal-800";
      case "surgery": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (fileType === "application/pdf") return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "all" || record.type === filterType;
    const matchesPriority = filterPriority === "all" || record.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const recordStats = {
    total: records.length,
    byType: recordTypes.map(type => ({
      type: type.value,
      label: type.label,
      count: records.filter(r => r.type === type.value).length
    })),
    shared: records.filter(r => r.isShared).length,
    recent: records.filter(r => {
      const recordDate = new Date(r.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return recordDate >= thirtyDaysAgo;
    }).length
  };

  const handleFileUpload = async (file: File, recordId?: string) => {
    setUploadingFile(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newFile: MedicalFile = {
        id: `file_${Date.now()}`,
        filename: file.name,
        fileType: file.type,
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString(),
        fileUrl: `/uploads/medical/${file.name}`
      };

      if (recordId) {
        // Add to existing record
        setRecords(prev => prev.map(record => 
          record.id === recordId 
            ? { ...record, files: [...record.files, newFile] }
            : record
        ));
      } else {
        // Create new record with file
        const newRecord: MedicalRecord = {
          id: `record_${Date.now()}`,
          title: `Uploaded Document - ${file.name}`,
          type: "other",
          description: `Document uploaded by patient`,
          notes: "",
          tags: ["uploaded"],
          priority: "medium",
          date: new Date().toISOString(),
          doctorName: "Patient Upload",
          hospitalName: "Self-uploaded",
          status: "active",
          isShared: false,
          sharedWith: [],
          files: [newFile],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setRecords(prev => [newRecord, ...prev]);
      }
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="h-7 w-7 text-blue-600" />
            Medical Records
          </h2>
          <p className="text-gray-600 mt-1">
            Comprehensive medical history and document management
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          {userRole === "doctor" && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Record
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-blue-600">{recordStats.total}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shared Records</p>
                <p className="text-2xl font-bold text-green-600">{recordStats.shared}</p>
              </div>
              <Share className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent (30 days)</p>
                <p className="text-2xl font-bold text-purple-600">{recordStats.recent}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Most Common</p>
                <p className="text-lg font-bold text-orange-600">
                  {recordStats.byType.sort((a, b) => b.count - a.count)[0]?.label || "N/A"}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="records">📁 Records</TabsTrigger>
          <TabsTrigger value="upload">📤 Upload</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          <TabsTrigger value="sharing">🔗 Sharing</TabsTrigger>
        </TabsList>

        {/* Records List */}
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Medical Records</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {recordTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{record.title}</h3>
                        <p className="text-gray-600 mt-1">{record.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(record.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Stethoscope className="h-4 w-4" />
                            {record.doctorName}
                          </span>
                          <span className="flex items-center gap-1">
                            <File className="h-4 w-4" />
                            {record.files.length} files
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(record.type)}>
                          {recordTypes.find(t => t.value === record.type)?.label}
                        </Badge>
                        <Badge className={getPriorityColor(record.priority)}>
                          {record.priority}
                        </Badge>
                        {record.isShared && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-600">
                            <Share className="h-3 w-3 mr-1" />
                            Shared
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {record.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <div className="flex gap-1">
                          {record.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {record.files.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Files:</h4>
                        <div className="flex gap-2">
                          {record.files.slice(0, 3).map((file) => (
                            <div key={file.id} className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1 text-xs">
                              {getFileIcon(file.fileType)}
                              <span>{file.filename}</span>
                              <span className="text-gray-500">({file.fileSize})</span>
                            </div>
                          ))}
                          {record.files.length > 3 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              +{record.files.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {userRole !== "patient" && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Upload */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Medical Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {uploadingFile ? (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-blue-600 mx-auto animate-pulse" />
                    <div>
                      <h3 className="text-lg font-medium">Uploading...</h3>
                      <p className="text-gray-600">Please wait while we process your file</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-medium">Upload Medical Documents</h3>
                      <p className="text-gray-600">
                        Drag and drop files here, or click to select files
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                      </p>
                    </div>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Records by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recordStats.byType.map((type) => (
                    <div key={type.type} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {recordTypes.find(t => t.value === type.type)?.icon}
                        {type.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(type.count / recordStats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold w-8 text-right">{type.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      {recordTypes.find(t => t.value === record.type)?.icon}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{record.title}</p>
                        <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
                      </div>
                      <Badge className={getTypeColor(record.type)} variant="outline">
                        {recordTypes.find(t => t.value === record.type)?.label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sharing */}
        <TabsContent value="sharing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5" />
                Shared Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.filter(r => r.isShared).map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{record.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Shared with: {record.sharedWith.join(", ")}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(record.date)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Revoke
                        </Button>
                      </div>
                    </div>
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
