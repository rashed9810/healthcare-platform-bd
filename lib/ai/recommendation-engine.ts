/**
 * AI Recommendation Engine
 * 
 * This module provides functions for generating intelligent appointment recommendations
 * based on various factors like doctor availability, patient history, and symptom urgency.
 */

import { Doctor, Appointment, Patient, Symptom } from "@/lib/api/types";
import { calculateDistance, Coordinates } from "@/lib/utils/geolocation";

// Urgency levels for symptoms
export enum UrgencyLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  EMERGENCY = "emergency"
}

// Factors that influence appointment recommendations
interface RecommendationFactors {
  patientLocation?: Coordinates;
  preferredDate?: Date;
  preferredTimeOfDay?: "morning" | "afternoon" | "evening";
  symptoms?: Symptom[];
  urgencyLevel?: UrgencyLevel;
  preferredDoctorIds?: string[];
  previousDoctorIds?: string[];
  maxDistance?: number;
  appointmentType?: "video" | "in-person";
}

// Recommendation result
export interface DoctorRecommendation {
  doctor: Doctor;
  score: number;
  availableSlots: {
    date: string;
    time: string;
    score: number;
  }[];
  reasons: string[];
  distance?: number;
}

/**
 * Calculate the urgency level based on symptoms
 * @param symptoms List of symptoms
 * @returns Urgency level
 */
export function calculateUrgencyLevel(symptoms: Symptom[]): UrgencyLevel {
  // This is a simplified implementation
  // In a real system, this would use a more sophisticated algorithm or ML model
  
  // Check for emergency symptoms
  const emergencySymptoms = ["chest pain", "difficulty breathing", "severe bleeding", "unconsciousness"];
  const hasEmergencySymptom = symptoms.some(s => 
    emergencySymptoms.some(es => s.name.toLowerCase().includes(es))
  );
  
  if (hasEmergencySymptom) {
    return UrgencyLevel.EMERGENCY;
  }
  
  // Check for high urgency symptoms
  const highUrgencySymptoms = ["high fever", "severe pain", "broken bone", "deep cut"];
  const hasHighUrgencySymptom = symptoms.some(s => 
    highUrgencySymptoms.some(hus => s.name.toLowerCase().includes(hus))
  );
  
  if (hasHighUrgencySymptom) {
    return UrgencyLevel.HIGH;
  }
  
  // Check for medium urgency symptoms
  const mediumUrgencySymptoms = ["moderate pain", "fever", "persistent cough", "rash"];
  const hasMediumUrgencySymptom = symptoms.some(s => 
    mediumUrgencySymptoms.some(mus => s.name.toLowerCase().includes(mus))
  );
  
  if (hasMediumUrgencySymptom) {
    return UrgencyLevel.MEDIUM;
  }
  
  // Default to low urgency
  return UrgencyLevel.LOW;
}

/**
 * Recommend appropriate specialists based on symptoms
 * @param symptoms List of symptoms
 * @returns List of recommended specialties
 */
export function recommendSpecialties(symptoms: Symptom[]): string[] {
  // This is a simplified implementation
  // In a real system, this would use a more sophisticated algorithm or ML model
  
  const specialtyMap: Record<string, string[]> = {
    "headache": ["Neurologist", "General Physician"],
    "migraine": ["Neurologist"],
    "chest pain": ["Cardiologist", "Pulmonologist"],
    "heart palpitations": ["Cardiologist"],
    "shortness of breath": ["Pulmonologist", "Cardiologist"],
    "cough": ["Pulmonologist", "General Physician"],
    "fever": ["General Physician", "Infectious Disease Specialist"],
    "sore throat": ["ENT Specialist", "General Physician"],
    "ear pain": ["ENT Specialist"],
    "vision problems": ["Ophthalmologist"],
    "skin rash": ["Dermatologist"],
    "joint pain": ["Orthopedic Surgeon", "Rheumatologist"],
    "back pain": ["Orthopedic Surgeon", "Neurologist", "Physiotherapist"],
    "stomach pain": ["Gastroenterologist", "General Physician"],
    "nausea": ["Gastroenterologist", "General Physician"],
    "diarrhea": ["Gastroenterologist", "General Physician"],
    "urinary problems": ["Urologist", "Nephrologist"],
    "mental health": ["Psychiatrist", "Psychologist"],
    "anxiety": ["Psychiatrist", "Psychologist"],
    "depression": ["Psychiatrist", "Psychologist"],
    "pregnancy": ["Gynecologist", "Obstetrician"],
    "menstrual problems": ["Gynecologist"],
    "diabetes": ["Endocrinologist", "General Physician"],
    "thyroid": ["Endocrinologist"],
    "allergies": ["Allergist", "Immunologist"],
    "cancer": ["Oncologist"],
  };
  
  // Collect all specialties that match the symptoms
  const specialties = new Set<string>();
  
  symptoms.forEach(symptom => {
    // Check for exact matches
    const matchedSpecialties = specialtyMap[symptom.name.toLowerCase()];
    if (matchedSpecialties) {
      matchedSpecialties.forEach(s => specialties.add(s));
    } else {
      // Check for partial matches
      Object.entries(specialtyMap).forEach(([key, values]) => {
        if (symptom.name.toLowerCase().includes(key) || key.includes(symptom.name.toLowerCase())) {
          values.forEach(s => specialties.add(s));
        }
      });
    }
  });
  
  // If no specialties matched, recommend General Physician
  if (specialties.size === 0) {
    specialties.add("General Physician");
  }
  
  return Array.from(specialties);
}

