"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Activity, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Stethoscope
} from 'lucide-react';
import BackendStatus from '@/components/python-backend/backend-status';
import { pythonBackendService, SymptomAnalysisResult, AppointmentEnhancementResult } from '@/lib/services/python-backend-service';

export default function PythonBackendTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [symptomAnalysisResult, setSymptomAnalysisResult] = useState<SymptomAnalysisResult | null>(null);
  const [appointmentResult, setAppointmentResult] = useState<AppointmentEnhancementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Symptom analysis form state
  const [symptoms, setSymptoms] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');

  // Appointment form state
  const [patientId, setPatientId] = useState('patient_123');
  const [doctorId, setDoctorId] = useState('doctor_456');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentSymptoms, setAppointmentSymptoms] = useState('');

  const handleSymptomAnalysis = async () => {
    if (!symptoms.trim()) {
      setError('Please enter symptoms');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await pythonBackendService.analyzeSymptoms({
        symptoms: symptoms.split(',').map(s => s.trim()),
        patient_age: patientAge ? parseInt(patientAge) : undefined,
        patient_gender: patientGender || undefined,
      });

      if (response.success) {
        setSymptomAnalysisResult(response.data);
      } else {
        setError('Analysis failed');
      }
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointmentEnhancement = async () => {
    if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
      setError('Please fill in all appointment fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await pythonBackendService.enhanceAppointment({
        patient_id: patientId,
        doctor_id: doctorId,
        preferred_date: appointmentDate,
        preferred_time: appointmentTime,
        symptoms: appointmentSymptoms ? appointmentSymptoms.split(',').map(s => s.trim()) : undefined,
      });

      if (response.success) {
        setAppointmentResult(response.data);
      } else {
        setError('Enhancement failed');
      }
    } catch (err: any) {
      setError(err.message || 'Enhancement failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getEmergencyLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Python Backend Integration Test</h1>
        <p className="text-gray-600">
          Test the integration between Next.js frontend and Python FastAPI backend
        </p>
      </div>

      <Tabs defaultValue="status" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">Backend Status</TabsTrigger>
          <TabsTrigger value="symptoms">Symptom Analysis</TabsTrigger>
          <TabsTrigger value="appointments">Appointment Enhancement</TabsTrigger>
          <TabsTrigger value="integration">Full Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <BackendStatus />
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                AI Symptom Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="symptoms">Symptoms (comma-separated)</Label>
                <Textarea
                  id="symptoms"
                  placeholder="e.g., fever, headache, cough"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Patient Age (optional)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="30"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="gender">Gender (optional)</Label>
                  <Input
                    id="gender"
                    placeholder="male/female/other"
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSymptomAnalysis} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                Analyze Symptoms
              </Button>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {symptomAnalysisResult && (
                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Confidence:</span>
                      <Badge>{Math.round(symptomAnalysisResult.confidence * 100)}%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Emergency Level:</span>
                      <Badge className={getEmergencyLevelColor(symptomAnalysisResult.emergency_level)}>
                        {symptomAnalysisResult.emergency_level.toUpperCase()}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Possible Conditions:</h4>
                      <div className="space-y-2">
                        {symptomAnalysisResult.possible_conditions.map((condition, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                            <span>{condition.name}</span>
                            <Badge variant="outline">
                              {Math.round(condition.probability * 100)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {symptomAnalysisResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                AI Appointment Enhancement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="doctorId">Doctor ID</Label>
                  <Input
                    id="doctorId"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="appointmentSymptoms">Symptoms (optional)</Label>
                <Textarea
                  id="appointmentSymptoms"
                  placeholder="e.g., fever, headache, cough"
                  value={appointmentSymptoms}
                  onChange={(e) => setAppointmentSymptoms(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleAppointmentEnhancement} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Activity className="h-4 w-4 mr-2" />
                )}
                Enhance Appointment
              </Button>

              {appointmentResult && (
                <Card className="bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Enhancement Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">AI Priority Score:</span>
                      <Badge>{Math.round(appointmentResult.ai_priority_score * 100)}%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Recommended Urgency:</span>
                      <Badge className={getEmergencyLevelColor(appointmentResult.recommended_urgency)}>
                        {appointmentResult.recommended_urgency.toUpperCase()}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">AI Insights:</h4>
                      <ul className="space-y-1">
                        {appointmentResult.ai_insights.map((insight, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {appointmentResult.symptom_analysis && (
                      <div className="bg-white p-3 rounded">
                        <h4 className="font-medium mb-2">Symptom Analysis:</h4>
                        <div className="text-sm space-y-1">
                          <div>Symptoms Count: {appointmentResult.symptom_analysis.symptoms_count}</div>
                          <div>Emergency Level: {appointmentResult.symptom_analysis.emergency_level}</div>
                          <div>Confidence: {Math.round(appointmentResult.symptom_analysis.confidence * 100)}%</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>Full Integration Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Brain className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">Complete AI-Enhanced Booking</h3>
                <p className="text-gray-600 mb-4">
                  This will demonstrate the full integration between Next.js and Python backend
                  for AI-enhanced appointment booking with symptom analysis.
                </p>
                <Button size="lg">
                  Coming Soon - Full Integration Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
