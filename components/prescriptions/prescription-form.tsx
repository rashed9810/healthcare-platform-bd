"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  Pill, 
  AlertTriangle,
  Calendar,
  User,
  Stethoscope,
  FileText,
  Clock
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
  sideEffects: string[];
}

interface PrescriptionFormData {
  patientId: string;
  patientName: string;
  patientAge: string;
  patientGender: "male" | "female" | "other";
  diagnosis: string;
  medications: Medication[];
  notes: string;
  followUpDate: string;
  emergencyContact: string;
}

interface PrescriptionFormProps {
  appointmentId?: string;
  patientData?: {
    id: string;
    name: string;
    age: string;
    gender: "male" | "female" | "other";
  };
  onSave: (prescription: PrescriptionFormData) => void;
  onCancel: () => void;
}

const commonMedications = [
  { name: "Paracetamol 500mg", type: "tablet", commonDosage: "500mg", commonFrequency: "3 times daily" },
  { name: "Amoxicillin 500mg", type: "tablet", commonDosage: "500mg", commonFrequency: "3 times daily" },
  { name: "Omeprazole 20mg", type: "tablet", commonDosage: "20mg", commonFrequency: "Once daily" },
  { name: "Cetirizine 10mg", type: "tablet", commonDosage: "10mg", commonFrequency: "Once daily" },
  { name: "Metformin 500mg", type: "tablet", commonDosage: "500mg", commonFrequency: "Twice daily" },
  { name: "Salbutamol Inhaler", type: "drops", commonDosage: "2 puffs", commonFrequency: "As needed" },
  { name: "Cough Syrup", type: "syrup", commonDosage: "10ml", commonFrequency: "3 times daily" },
];

const frequencyOptions = [
  "Once daily",
  "Twice daily", 
  "3 times daily",
  "4 times daily",
  "Every 6 hours",
  "Every 8 hours",
  "Every 12 hours",
  "As needed",
  "Before meals",
  "After meals",
  "At bedtime"
];

const durationOptions = [
  "3 days",
  "5 days", 
  "7 days",
  "10 days",
  "14 days",
  "21 days",
  "1 month",
  "2 months",
  "3 months",
  "Until finished",
  "As needed"
];