/**
 * Generate doctor recommendations based on various factors
 * @param doctors List of available doctors
 * @param factors Recommendation factors
 * @returns Sorted list of doctor recommendations
 */
export function recommendDoctors(
  doctors: Doctor[],
  factors: RecommendationFactors
): DoctorRecommendation[] {
  // Filter doctors based on specialty if symptoms are provided
  let filteredDoctors = doctors;
  
  if (factors.symptoms && factors.symptoms.length > 0) {
    const recommendedSpecialties = recommendSpecialties(factors.symptoms);
    filteredDoctors = doctors.filter(doctor => 
      recommendedSpecialties.includes(doctor.specialty)
    );
    
    // If no doctors match the specialties, fall back to all doctors
    if (filteredDoctors.length === 0) {
      filteredDoctors = doctors;
    }
  }
  
  // Calculate scores for each doctor
  const recommendations: DoctorRecommendation[] = filteredDoctors.map(doctor => {
    let score = 0;
    const reasons: string[] = [];
    
    // Factor: Distance
    let distance: number | undefined = undefined;
    if (factors.patientLocation && doctor.location?.coordinates) {
      distance = calculateDistance(factors.patientLocation, doctor.location.coordinates);
      
      // Apply distance scoring
      if (distance <= 2) {
        score += 20;
        reasons.push("Very close to your location");
      } else if (distance <= 5) {
        score += 15;
        reasons.push("Close to your location");
      } else if (distance <= 10) {
        score += 10;
        reasons.push("Reasonable distance from your location");
      } else if (distance <= 20) {
        score += 5;
      }
      
      // Filter out doctors beyond max distance
      if (factors.maxDistance && distance > factors.maxDistance) {
        score -= 50;
      }
    }
    
    // Factor: Rating
    if (doctor.rating) {
      if (doctor.rating >= 4.5) {
        score += 15;
        reasons.push("Highly rated doctor");
      } else if (doctor.rating >= 4.0) {
        score += 10;
        reasons.push("Well-rated doctor");
      } else if (doctor.rating >= 3.5) {
        score += 5;
      }
    }
    
    // Factor: Experience
    if (doctor.experience) {
      if (doctor.experience >= 10) {
        score += 15;
        reasons.push("Very experienced doctor");
      } else if (doctor.experience >= 5) {
        score += 10;
        reasons.push("Experienced doctor");
      } else {
        score += 5;
      }
    }
    
    // Factor: Preferred doctors
    if (factors.preferredDoctorIds?.includes(doctor.id)) {
      score += 25;
      reasons.push("You've selected this doctor as preferred");
    }
    
    // Factor: Previous doctors
    if (factors.previousDoctorIds?.includes(doctor.id)) {
      score += 20;
      reasons.push("You've consulted with this doctor before");
    }
    
    // Factor: Appointment type
    if (factors.appointmentType === "video" && doctor.availableForVideo) {
      score += 10;
      reasons.push("Available for video consultation");
    } else if (factors.appointmentType === "in-person") {
      score += 5;
    }
    
    // Calculate available slots with scores
    const availableSlots = getRecommendedTimeSlots(doctor, factors);
    
    return {
      doctor,
      score,
      availableSlots,
      reasons,
      distance
    };
  });
  
  // Sort recommendations by score (descending)
  return recommendations.sort((a, b) => b.score - a.score);
}

/**
 * Get recommended time slots for a doctor
 * @param doctor Doctor to check
 * @param factors Recommendation factors
 * @returns Sorted list of available slots with scores
 */
function getRecommendedTimeSlots(
  doctor: Doctor,
  factors: RecommendationFactors
): { date: string; time: string; score: number }[] {
  // This is a simplified implementation
  // In a real system, this would check the doctor's actual availability
  
  // Mock available slots
  const availableSlots: { date: string; time: string; score: number }[] = [];
  
  // Generate dates for the next 7 days
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Format date as YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate time slots
    const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
    
    timeSlots.forEach(time => {
      let score = 0;
      
      // Factor: Preferred date
      if (factors.preferredDate) {
        const preferredDateStr = factors.preferredDate.toISOString().split('T')[0];
        if (dateStr === preferredDateStr) {
          score += 20;
        } else {
          // Score decreases as we move away from preferred date
          const daysDiff = Math.abs(date.getTime() - factors.preferredDate.getTime()) / (1000 * 60 * 60 * 24);
          score -= Math.min(daysDiff * 2, 10);
        }
      }
      
      // Factor: Preferred time of day
      const hour = parseInt(time.split(':')[0]);
      if (factors.preferredTimeOfDay === "morning" && hour < 12) {
        score += 10;
      } else if (factors.preferredTimeOfDay === "afternoon" && hour >= 12 && hour < 15) {
        score += 10;
      } else if (factors.preferredTimeOfDay === "evening" && hour >= 15) {
        score += 10;
      }
      
      // Factor: Urgency level
      if (factors.urgencyLevel === UrgencyLevel.HIGH || factors.urgencyLevel === UrgencyLevel.EMERGENCY) {
        // For high urgency, prefer earlier slots
        if (i === 0) {
          score += 30;
        } else if (i === 1) {
          score += 20;
        } else if (i === 2) {
          score += 10;
        }
      } else if (factors.urgencyLevel === UrgencyLevel.MEDIUM) {
        // For medium urgency, prefer slots within 3 days
        if (i < 3) {
          score += 15;
        }
      }
      
      availableSlots.push({ date: dateStr, time, score });
    });
  }
  
  // Sort slots by score (descending)
  return availableSlots.sort((a, b) => b.score - a.score);
}
