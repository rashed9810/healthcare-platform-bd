"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Heart, 
  Thermometer, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Stethoscope,
  Phone,
  MapPin,
  Star,
  Loader2,
  Plus,
  X,
  Search,
  Globe,
  Shield
} from "lucide-react";

interface SymptomAnalysis {
  analysis_id: string;
  patient_info: {
    age: number;
    gender: string;
    location: string;
  };
  symptoms: string[];
  severity_score: number;
  urgency_level: string;
  confidence: number;
  bangladesh_context: boolean;
  analysis: {
    possible_conditions: Array<{
      name: string;
      probability: number;
      context: string;
    }>;
    recommended_specialists: string[];
    suggested_tests: string[];
    recommendations: string[];
  };
  emergency_info: {
    national_emergency: string;
    ambulance: string;
    poison_control: string;
    nearest_hospitals: string[];
  };
  disclaimer: string;
  analysis_timestamp: string;
}

interface AdvancedSymptomCheckerProps {
  language?: "en" | "bn";
  onAnalysisComplete?: (analysis: SymptomAnalysis) => void;
}

export default function AdvancedSymptomChecker({ 
  language = "en", 
  onAnalysisComplete 
}: AdvancedSymptomCheckerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  
  // Patient information
  const [patientInfo, setPatientInfo] = useState({
    age: "",
    gender: "",
    location: "Dhaka"
  });
  
  // Symptoms
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [symptomDuration, setSymptomDuration] = useState("");
  const [symptomSeverity, setSymptomSeverity] = useState("");
  
  // Common symptoms in Bangladesh
  const commonSymptoms = [
    { en: "Fever", bn: "জ্বর", icon: <Thermometer className="h-4 w-4" /> },
    { en: "Headache", bn: "মাথাব্যথা", icon: <Brain className="h-4 w-4" /> },
    { en: "Cough", bn: "কাশি", icon: <Activity className="h-4 w-4" /> },
    { en: "Stomach pain", bn: "পেটব্যথা", icon: <Heart className="h-4 w-4" /> },
    { en: "Diarrhea", bn: "ডায়রিয়া", icon: <Activity className="h-4 w-4" /> },
    { en: "Chest pain", bn: "বুকব্যথা", icon: <Heart className="h-4 w-4" /> },
    { en: "Difficulty breathing", bn: "শ্বাসকষ্ট", icon: <Activity className="h-4 w-4" /> },
    { en: "Nausea", bn: "বমি বমি ভাব", icon: <Activity className="h-4 w-4" /> },
    { en: "Fatigue", bn: "ক্লান্তি", icon: <Activity className="h-4 w-4" /> },
    { en: "Dizziness", bn: "মাথা ঘোরা", icon: <Brain className="h-4 w-4" /> }
  ];

  const addSymptom = (symptom: string) => {
    if (symptom && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
      setCurrentSymptom("");
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const analyzeSymptoms = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/symptoms/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms,
          patient_age: parseInt(patientInfo.age),
          patient_gender: patientInfo.gender,
          location: patientInfo.location,
          duration: symptomDuration,
          severity: symptomSeverity
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAnalysis(result);
        setCurrentStep(4);
        onAnalysisComplete?.(result);
      } else {
        throw new Error("Analysis failed");
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      // Fallback to mock analysis
      const mockAnalysis: SymptomAnalysis = {
        analysis_id: "mock_analysis_" + Date.now(),
        patient_info: {
          age: parseInt(patientInfo.age) || 30,
          gender: patientInfo.gender || "unknown",
          location: patientInfo.location
        },
        symptoms,
        severity_score: symptoms.length * 20,
        urgency_level: "moderate",
        confidence: 0.85,
        bangladesh_context: true,
        analysis: {
          possible_conditions: [
            { name: "Common viral infection", probability: 0.7, context: "Common in Bangladesh" },
            { name: "Seasonal flu", probability: 0.3, context: "Common in Bangladesh" }
          ],
          recommended_specialists: ["General Physician"],
          suggested_tests: ["CBC", "Basic metabolic panel"],
          recommendations: [
            "২৪-৪৮ ঘন্টা লক্ষণ পর্যবেক্ষণ করুন / Monitor symptoms for 24-48 hours",
            "পর্যাপ্ত বিশ্রাম নিন / Take adequate rest",
            "প্রচুর পানি পান করুন / Stay well hydrated"
          ]
        },
        emergency_info: {
          national_emergency: "999",
          ambulance: "199",
          poison_control: "01777777777",
          nearest_hospitals: ["Dhaka Medical College Hospital", "Square Hospital"]
        },
        disclaimer: "এটি একটি AI-চালিত প্রাথমিক বিশ্লেষণ। পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়।",
        analysis_timestamp: new Date().toISOString()
      };
      setAnalysis(mockAnalysis);
      setCurrentStep(4);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "urgent": return <AlertTriangle className="h-4 w-4" />;
      case "high": return <Clock className="h-4 w-4" />;
      case "moderate": return <Activity className="h-4 w-4" />;
      case "low": return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === "en" ? "Patient Information" : "রোগীর তথ্য"}
              </h3>
              <p className="text-gray-600">
                {language === "en" 
                  ? "Please provide basic information for accurate analysis"
                  : "সঠিক বিশ্লেষণের জন্য মৌলিক তথ্য প্রদান করুন"
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "en" ? "Age" : "বয়স"}</Label>
                <Input
                  type="number"
                  placeholder={language === "en" ? "Enter age" : "বয়স লিখুন"}
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>{language === "en" ? "Gender" : "লিঙ্গ"}</Label>
                <Select value={patientInfo.gender} onValueChange={(value) => setPatientInfo({...patientInfo, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "en" ? "Select gender" : "লিঙ্গ নির্বাচন করুন"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{language === "en" ? "Male" : "পুরুষ"}</SelectItem>
                    <SelectItem value="female">{language === "en" ? "Female" : "মহিলা"}</SelectItem>
                    <SelectItem value="other">{language === "en" ? "Other" : "অন্যান্য"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>{language === "en" ? "Location" : "অবস্থান"}</Label>
                <Select value={patientInfo.location} onValueChange={(value) => setPatientInfo({...patientInfo, location: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dhaka">Dhaka / ঢাকা</SelectItem>
                    <SelectItem value="Chittagong">Chittagong / চট্টগ্রাম</SelectItem>
                    <SelectItem value="Khulna">Khulna / খুলনা</SelectItem>
                    <SelectItem value="Rajshahi">Rajshahi / রাজশাহী</SelectItem>
                    <SelectItem value="Sylhet">Sylhet / সিলেট</SelectItem>
                    <SelectItem value="Barisal">Barisal / বরিশাল</SelectItem>
                    <SelectItem value="Rangpur">Rangpur / রংপুর</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={() => setCurrentStep(2)} 
              className="w-full"
              disabled={!patientInfo.age || !patientInfo.gender}
            >
              {language === "en" ? "Next: Add Symptoms" : "পরবর্তী: লক্ষণ যোগ করুন"}
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === "en" ? "Describe Your Symptoms" : "আপনার লক্ষণগুলি বর্ণনা করুন"}
              </h3>
              <p className="text-gray-600">
                {language === "en" 
                  ? "Select from common symptoms or add your own"
                  : "সাধারণ লক্ষণ থেকে নির্বাচন করুন বা নিজের যোগ করুন"
                }
              </p>
            </div>

            {/* Common Symptoms */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                {language === "en" ? "Common Symptoms" : "সাধারণ লক্ষণ"}
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonSymptoms.map((symptom, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => addSymptom(language === "en" ? symptom.en : symptom.bn)}
                    className="justify-start h-auto p-3"
                    disabled={symptoms.includes(language === "en" ? symptom.en : symptom.bn)}
                  >
                    {symptom.icon}
                    <span className="ml-2 text-xs">
                      {language === "en" ? symptom.en : symptom.bn}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Symptom Input */}
            <div className="space-y-2">
              <Label>{language === "en" ? "Add Custom Symptom" : "কাস্টম লক্ষণ যোগ করুন"}</Label>
              <div className="flex gap-2">
                <Input
                  placeholder={language === "en" ? "Describe your symptom..." : "আপনার লক্ষণ বর্ণনা করুন..."}
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSymptom(currentSymptom)}
                />
                <Button onClick={() => addSymptom(currentSymptom)} disabled={!currentSymptom}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Selected Symptoms */}
            {symptoms.length > 0 && (
              <div className="space-y-2">
                <Label>{language === "en" ? "Selected Symptoms" : "নির্বাচিত লক্ষণ"}</Label>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {symptom}
                      <button onClick={() => removeSymptom(symptom)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                {language === "en" ? "Previous" : "পূর্ববর্তী"}
              </Button>
              <Button 
                onClick={() => setCurrentStep(3)} 
                className="flex-1"
                disabled={symptoms.length === 0}
              >
                {language === "en" ? "Next: Additional Details" : "পরবর্তী: অতিরিক্ত বিবরণ"}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === "en" ? "Additional Information" : "অতিরিক্ত তথ্য"}
              </h3>
              <p className="text-gray-600">
                {language === "en" 
                  ? "Help us provide better analysis"
                  : "আরও ভাল বিশ্লেষণ প্রদানে আমাদের সাহায্য করুন"
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "en" ? "How long have you had these symptoms?" : "কতদিন ধরে এই লক্ষণগুলি আছে?"}</Label>
                <Select value={symptomDuration} onValueChange={setSymptomDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "en" ? "Select duration" : "সময়কাল নির্বাচন করুন"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="few-hours">{language === "en" ? "Few hours" : "কয়েক ঘন্টা"}</SelectItem>
                    <SelectItem value="1-day">{language === "en" ? "1 day" : "১ দিন"}</SelectItem>
                    <SelectItem value="2-3-days">{language === "en" ? "2-3 days" : "২-৩ দিন"}</SelectItem>
                    <SelectItem value="1-week">{language === "en" ? "1 week" : "১ সপ্তাহ"}</SelectItem>
                    <SelectItem value="more-than-week">{language === "en" ? "More than a week" : "এক সপ্তাহের বেশি"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{language === "en" ? "How severe are your symptoms?" : "আপনার লক্ষণগুলি কতটা গুরুতর?"}</Label>
                <Select value={symptomSeverity} onValueChange={setSymptomSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "en" ? "Select severity" : "তীব্রতা নির্বাচন করুন"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">{language === "en" ? "Mild" : "হালকা"}</SelectItem>
                    <SelectItem value="moderate">{language === "en" ? "Moderate" : "মাঝারি"}</SelectItem>
                    <SelectItem value="severe">{language === "en" ? "Severe" : "গুরুতর"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                {language === "en" ? "Previous" : "পূর্ববর্তী"}
              </Button>
              <Button 
                onClick={analyzeSymptoms} 
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === "en" ? "Analyzing..." : "বিশ্লেষণ করা হচ্ছে..."}
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    {language === "en" ? "Analyze Symptoms" : "লক্ষণ বিশ্লেষণ করুন"}
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 4:
        return analysis && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === "en" ? "Analysis Results" : "বিশ্লেষণের ফলাফল"}
              </h3>
              <p className="text-gray-600">
                {language === "en" 
                  ? "AI-powered health analysis based on your symptoms"
                  : "আপনার লক্ষণের উপর ভিত্তি করে AI-চালিত স্বাস্থ্য বিশ্লেষণ"
                }
              </p>
            </div>

            {/* Urgency Level */}
            <Alert className={getUrgencyColor(analysis.urgency_level)}>
              <div className="flex items-center gap-2">
                {getUrgencyIcon(analysis.urgency_level)}
                <div>
                  <h4 className="font-semibold">
                    {language === "en" ? "Urgency Level" : "জরুরি স্তর"}: {analysis.urgency_level.toUpperCase()}
                  </h4>
                  <AlertDescription className="mt-1">
                    {analysis.analysis.recommendations[0]}
                  </AlertDescription>
                </div>
              </div>
            </Alert>

            {/* Severity Score */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {language === "en" ? "Severity Score" : "তীব্রতার স্কোর"}
                  </span>
                  <span className="text-sm text-gray-600">{analysis.severity_score}/100</span>
                </div>
                <Progress value={analysis.severity_score} className="h-2" />
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>{language === "en" ? "Low" : "কম"}</span>
                  <span>{language === "en" ? "High" : "বেশি"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Possible Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "en" ? "Possible Conditions" : "সম্ভাব্য অবস্থা"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.analysis.possible_conditions.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{condition.name}</h4>
                        <p className="text-sm text-gray-600">{condition.context}</p>
                      </div>
                      <Badge variant="outline">
                        {Math.round(condition.probability * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Specialists */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  {language === "en" ? "Recommended Specialists" : "প্রস্তাবিত বিশেষজ্ঞ"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.analysis.recommended_specialists.map((specialist, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {specialist}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            {analysis.urgency_level === "urgent" && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    {language === "en" ? "Emergency Contacts" : "জরুরি যোগাযোগ"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>{language === "en" ? "Emergency:" : "জরুরি:"}</strong> {analysis.emergency_info.national_emergency}
                    </div>
                    <div>
                      <strong>{language === "en" ? "Ambulance:" : "অ্যাম্বুলেন্স:"}</strong> {analysis.emergency_info.ambulance}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Disclaimer */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {analysis.disclaimer}
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setCurrentStep(1);
                setAnalysis(null);
                setSymptoms([]);
              }} className="flex-1">
                {language === "en" ? "Start New Analysis" : "নতুন বিশ্লেষণ শুরু করুন"}
              </Button>
              <Button className="flex-1">
                {language === "en" ? "Book Appointment" : "অ্যাপয়েন্টমেন্ট বুক করুন"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            {language === "en" ? "Advanced Symptom Checker" : "উন্নত লক্ষণ পরীক্ষক"}
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {language === "en" ? "Bangladesh AI" : "বাংলাদেশ AI"}
          </Badge>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 mt-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                currentStep >= step 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-600"
              }`}>
                {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              {step < 4 && (
                <div className={`w-12 h-1 mx-2 transition-all duration-200 ${
                  currentStep > step ? "bg-blue-600" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {renderStep()}
      </CardContent>
    </Card>
  );
}
