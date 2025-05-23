"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertCircle, 
  AlertTriangle, 
  Clock, 
  Activity, 
  User, 
  Heart, 
  Stethoscope, 
  Calendar, 
  ArrowRight, 
  BrainCircuit,
  CheckCircle2,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/i18n-context";
import { 
  HealthRecommendation, 
  PossibleCondition, 
  SymptomAnalysisResult, 
  UrgencyLevel 
} from "@/lib/ai/symptom-analyzer";

interface AnalysisResultsProps {
  results: SymptomAnalysisResult;
  onReset: () => void;
}

export default function AnalysisResults({ results, onReset }: AnalysisResultsProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("conditions");
  
  // Get urgency level color and text
  const getUrgencyColor = (urgency: UrgencyLevel): string => {
    switch (urgency) {
      case UrgencyLevel.EMERGENCY:
        return "text-destructive";
      case UrgencyLevel.HIGH:
        return "text-orange-500";
      case UrgencyLevel.MEDIUM:
        return "text-amber-500";
      case UrgencyLevel.LOW:
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };
  
  const getUrgencyBgColor = (urgency: UrgencyLevel): string => {
    switch (urgency) {
      case UrgencyLevel.EMERGENCY:
        return "bg-destructive/10";
      case UrgencyLevel.HIGH:
        return "bg-orange-500/10";
      case UrgencyLevel.MEDIUM:
        return "bg-amber-500/10";
      case UrgencyLevel.LOW:
        return "bg-green-500/10";
      default:
        return "bg-muted";
    }
  };
  
  const getUrgencyText = (urgency: UrgencyLevel): string => {
    switch (urgency) {
      case UrgencyLevel.EMERGENCY:
        return t("urgency.emergency");
      case UrgencyLevel.HIGH:
        return t("urgency.high");
      case UrgencyLevel.MEDIUM:
        return t("urgency.medium");
      case UrgencyLevel.LOW:
        return t("urgency.low");
      default:
        return t("urgency.unknown");
    }
  };
  
  // Handle booking appointment
  const handleBookAppointment = () => {
    // Redirect to find doctor page with specialties as query params
    const specialties = results.recommendedSpecialties.join(",");
    router.push(`/find-doctor?specialties=${specialties}`);
  };
  
  // Handle smart booking
  const handleSmartBooking = () => {
    // Redirect to AI scheduler with symptoms as query params
    const symptomIds = results.possibleConditions
      .flatMap(condition => condition.symptoms)
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
      .map(symptom => `sym_${symptom.toLowerCase().replace(/\s+/g, '_')}`)
      .join(",");
    
    router.push(`/book-appointment/smart?symptoms=${symptomIds}`);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("symptomChecker.analysisResults")}</CardTitle>
              <CardDescription>
                {t("symptomChecker.analysisResultsDescription")}
              </CardDescription>
            </div>
            <Badge 
              className={`${getUrgencyBgColor(results.urgencyLevel)} ${getUrgencyColor(results.urgencyLevel)}`}
            >
              {getUrgencyText(results.urgencyLevel)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {results.urgencyLevel === UrgencyLevel.EMERGENCY && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("symptomChecker.emergencyWarning")}</AlertTitle>
              <AlertDescription>
                {t("symptomChecker.emergencyWarningDescription")}
              </AlertDescription>
            </Alert>
          )}
          
          {results.urgencyLevel === UrgencyLevel.HIGH && (
            <Alert variant="warning" className="mb-6 border-orange-500 text-orange-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t("symptomChecker.urgentWarning")}</AlertTitle>
              <AlertDescription>
                {t("symptomChecker.urgentWarningDescription")}
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="conditions" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="conditions">{t("symptomChecker.possibleConditions")}</TabsTrigger>
              <TabsTrigger value="recommendations">{t("symptomChecker.recommendations")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="conditions" className="space-y-4 mt-4">
              {results.possibleConditions.length > 0 ? (
                <div className="space-y-4">
                  {results.possibleConditions.map((condition, index) => (
                    <ConditionCard key={index} condition={condition} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {t("symptomChecker.noConditionsFound")}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-4 mt-4">
              {results.recommendations.length > 0 ? (
                <div className="space-y-4">
                  {results.recommendations.map((recommendation, index) => (
                    <RecommendationCard key={index} recommendation={recommendation} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {t("symptomChecker.noRecommendationsFound")}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <div className="flex flex-col sm:flex-row w-full gap-3">
            {activeTab === "conditions" && (
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => setActiveTab("recommendations")}
              >
                {t("symptomChecker.viewRecommendations")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {activeTab === "recommendations" && (
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => setActiveTab("conditions")}
              >
                {t("symptomChecker.viewConditions")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={onReset}
            >
              {t("symptomChecker.checkDifferentSymptoms")}
            </Button>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex flex-col sm:flex-row w-full gap-3">
            <Button 
              className="w-full sm:flex-1"
              onClick={handleBookAppointment}
            >
              <Stethoscope className="mr-2 h-4 w-4" />
              {t("symptomChecker.findSpecialist")}
            </Button>
            
            <Button 
              variant="secondary"
              className="w-full sm:flex-1"
              onClick={handleSmartBooking}
            >
              <BrainCircuit className="mr-2 h-4 w-4" />
              {t("symptomChecker.useAiScheduler")}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Component for displaying a possible condition
function ConditionCard({ condition }: { condition: PossibleCondition }) {
  const { t } = useI18n();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{condition.name}</CardTitle>
          <Badge variant="outline" className="ml-2">
            {condition.probability}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">{t("symptomChecker.matchProbability")}</span>
            <span className="font-medium">{condition.probability}%</span>
          </div>
          <Progress value={condition.probability} className="h-2" />
        </div>
        
        <p className="text-sm text-muted-foreground">{condition.description}</p>
        
        <div>
          <h4 className="text-sm font-medium mb-1">{t("symptomChecker.matchedSymptoms")}</h4>
          <div className="flex flex-wrap gap-1">
            {condition.symptoms.map((symptom, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {symptom}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-1">{t("symptomChecker.recommendedSpecialties")}</h4>
          <div className="flex flex-wrap gap-1">
            {condition.specialties.map((specialty, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for displaying a health recommendation
function RecommendationCard({ recommendation }: { recommendation: HealthRecommendation }) {
  const { t } = useI18n();
  
  // Get icon based on recommendation type
  const getIcon = () => {
    switch (recommendation.type) {
      case "emergency":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "specialist":
        return <Stethoscope className="h-5 w-5 text-primary" />;
      case "self-care":
        return <Heart className="h-5 w-5 text-green-500" />;
      case "general":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  // Get title based on recommendation type
  const getTitle = () => {
    switch (recommendation.type) {
      case "emergency":
        return t("symptomChecker.seekEmergencyCare");
      case "specialist":
        return t("symptomChecker.consultSpecialist");
      case "self-care":
        return t("symptomChecker.selfCare");
      case "general":
        return t("symptomChecker.generalAdvice");
      default:
        return t("symptomChecker.recommendation");
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <CardTitle className="text-lg">{getTitle()}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{recommendation.description}</p>
        
        {recommendation.timeframe && (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {t("symptomChecker.timeframe")}: <span className="font-medium">{recommendation.timeframe}</span>
            </span>
          </div>
        )}
        
        {recommendation.specialties && recommendation.specialties.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">{t("symptomChecker.recommendedSpecialties")}</h4>
            <div className="flex flex-wrap gap-1">
              {recommendation.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {recommendation.selfCareSteps && recommendation.selfCareSteps.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">{t("symptomChecker.selfCareSteps")}</h4>
            <ul className="space-y-1">
              {recommendation.selfCareSteps.map((step, index) => (
                <li key={index} className="text-sm flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
