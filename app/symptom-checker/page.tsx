"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Mic,
  MicOff,
  Loader2,
  AlertCircle,
  BrainCircuit,
  Stethoscope,
  ArrowLeft,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/i18n-context";
import SymptomCheckerForm from "@/components/symptom-checker-form";
import SymptomInputForm from "@/components/symptom-checker/symptom-input";
import AnalysisResults from "@/components/symptom-checker/analysis-results";
import {
  SymptomInput,
  analyzeSymptoms,
  SymptomAnalysisResult,
} from "@/lib/ai/symptom-analyzer";

function SymptomCheckerContent() {
  const { t } = useI18n();

  // State for symptom analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] =
    useState<SymptomAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State for voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle symptom analysis
  const handleAnalyzeSymptoms = async (symptoms: SymptomInput[]) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use the local function with a timeout to simulate API call
      setTimeout(() => {
        const results = analyzeSymptoms(symptoms);
        setAnalysisResults(results);
        setIsAnalyzing(false);
      }, 2000);
    } catch (err) {
      console.error("Error analyzing symptoms:", err);
      setError("Failed to analyze symptoms. Please try again.");
      setIsAnalyzing(false);
    }
  };

  // Reset analysis
  const handleReset = () => {
    setAnalysisResults(null);
    setError(null);
  };

  // Function to handle voice recording
  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        setIsRecording(true);

        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // In a real app, you would implement speech-to-text here
        // For now, we'll simulate it with a timeout
        setTimeout(() => {
          setIsRecording(false);
          setIsProcessing(true);

          // Simulate processing
          setTimeout(() => {
            setIsProcessing(false);
            setRecordingText(
              "I have been experiencing headache and fever for the last two days. The pain is moderate and gets worse at night."
            );
          }, 2000);
        }, 3000);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setIsRecording(false);
        alert(
          "Could not access microphone. Please check your device permissions."
        );
      }
    } else {
      // Stop recording
      setIsRecording(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          className="mr-4"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("symptomChecker.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("symptomChecker.subtitle")}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("common.error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6">
        {!analysisResults ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center">
                  <BrainCircuit className="h-5 w-5 text-primary mr-2" />
                  <CardTitle>{t("symptomChecker.howItWorks")}</CardTitle>
                </div>
                <CardDescription>
                  {t("symptomChecker.howItWorksDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      1
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium">
                        {t("symptomChecker.step1Title")}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("symptomChecker.step1Description")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      2
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium">
                        {t("symptomChecker.step2Title")}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("symptomChecker.step2Description")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      3
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium">
                        {t("symptomChecker.step3Title")}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("symptomChecker.step3Description")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("symptomChecker.disclaimer")}</AlertTitle>
              <AlertDescription>
                {t("symptomChecker.disclaimerText")}
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="advanced" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="advanced">
                  {t("symptomChecker.advancedAnalysis")}
                </TabsTrigger>
                <TabsTrigger value="basic">
                  {t("symptomChecker.basicAnalysis")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="advanced" className="mt-4">
                <SymptomInputForm
                  onSubmit={handleAnalyzeSymptoms}
                  isLoading={isAnalyzing}
                />
              </TabsContent>

              <TabsContent value="basic" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("symptomChecker.describeYourSymptoms")}
                    </CardTitle>
                    <CardDescription>
                      {t("symptomChecker.basicAnalysisDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="text" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="text">
                          {t("symptomChecker.textInput")}
                        </TabsTrigger>
                        <TabsTrigger value="voice">
                          {t("symptomChecker.voiceInput")}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="text" className="mt-4">
                        <SymptomCheckerForm initialText={recordingText} />
                      </TabsContent>

                      <TabsContent value="voice" className="mt-4">
                        <div className="flex flex-col items-center justify-center py-10">
                          <div
                            className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-colors ${
                              isRecording
                                ? "bg-red-100 animate-pulse"
                                : "bg-muted"
                            }`}
                          >
                            {isProcessing ? (
                              <Loader2 className="h-12 w-12 animate-spin" />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`h-12 w-12 ${
                                  isRecording ? "text-red-500" : ""
                                }`}
                              >
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" x2="12" y1="19" y2="22" />
                              </svg>
                            )}
                          </div>
                          <Button
                            size="lg"
                            className="mb-2"
                            onClick={toggleRecording}
                            disabled={isProcessing}
                            variant={isRecording ? "destructive" : "default"}
                          >
                            {isRecording ? (
                              <>
                                <MicOff className="mr-2 h-4 w-4" />
                                {t("symptomChecker.stopRecording")}
                              </>
                            ) : isProcessing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("common.processing")}
                              </>
                            ) : (
                              <>
                                <Mic className="mr-2 h-4 w-4" />
                                {t("symptomChecker.startRecording")}
                              </>
                            )}
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            {isRecording
                              ? t("symptomChecker.recordingInstructions")
                              : isProcessing
                              ? t("symptomChecker.processingVoice")
                              : recordingText
                              ? t("symptomChecker.recordingProcessed")
                              : t("symptomChecker.clickToStartRecording")}
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <AnalysisResults results={analysisResults} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default function SymptomCheckerPage() {
  return <SymptomCheckerContent />;
}
