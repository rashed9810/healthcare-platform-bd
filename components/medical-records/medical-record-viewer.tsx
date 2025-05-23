"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  Share2, 
  Edit, 
  Save, 
  X, 
  FileText,
  Calendar,
  User,
  Stethoscope,
  Tag,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  MessageSquare,
  Plus
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  notes?: string;
  lastModified?: string;
  modifiedBy?: string;
}

interface Comment {
  id: string;
  author: string;
  authorRole: "doctor" | "patient" | "admin";
  content: string;
  timestamp: string;
  isPrivate: boolean;
}

interface MedicalRecordViewerProps {
  record: MedicalRecord;
  isDoctor?: boolean;
  onClose: () => void;
  onUpdate?: (updatedRecord: MedicalRecord) => void;
  onShare?: (recordId: string, shareWith: string[]) => void;
}

export default function MedicalRecordViewer({ 
  record, 
  isDoctor = false, 
  onClose, 
  onUpdate,
  onShare 
}: MedicalRecordViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState<MedicalRecord>(record);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isPrivateComment, setIsPrivateComment] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Sample comments
  const sampleComments: Comment[] = [
    {
      id: "1",
      author: "ডা. ফাতিমা খান",
      authorRole: "doctor",
      content: "Blood sugar levels are within normal range. Continue current medication.",
      timestamp: "2024-01-16T10:30:00Z",
      isPrivate: false
    },
    {
      id: "2", 
      author: "রহিম আহমেদ",
      authorRole: "patient",
      content: "Feeling much better after following the prescribed diet plan.",
      timestamp: "2024-01-17T14:15:00Z",
      isPrivate: false
    }
  ];

  useState(() => {
    setComments(sampleComments);
  });

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...editedRecord,
        lastModified: new Date().toISOString(),
        modifiedBy: isDoctor ? "Doctor" : "Patient"
      });
    }
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: isDoctor ? "Current Doctor" : "Current Patient",
        authorRole: isDoctor ? "doctor" : "patient",
        content: newComment.trim(),
        timestamp: new Date().toISOString(),
        isPrivate: isPrivateComment
      };
      
      setComments(prev => [...prev, comment]);
      setNewComment("");
      setIsPrivateComment(false);
    }
  };

  const handleShare = () => {
    if (shareEmail && onShare) {
      onShare(record.id, [...record.sharedWith, shareEmail]);
      setShareEmail("");
      setShowShareDialog(false);
    }
  };

  const downloadFile = () => {
    if (record.fileUrl) {
      const link = document.createElement('a');
      link.href = record.fileUrl;
      link.download = record.fileName || `${record.title}.pdf`;
      link.click();
    }
  };

  const getRecordTypeColor = (type: string) => {
    const colors = {
      lab_report: "bg-blue-100 text-blue-800",
      prescription: "bg-green-100 text-green-800",
      imaging: "bg-purple-100 text-purple-800",
      consultation: "bg-orange-100 text-orange-800",
      vaccination: "bg-red-100 text-red-800",
      surgery: "bg-indigo-100 text-indigo-800",
      other: "bg-gray-100 text-gray-800"
    };
    return colors[type as keyof typeof colors] || colors.other;
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

  const getAuthorColor = (role: string) => {
    switch (role) {
      case "doctor": return "text-blue-600";
      case "patient": return "text-green-600";
      case "admin": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Edit Medical Record" : "Medical Record Details"}
              </h2>
              <p className="text-sm text-gray-600">
                {record.hospitalName} • {new Date(record.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                {record.fileUrl && (
                  <Button variant="outline" size="sm" onClick={downloadFile}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
                
                <Button variant="outline" size="sm" onClick={() => setShowShareDialog(true)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                
                {isDoctor && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </>
            )}
            
            {isEditing && (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            )}
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Record Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Record Information</span>
                <div className="flex items-center gap-2">
                  <Badge className={getRecordTypeColor(record.type)}>
                    {record.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge className={getPriorityColor(record.priority)}>
                    {record.priority.toUpperCase()}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editedRecord.title}
                      onChange={(e) => setEditedRecord(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={editedRecord.type}
                      onValueChange={(value) => setEditedRecord(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lab_report">Lab Report</SelectItem>
                        <SelectItem value="prescription">Prescription</SelectItem>
                        <SelectItem value="imaging">Medical Imaging</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="vaccination">Vaccination</SelectItem>
                        <SelectItem value="surgery">Surgery Record</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={editedRecord.priority}
                      onValueChange={(value) => setEditedRecord(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={editedRecord.date}
                      onChange={(e) => setEditedRecord(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editedRecord.description}
                      onChange={(e) => setEditedRecord(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Doctor:</span>
                      <span className="font-medium">{record.doctorName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Hospital:</span>
                      <span className="font-medium">{record.hospitalName}</span>
                    </div>
                    
                    {record.fileName && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">File:</span>
                        <span className="font-medium">{record.fileName} ({record.fileSize})</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">{record.description}</p>
                  </div>
                  
                  {record.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {record.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {record.isShared && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Shared With
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {record.sharedWith.map((person) => (
                          <Badge key={person} className="bg-green-100 text-green-800">
                            {person}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments & Notes ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Comments */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${getAuthorColor(comment.authorRole)}`}>
                          {comment.author}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {comment.authorRole}
                        </Badge>
                        {comment.isPrivate && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
              
              {/* Add New Comment */}
              <div className="border-t pt-4">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a comment or note..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="private-comment"
                        checked={isPrivateComment}
                        onChange={(e) => setIsPrivateComment(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="private-comment" className="text-sm text-gray-600 flex items-center gap-1">
                        {isPrivateComment ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                        Private comment (only visible to doctors)
                      </label>
                    </div>
                    
                    <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share Dialog */}
        {showShareDialog && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Share Medical Record</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Share with (Email)</Label>
                  <Input
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                </div>
                
                <Alert>
                  <AlertDescription>
                    The recipient will receive access to view this medical record and can add comments.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleShare} disabled={!shareEmail}>
                    Share Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
