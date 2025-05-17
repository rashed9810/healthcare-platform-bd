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
import SymptomCheckerForm from "@/components/symptom-checker-form";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AuthProvider } from "@/contexts/auth-context";
import { useI18n } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n";
import ProtectedRoute from "@/components/protected-route";

function SymptomCheckerContent() {
  const { user } = useAuth();
  const { language } = useI18n();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {language === "en" ? "Symptom Checker" : "উপসর্গ পরীক্ষক"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === "en"
                ? "Describe your symptoms and get an assessment of urgency"
                : "আপনার উপসর্গগুলি বর্ণনা করুন এবং জরুরীতার মূল্যায়ন পান"}
            </p>
          </div>

          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">
                {language === "en" ? "Text Input" : "টেক্সট ইনপুট"}
              </TabsTrigger>
              <TabsTrigger value="voice">
                {language === "en" ? "Voice Input" : "ভয়েস ইনপুট"}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "en"
                      ? "Describe Your Symptoms"
                      : "আপনার উপসর্গ বর্ণনা করুন"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "Please provide details about what you're experiencing. You can write in English or Bengali."
                      : "আপনি যা অনুভব করছেন তার বিবরণ দিন। আপনি ইংরেজি বা বাংলায় লিখতে পারেন।"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SymptomCheckerForm initialText={recordingText} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="voice">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "en" ? "Voice Description" : "ভয়েস বর্ণনা"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "Speak about your symptoms. You can speak in English or Bengali."
                      : "আপনার উপসর্গ সম্পর্কে বলুন। আপনি ইংরেজি বা বাংলায় কথা বলতে পারেন।"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-colors ${
                      isRecording ? "bg-red-100 animate-pulse" : "bg-muted"
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
                        {language === "en"
                          ? "Stop Recording"
                          : "রেকর্ডিং বন্ধ করুন"}
                      </>
                    ) : isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {language === "en" ? "Processing..." : "প্রসেসিং..."}
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        {language === "en"
                          ? "Start Recording"
                          : "রেকর্ডিং শুরু করুন"}
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {isRecording
                      ? language === "en"
                        ? "Recording... Speak clearly about your symptoms"
                        : "রেকর্ডিং... আপনার উপসর্গ সম্পর্কে স্পষ্টভাবে বলুন"
                      : isProcessing
                      ? language === "en"
                        ? "Processing your speech..."
                        : "আপনার বক্তব্য প্রসেস করা হচ্ছে..."
                      : recordingText
                      ? language === "en"
                        ? "Recording processed! Switch to Text Input tab to see and edit."
                        : "রেকর্ডিং প্রসেস করা হয়েছে! দেখতে এবং সম্পাদনা করতে টেক্সট ইনপুট ট্যাবে যান।"
                      : language === "en"
                      ? "Click to start recording your voice"
                      : "আপনার কণ্ঠ রেকর্ড করতে ক্লিক করুন"}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function SymptomCheckerPage() {
  return (
    <I18nProvider>
      <AuthProvider>
        <SymptomCheckerContent />
      </AuthProvider>
    </I18nProvider>
  );
}
