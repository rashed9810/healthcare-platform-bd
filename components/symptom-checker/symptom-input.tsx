"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, X, Search, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useI18n } from "@/lib/i18n/i18n-context";
import { BodyPart, SymptomDuration, SymptomInput, SymptomSeverity } from "@/lib/ai/symptom-analyzer";
import { Symptom } from "@/lib/api/types";

interface SymptomInputFormProps {
  onSubmit: (symptoms: SymptomInput[]) => void;
  isLoading?: boolean;
}

export default function SymptomInputForm({ onSubmit, isLoading = false }: SymptomInputFormProps) {
  const { t } = useI18n();
  
  // Mock symptoms data (in a real app, this would come from an API)
  const [availableSymptoms, setAvailableSymptoms] = useState<Symptom[]>([
    { id: "sym_1", name: "Headache", description: "Pain in the head or upper neck" },
    { id: "sym_2", name: "Fever", description: "Elevated body temperature" },
    { id: "sym_3", name: "Cough", description: "Sudden expulsion of air from the lungs" },
    { id: "sym_4", name: "Chest Pain", description: "Discomfort or pain in the chest area" },
    { id: "sym_5", name: "Abdominal Pain", description: "Pain in the stomach or belly area" },
    { id: "sym_6", name: "Back Pain", description: "Pain in the back, from the neck to the tailbone" },
    { id: "sym_7", name: "Rash", description: "Area of irritated or swollen skin" },
    { id: "sym_8", name: "Sore Throat", description: "Pain or irritation in the throat" },
    { id: "sym_9", name: "Fatigue", description: "Feeling of tiredness or exhaustion" },
    { id: "sym_10", name: "Nausea", description: "Feeling of sickness with an inclination to vomit" },
  ]);
  
  // State for search and selected symptoms
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomInput[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState<string | null>(null);
  const [currentBodyPart, setCurrentBodyPart] = useState<BodyPart>(BodyPart.GENERAL);
  const [currentDuration, setCurrentDuration] = useState<SymptomDuration>(SymptomDuration.DAYS);
  const [currentSeverity, setCurrentSeverity] = useState<SymptomSeverity>(SymptomSeverity.MODERATE);
  const [error, setError] = useState<string | null>(null);
  
  // Filter symptoms based on search query
  const filteredSymptoms = availableSymptoms.filter(symptom => 
    symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle symptom selection
  const handleSymptomSelect = (symptomId: string) => {
    const symptom = availableSymptoms.find(s => s.id === symptomId);
    if (symptom) {
      setCurrentSymptom(symptomId);
      
      // Set default body part based on symptom name
      if (symptom.name.toLowerCase().includes("head") || 
          symptom.name.toLowerCase().includes("throat")) {
        setCurrentBodyPart(BodyPart.HEAD);
      } else if (symptom.name.toLowerCase().includes("chest")) {
        setCurrentBodyPart(BodyPart.CHEST);
      } else if (symptom.name.toLowerCase().includes("abdomen") || 
                symptom.name.toLowerCase().includes("stomach")) {
        setCurrentBodyPart(BodyPart.ABDOMEN);
      } else if (symptom.name.toLowerCase().includes("back")) {
        setCurrentBodyPart(BodyPart.BACK);
      } else if (symptom.name.toLowerCase().includes("arm")) {
        setCurrentBodyPart(BodyPart.ARMS);
      } else if (symptom.name.toLowerCase().includes("leg")) {
        setCurrentBodyPart(BodyPart.LEGS);
      } else if (symptom.name.toLowerCase().includes("skin") || 
                symptom.name.toLowerCase().includes("rash")) {
        setCurrentBodyPart(BodyPart.SKIN);
      } else {
        setCurrentBodyPart(BodyPart.GENERAL);
      }
    }
  };
  
  // Add symptom to selected list
  const handleAddSymptom = () => {
    if (!currentSymptom) {
      setError("Please select a symptom");
      return;
    }
    
    const symptom = availableSymptoms.find(s => s.id === currentSymptom);
    if (!symptom) {
      setError("Invalid symptom selected");
      return;
    }
    
    // Check if symptom already added
    if (selectedSymptoms.some(s => s.symptomId === currentSymptom)) {
      setError("This symptom has already been added");
      return;
    }
    
    // Add symptom to selected list
    setSelectedSymptoms([...selectedSymptoms, {
      symptomId: symptom.id,
      name: symptom.name,
      bodyPart: currentBodyPart,
      duration: currentDuration,
      severity: currentSeverity
    }]);
    
    // Reset form
    setCurrentSymptom(null);
    setCurrentBodyPart(BodyPart.GENERAL);
    setCurrentDuration(SymptomDuration.DAYS);
    setCurrentSeverity(SymptomSeverity.MODERATE);
    setSearchQuery("");
    setError(null);
  };
  
  // Remove symptom from selected list
  const handleRemoveSymptom = (symptomId: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.symptomId !== symptomId));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (selectedSymptoms.length === 0) {
      setError("Please add at least one symptom");
      return;
    }
    
    onSubmit(selectedSymptoms);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("symptomChecker.describeYourSymptoms")}</CardTitle>
          <CardDescription>
            {t("symptomChecker.addSymptomsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("common.error")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="symptom-search">{t("symptomChecker.searchSymptoms")}</Label>
              <div className="relative mt-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="symptom-search"
                  placeholder={t("symptomChecker.searchSymptomsPlaceholder")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {searchQuery && (
              <ScrollArea className="h-48 rounded-md border">
                <div className="p-4 space-y-2">
                  {filteredSymptoms.length > 0 ? (
                    filteredSymptoms.map(symptom => (
                      <div
                        key={symptom.id}
                        className={`p-2 rounded-md cursor-pointer hover:bg-muted ${
                          currentSymptom === symptom.id ? "bg-muted" : ""
                        }`}
                        onClick={() => handleSymptomSelect(symptom.id)}
                      >
                        <div className="font-medium">{symptom.name}</div>
                        <div className="text-sm text-muted-foreground">{symptom.description}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      {t("symptomChecker.noSymptomsFound")}
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
            
            {currentSymptom && (
              <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                <div>
                  <Label>{t("symptomChecker.whereIsSymptom")}</Label>
                  <Select
                    value={currentBodyPart}
                    onValueChange={(value) => setCurrentBodyPart(value as BodyPart)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t("symptomChecker.selectBodyPart")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BodyPart.HEAD}>{t("bodyParts.head")}</SelectItem>
                      <SelectItem value={BodyPart.CHEST}>{t("bodyParts.chest")}</SelectItem>
                      <SelectItem value={BodyPart.ABDOMEN}>{t("bodyParts.abdomen")}</SelectItem>
                      <SelectItem value={BodyPart.BACK}>{t("bodyParts.back")}</SelectItem>
                      <SelectItem value={BodyPart.ARMS}>{t("bodyParts.arms")}</SelectItem>
                      <SelectItem value={BodyPart.LEGS}>{t("bodyParts.legs")}</SelectItem>
                      <SelectItem value={BodyPart.SKIN}>{t("bodyParts.skin")}</SelectItem>
                      <SelectItem value={BodyPart.GENERAL}>{t("bodyParts.general")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>{t("symptomChecker.howLong")}</Label>
                  <RadioGroup
                    value={currentDuration}
                    onValueChange={(value) => setCurrentDuration(value as SymptomDuration)}
                    className="grid grid-cols-2 gap-2 mt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={SymptomDuration.HOURS} id="hours" />
                      <Label htmlFor="hours">{t("duration.hours")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={SymptomDuration.DAYS} id="days" />
                      <Label htmlFor="days">{t("duration.days")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={SymptomDuration.WEEKS} id="weeks" />
                      <Label htmlFor="weeks">{t("duration.weeks")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={SymptomDuration.MONTHS} id="months" />
                      <Label htmlFor="months">{t("duration.months")}</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label>{t("symptomChecker.howSevere")}</Label>
                  <RadioGroup
                    value={currentSeverity}
                    onValueChange={(value) => setCurrentSeverity(value as SymptomSeverity)}
                    className="grid grid-cols-3 gap-2 mt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={SymptomSeverity.MILD} id="mild" />
                      <Label htmlFor="mild">{t("severity.mild")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={SymptomSeverity.MODERATE} id="moderate" />
                      <Label htmlFor="moderate">{t("severity.moderate")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={SymptomSeverity.SEVERE} id="severe" />
                      <Label htmlFor="severe">{t("severity.severe")}</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button onClick={handleAddSymptom} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("symptomChecker.addSymptom")}
                </Button>
              </div>
            )}
            
            {selectedSymptoms.length > 0 && (
              <div className="space-y-2">
                <Label>{t("symptomChecker.selectedSymptoms")}</Label>
                <div className="border rounded-md p-4">
                  <div className="space-y-2">
                    {selectedSymptoms.map((symptom) => (
                      <div key={symptom.symptomId} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                        <div>
                          <div className="font-medium">{symptom.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {t(`bodyParts.${symptom.bodyPart}`)} • {t(`duration.${symptom.duration}`)} • {t(`severity.${symptom.severity}`)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSymptom(symptom.symptomId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={selectedSymptoms.length === 0 || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("symptomChecker.analyzing")}
              </>
            ) : (
              t("symptomChecker.analyzeSymptoms")
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
