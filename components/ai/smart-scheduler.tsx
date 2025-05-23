"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Loader2, Calendar as CalendarIcon, Clock, MapPin, Star, Award, Video, User, Check, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n/i18n-context";
import { Doctor, Symptom } from "@/lib/api/types";
import { DoctorRecommendation, recommendDoctors, UrgencyLevel } from "@/lib/ai/recommendation-engine";
import { Coordinates, getUserLocation, formatDistance } from "@/lib/utils/geolocation";
import DistanceBadge from "@/components/map/distance-badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SmartSchedulerProps {
  doctors: Doctor[];
  symptoms?: Symptom[];
  patientId?: string;
  onSchedule: (doctorId: string, date: string, time: string, type: "video" | "in-person") => void;
  className?: string;
}

export default function SmartScheduler({
  doctors,
  symptoms = [],
  patientId,
  onSchedule,
  className,
}: SmartSchedulerProps) {
  const { t } = useI18n();
  const router = useRouter();
  
  // State for user preferences
  const [patientLocation, setPatientLocation] = useState<Coordinates | undefined>(undefined);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [preferredDate, setPreferredDate] = useState<Date | undefined>(undefined);
  const [preferredTimeOfDay, setPreferredTimeOfDay] = useState<"morning" | "afternoon" | "evening" | undefined>(undefined);
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.MEDIUM);
  const [appointmentType, setAppointmentType] = useState<"video" | "in-person">("in-person");
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [recommendations, setRecommendations] = useState<DoctorRecommendation[]>([]);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<DoctorRecommendation | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  
  // Get user location
  const handleGetLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await getUserLocation();
      setPatientLocation(location);
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setIsLoadingLocation(false);
    }
  };
  
  // Generate recommendations based on user preferences
  const generateRecommendations = () => {
    setIsGeneratingRecommendations(true);
    
    // Simulate API delay
    setTimeout(() => {
      const recommendations = recommendDoctors(doctors, {
        patientLocation,
        preferredDate,
        preferredTimeOfDay,
        symptoms,
        urgencyLevel,
        appointmentType,
        maxDistance,
        // In a real app, these would come from the patient's history
        previousDoctorIds: [],
        preferredDoctorIds: [],
      });
      
      setRecommendations(recommendations);
      setIsGeneratingRecommendations(false);
      
      // Auto-select the top recommendation
      if (recommendations.length > 0) {
        setSelectedRecommendation(recommendations[0]);
      }
    }, 1500);
  };
  
  // Handle slot selection
  const handleSlotSelect = (date: string, time: string) => {
    setSelectedSlot({ date, time });
  };
  
  // Handle scheduling
  const handleSchedule = () => {
    if (selectedRecommendation && selectedSlot) {
      onSchedule(
        selectedRecommendation.doctor.id,
        selectedSlot.date,
        selectedSlot.time,
        appointmentType
      );
    }
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>{t("appointment.aiScheduler")}</CardTitle>
          <CardDescription>
            {t("appointment.aiSchedulerDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preferences">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preferences">{t("appointment.preferences")}</TabsTrigger>
              <TabsTrigger value="recommendations" disabled={recommendations.length === 0 && !isGeneratingRecommendations}>
                {t("appointment.recommendations")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">{t("appointment.whenDoYouNeedToSeeDoctor")}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>{t("appointment.preferredDate")}</Label>
                      <div className="mt-2">
                        <Calendar
                          mode="single"
                          selected={preferredDate}
                          onSelect={setPreferredDate}
                          disabled={(date) => date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>{t("appointment.preferredTimeOfDay")}</Label>
                        <RadioGroup
                          value={preferredTimeOfDay}
                          onValueChange={(value) => setPreferredTimeOfDay(value as any)}
                          className="mt-2 space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="morning" id="morning" />
                            <Label htmlFor="morning">{t("appointment.morning")} (9:00 - 12:00)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="afternoon" id="afternoon" />
                            <Label htmlFor="afternoon">{t("appointment.afternoon")} (12:00 - 15:00)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="evening" id="evening" />
                            <Label htmlFor="evening">{t("appointment.evening")} (15:00 - 18:00)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <Label>{t("appointment.urgencyLevel")}</Label>
                        <RadioGroup
                          value={urgencyLevel}
                          onValueChange={(value) => setUrgencyLevel(value as UrgencyLevel)}
                          className="mt-2 space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={UrgencyLevel.LOW} id="low" />
                            <Label htmlFor="low">{t("appointment.lowUrgency")}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={UrgencyLevel.MEDIUM} id="medium" />
                            <Label htmlFor="medium">{t("appointment.mediumUrgency")}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={UrgencyLevel.HIGH} id="high" />
                            <Label htmlFor="high">{t("appointment.highUrgency")}</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">{t("appointment.appointmentType")}</h3>
                  <RadioGroup
                    value={appointmentType}
                    onValueChange={(value) => setAppointmentType(value as "video" | "in-person")}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:border-primary",
                      appointmentType === "in-person" && "border-primary bg-primary/5"
                    )}>
                      <RadioGroupItem value="in-person" id="in-person" className="sr-only" />
                      <User className="mb-3 h-6 w-6" />
                      <Label htmlFor="in-person" className="text-center">
                        {t("appointment.inPersonVisit")}
                      </Label>
                    </div>
                    <div className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:border-primary",
                      appointmentType === "video" && "border-primary bg-primary/5"
                    )}>
                      <RadioGroupItem value="video" id="video" className="sr-only" />
                      <Video className="mb-3 h-6 w-6" />
                      <Label htmlFor="video" className="text-center">
                        {t("appointment.videoConsultation")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {appointmentType === "in-person" && (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <Label>{t("location.maxDistance")}</Label>
                      <span className="text-sm font-medium">{maxDistance} km</span>
                    </div>
                    <Slider
                      value={[maxDistance]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) => setMaxDistance(value[0])}
                    />
                    
                    <div className="flex items-center justify-between">
                      <Label>{t("location.yourLocation")}</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGetLocation}
                        disabled={isLoadingLocation}
                      >
                        {isLoadingLocation ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <MapPin className="mr-2 h-4 w-4" />
                        )}
                        {patientLocation ? t("location.updateLocation") : t("location.useMyLocation")}
                      </Button>
                    </div>
                    {patientLocation && (
                      <div className="text-sm text-muted-foreground">
                        <Check className="inline-block h-4 w-4 text-green-500 mr-1" />
                        {t("location.locationDetected")}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <Button
                className="w-full mt-6"
                onClick={generateRecommendations}
                disabled={isGeneratingRecommendations || (appointmentType === "in-person" && !patientLocation)}
              >
                {isGeneratingRecommendations && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("appointment.findBestAppointments")}
              </Button>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-4 mt-4">
              {isGeneratingRecommendations ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-center text-muted-foreground">
                    {t("appointment.generatingRecommendations")}
                  </p>
                </div>
              ) : recommendations.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 space-y-4">
                    <h3 className="font-medium">{t("appointment.recommendedDoctors")}</h3>
                    <div className="space-y-3">
                      {recommendations.slice(0, 5).map((recommendation) => (
                        <div
                          key={recommendation.doctor.id}
                          className={cn(
                            "flex items-start p-3 rounded-lg border cursor-pointer hover:border-primary transition-colors",
                            selectedRecommendation?.doctor.id === recommendation.doctor.id && "border-primary bg-primary/5"
                          )}
                          onClick={() => setSelectedRecommendation(recommendation)}
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{recommendation.doctor.name}</h4>
                            <p className="text-sm text-muted-foreground">{recommendation.doctor.specialty}</p>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge variant="outline" className="text-xs">
                                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                {recommendation.doctor.rating}
                              </Badge>
                              {recommendation.distance !== undefined && (
                                <DistanceBadge distance={recommendation.distance} size="sm" />
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            <Badge>{recommendation.score}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    {selectedRecommendation ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{selectedRecommendation.doctor.name}</h3>
                            <p className="text-muted-foreground">{selectedRecommendation.doctor.specialty}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {selectedRecommendation.doctor.rating}
                            </Badge>
                            <Badge variant="outline" className="flex items-center">
                              <Award className="h-3 w-3 mr-1 text-blue-500" />
                              {selectedRecommendation.doctor.experience} {t("doctor.years")}
                            </Badge>
                          </div>
                        </div>
                        
                        {selectedRecommendation.reasons.length > 0 && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center text-sm font-medium mb-2">
                              <Info className="h-4 w-4 mr-1 text-primary" />
                              {t("appointment.whyRecommended")}
                            </div>
                            <ul className="space-y-1 text-sm">
                              {selectedRecommendation.reasons.map((reason, index) => (
                                <li key={index} className="flex items-start">
                                  <Check className="h-4 w-4 mr-1 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-medium mb-2">{t("appointment.recommendedSlots")}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {selectedRecommendation.availableSlots.slice(0, 8).map((slot, index) => (
                              <div
                                key={`${slot.date}-${slot.time}-${index}`}
                                className={cn(
                                  "flex flex-col items-center p-2 rounded-md border cursor-pointer hover:border-primary transition-colors",
                                  selectedSlot?.date === slot.date && selectedSlot?.time === slot.time && "border-primary bg-primary/5"
                                )}
                                onClick={() => handleSlotSelect(slot.date, slot.time)}
                              >
                                <div className="flex items-center text-sm">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  {format(new Date(slot.date), "MMM d")}
                                </div>
                                <div className="flex items-center text-sm mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {slot.time}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button
                          className="w-full mt-4"
                          disabled={!selectedSlot}
                          onClick={handleSchedule}
                        >
                          {t("appointment.bookAppointment")}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-12">
                        <p className="text-center text-muted-foreground">
                          {t("appointment.selectDoctorFromList")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-center text-muted-foreground">
                    {t("appointment.noRecommendationsFound")}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => generateRecommendations()}
                  >
                    {t("appointment.tryAgain")}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
