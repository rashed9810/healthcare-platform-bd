"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { analyzeSymptoms } from "@/lib/api/symptoms";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/i18n-context";

interface SymptomCheckerFormProps {
  initialText?: string;
}

export default function SymptomCheckerForm({
  initialText = "",
}: SymptomCheckerFormProps) {
  const router = useRouter();
  const { language, t } = useI18n();
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
      setError(t("symptomChecker.pleaseDescribeSymptoms"));
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
      setError(t("symptomChecker.analysisError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="symptoms">
          {t("symptomChecker.symptomsDescription")}
        </Label>
        <Textarea
          id="symptoms"
          placeholder={t("symptomChecker.symptomsPlaceholder")}
          className="min-h-[150px]"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          disabled={isSubmitting}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="space-y-2">
        <Label>{t("symptomChecker.symptomDuration")}</Label>
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
            <Label htmlFor="today">{t("symptomChecker.startedToday")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="days" id="days" />
            <Label htmlFor="days">{t("symptomChecker.fewDays")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weeks" id="weeks" />
            <Label htmlFor="weeks">{t("symptomChecker.fewWeeks")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="months" id="months" />
            <Label htmlFor="months">{t("symptomChecker.monthOrLonger")}</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>{t("symptomChecker.symptomSeverity")}</Label>
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
            <Label htmlFor="mild">{t("symptomChecker.mild")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="moderate" />
            <Label htmlFor="moderate">{t("symptomChecker.moderate")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe" id="severe" />
            <Label htmlFor="severe">{t("symptomChecker.severe")}</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("symptomChecker.analyzing")}
          </>
        ) : (
          t("symptomChecker.analyzeSymptoms")
        )}
      </Button>
    </form>
  );
}