export default function PrescriptionForm({ appointmentId, patientData, onSave, onCancel }: PrescriptionFormProps) {
  const [formData, setFormData] = useState<PrescriptionFormData>({
    patientId: patientData?.id || "",
    patientName: patientData?.name || "",
    patientAge: patientData?.age || "",
    patientGender: patientData?.gender || "male",
    diagnosis: "",
    medications: [],
    notes: "",
    followUpDate: "",
    emergencyContact: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      type: "tablet",
      beforeFood: false,
      sideEffects: []
    };
    
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, newMedication]
    }));
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map(med => 
        med.id === id ? { ...med, ...updates } : med
      )
    }));
  };

  const removeMedication = (id: string) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter(med => med.id !== id)
    }));
  };

  const selectCommonMedication = (medId: string, commonMed: typeof commonMedications[0]) => {
    updateMedication(medId, {
      name: commonMed.name,
      type: commonMed.type as any,
      dosage: commonMed.commonDosage,
      frequency: commonMed.commonFrequency
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = "Diagnosis is required";
    }

    if (formData.medications.length === 0) {
      newErrors.medications = "At least one medication is required";
    }

    formData.medications.forEach((med, index) => {
      if (!med.name.trim()) {
        newErrors[`medication_${index}_name`] = "Medication name is required";
      }
      if (!med.dosage.trim()) {
        newErrors[`medication_${index}_dosage`] = "Dosage is required";
      }
      if (!med.frequency.trim()) {
        newErrors[`medication_${index}_frequency`] = "Frequency is required";
      }
      if (!med.duration.trim()) {
        newErrors[`medication_${index}_duration`] = "Duration is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(formData);
    } catch (error) {
      console.error("Failed to save prescription:", error);
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Create New Prescription
          </CardTitle>
          <p className="text-gray-600">Fill in the patient details and medication information</p>
        </CardHeader>
      </Card>

      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                placeholder="Enter patient name"
                className={errors.patientName ? "border-red-500" : ""}
              />
              {errors.patientName && (
                <p className="text-sm text-red-500">{errors.patientName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientAge">Age</Label>
              <Input
                id="patientAge"
                value={formData.patientAge}
                onChange={(e) => setFormData(prev => ({ ...prev, patientAge: e.target.value }))}
                placeholder="Enter age"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientGender">Gender</Label>
              <Select
                value={formData.patientGender}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, patientGender: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="Phone number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Diagnosis & Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Primary Diagnosis *</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              placeholder="Enter primary diagnosis"
              rows={3}
              className={errors.diagnosis ? "border-red-500" : ""}
            />
            {errors.diagnosis && (
              <p className="text-sm text-red-500">{errors.diagnosis}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional instructions, lifestyle recommendations, etc."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpDate">Follow-up Date</Label>
            <Input
              id="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Medications */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medications ({formData.medications.length})
            </CardTitle>
            <Button onClick={addMedication} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors.medications && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errors.medications}</AlertDescription>
            </Alert>
          )}

          {formData.medications.map((medication, index) => (
            <Card key={medication.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Medication {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedication(medication.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Select Common Medications */}
                <div className="space-y-2">
                  <Label>Quick Select (Optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonMedications.map((commonMed, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => selectCommonMedication(medication.id, commonMed)}
                        className="text-xs"
                      >
                        {getMedicationIcon(commonMed.type)} {commonMed.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Medication Name *</Label>
                    <Input
                      value={medication.name}
                      onChange={(e) => updateMedication(medication.id, { name: e.target.value })}
                      placeholder="e.g., Paracetamol 500mg"
                      className={errors[`medication_${index}_name`] ? "border-red-500" : ""}
                    />
                    {errors[`medication_${index}_name`] && (
                      <p className="text-sm text-red-500">{errors[`medication_${index}_name`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={medication.type}
                      onValueChange={(value: any) => updateMedication(medication.id, { type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tablet">💊 Tablet</SelectItem>
                        <SelectItem value="syrup">🍯 Syrup</SelectItem>
                        <SelectItem value="injection">💉 Injection</SelectItem>
                        <SelectItem value="cream">🧴 Cream</SelectItem>
                        <SelectItem value="drops">💧 Drops</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Dosage *</Label>
                    <Input
                      value={medication.dosage}
                      onChange={(e) => updateMedication(medication.id, { dosage: e.target.value })}
                      placeholder="e.g., 500mg, 10ml"
                      className={errors[`medication_${index}_dosage`] ? "border-red-500" : ""}
                    />
                    {errors[`medication_${index}_dosage`] && (
                      <p className="text-sm text-red-500">{errors[`medication_${index}_dosage`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency *</Label>
                    <Select
                      value={medication.frequency}
                      onValueChange={(value) => updateMedication(medication.id, { frequency: value })}
                    >
                      <SelectTrigger className={errors[`medication_${index}_frequency`] ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((freq) => (
                          <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[`medication_${index}_frequency`] && (
                      <p className="text-sm text-red-500">{errors[`medication_${index}_frequency`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Duration *</Label>
                    <Select
                      value={medication.duration}
                      onValueChange={(value) => updateMedication(medication.id, { duration: value })}
                    >
                      <SelectTrigger className={errors[`medication_${index}_duration`] ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((duration) => (
                          <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[`medication_${index}_duration`] && (
                      <p className="text-sm text-red-500">{errors[`medication_${index}_duration`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`beforeFood-${medication.id}`}
                        checked={medication.beforeFood}
                        onCheckedChange={(checked) => updateMedication(medication.id, { beforeFood: checked })}
                      />
                      <Label htmlFor={`beforeFood-${medication.id}`}>Take before food</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Special Instructions</Label>
                  <Textarea
                    value={medication.instructions}
                    onChange={(e) => updateMedication(medication.id, { instructions: e.target.value })}
                    placeholder="Special instructions for this medication"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {formData.medications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Pill className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No medications added yet</p>
              <p className="text-sm">Click "Add Medication" to start</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Prescription
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
