"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { analyzeSymptoms } from "@/lib/api/symptoms";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface SymptomCheckerFormProps {
  initialText?: string;
}

export default function SymptomCheckerForm({
  initialText = "",
}: SymptomCheckerFormProps) {
  const router = useRouter();
  const { language } = useI18n();
  const [symptoms, setSymptoms] = useState(initialText);
  const [duration, setDuration] = useState<
    "today" | "days" | "weeks" | "months"
  >("days");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">(
    "moderate"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!symptoms.trim()) {
      setError(
        language === "en"
          ? "Please describe your symptoms"
          : "অনুগ্রহ করে আপনার উপসর্গ বর্ণনা করুন"
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await analyzeSymptoms({
        symptoms,
        duration,
        severity,
      });

      // Store result in localStorage for the results page
      if (isClient) {
        localStorage.setItem("symptomAnalysis", JSON.stringify(result));
      }

      // Navigate to results page
      router.push("/symptom-checker/results");
    } catch (err) {
      console.error("Error analyzing symptoms:", err);
      setError(
        language === "en"
          ? "Failed to analyze symptoms. Please try again."
          : "উপসর্গ বিশ্লেষণ করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="symptoms">
          {language === "en" ? "Symptoms Description" : "উপসর্গের বিবরণ"}
        </Label>
        <Textarea
          id="symptoms"
          placeholder={
            language === "en"
              ? "Describe your symptoms in detail. For example: I have been experiencing headache and fever for the last two days."
              : "আপনার উপসর্গের বিস্তারিত বর্ণনা করুন। উদাহরণস্বরূপ: আমি গত দুই দিন ধরে মাথাব্যথা এবং জ্বর অনুভব করছি।"
          }
          className="min-h-[150px]"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          disabled={isSubmitting}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="space-y-2">
        <Label>
          {language === "en"
            ? "How long have you been experiencing these symptoms?"
            : "আপনি কতদিন ধরে এই উপসর্গগুলি অনুভব করছেন?"}
        </Label>
        <RadioGroup
          value={duration}
          onValueChange={(value) =>
            setDuration(value as "today" | "days" | "weeks" | "months")
          }
          className="flex flex-col space-y-1"
          disabled={isSubmitting}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="today" id="today" />
            <Label htmlFor="today">
              {language === "en" ? "Started today" : "আজ শুরু হয়েছে"}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="days" id="days" />
            <Label htmlFor="days">
              {language === "en" ? "Few days" : "কয়েক দিন"}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weeks" id="weeks" />
            <Label htmlFor="weeks">
              {language === "en" ? "Few weeks" : "কয়েক সপ্তাহ"}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="months" id="months" />
            <Label htmlFor="months">
              {language === "en"
                ? "Few months or longer"
                : "কয়েক মাস বা তার বেশি"}
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>
          {language === "en"
            ? "How severe are your symptoms?"
            : "আপনার উপসর্গ কতটা তীব্র?"}
        </Label>
        <RadioGroup
          value={severity}
          onValueChange={(value) =>
            setSeverity(value as "mild" | "moderate" | "severe")
          }
          className="flex flex-col space-y-1"
          disabled={isSubmitting}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mild" id="mild" />
            <Label htmlFor="mild">
              {language === "en"
                ? "Mild - Noticeable but not interfering with daily activities"
                : "হালকা - লক্ষণীয় কিন্তু দৈনন্দিন কাজে বাধা দেয় না"}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="moderate" />
            <Label htmlFor="moderate">
              {language === "en"
                ? "Moderate - Affecting some daily activities"
                : "মাঝারি - কিছু দৈনন্দিন কাজে প্রভাব ফেলে"}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe" id="severe" />
            <Label htmlFor="severe">
              {language === "en"
                ? "Severe - Significantly impacting daily life"
                : "তীব্র - দৈনন্দিন জীবনে উল্লেখযোগ্য প্রভাব ফেলে"}
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {language === "en" ? "Analyzing..." : "বিশ্লেষণ করা হচ্ছে..."}
          </>
        ) : language === "en" ? (
          "Analyze Symptoms"
        ) : (
          "উপসর্গ বিশ্লেষণ করুন"
        )}
      </Button>
    </form>
  );
}
