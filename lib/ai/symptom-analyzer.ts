/**
 * Symptom Analyzer
 * 
 * This module provides functions for analyzing symptoms and generating health recommendations.
 * It uses a rule-based approach to predict possible conditions and recommend appropriate actions.
 * 
 * Note: This is a simplified implementation for demonstration purposes.
 * In a production environment, this would be replaced with a more sophisticated
 * machine learning model or integration with a medical API.
 */

import { Symptom } from "@/lib/api/types";
import { UrgencyLevel } from "@/lib/ai/recommendation-engine";

// Body parts for symptom localization
export enum BodyPart {
  HEAD = "head",
  CHEST = "chest",
  ABDOMEN = "abdomen",
  BACK = "back",
  ARMS = "arms",
  LEGS = "legs",
  SKIN = "skin",
  GENERAL = "general"
}

// Symptom duration options
export enum SymptomDuration {
  HOURS = "hours",
  DAYS = "days",
  WEEKS = "weeks",
  MONTHS = "months"
}

// Symptom severity levels
export enum SymptomSeverity {
  MILD = "mild",
  MODERATE = "moderate",
  SEVERE = "severe"
}

// Symptom input from user
export interface SymptomInput {
  symptomId: string;
  name: string;
  bodyPart: BodyPart;
  duration: SymptomDuration;
  severity: SymptomSeverity;
}

// Possible medical condition
export interface PossibleCondition {
  name: string;
  probability: number; // 0-100
  description: string;
  symptoms: string[];
  urgency: UrgencyLevel;
  specialties: string[];
}

// Health recommendation
export interface HealthRecommendation {
  type: "specialist" | "self-care" | "emergency" | "general";
  description: string;
  urgency: UrgencyLevel;
  specialties?: string[];
  timeframe?: string;
  selfCareSteps?: string[];
}

// Analysis result
export interface SymptomAnalysisResult {
  possibleConditions: PossibleCondition[];
  recommendations: HealthRecommendation[];
  urgencyLevel: UrgencyLevel;
  recommendedSpecialties: string[];
}

/**
 * Database of common symptoms and their associated conditions
 * This is a simplified dataset for demonstration purposes
 */
const symptomConditionMap: Record<string, {
  conditions: Array<{
    name: string;
    probability: number;
    description: string;
    urgency: UrgencyLevel;
    specialties: string[];
  }>;
  bodyParts: BodyPart[];
}> = {
  "headache": {
    conditions: [
      {
        name: "Tension Headache",
        probability: 70,
        description: "Common headache with mild to moderate pain, often described as feeling like a tight band around the head.",
        urgency: UrgencyLevel.LOW,
        specialties: ["General Physician", "Neurologist"]
      },
      {
        name: "Migraine",
        probability: 40,
        description: "Recurring headaches that cause moderate to severe throbbing pain, often on one side of the head.",
        urgency: UrgencyLevel.MEDIUM,
        specialties: ["Neurologist"]
      },
      {
        name: "Sinusitis",
        probability: 30,
        description: "Inflammation of the sinuses, causing pain and pressure in the face, head, and behind the eyes.",
        urgency: UrgencyLevel.LOW,
        specialties: ["ENT Specialist", "General Physician"]
      },
      {
        name: "Meningitis",
        probability: 5,
        description: "Inflammation of the membranes surrounding the brain and spinal cord, causing severe headache, stiff neck, and fever.",
        urgency: UrgencyLevel.HIGH,
        specialties: ["Infectious Disease Specialist", "Neurologist"]
      }
    ],
    bodyParts: [BodyPart.HEAD]
  },
  "fever": {
    conditions: [
      {
        name: "Common Cold",
        probability: 60,
        description: "Viral infection causing mild fever, runny nose, sore throat, and cough.",
        urgency: UrgencyLevel.LOW,
        specialties: ["General Physician"]
      },
      {
        name: "Influenza",
        probability: 50,
        description: "Viral infection causing high fever, body aches, fatigue, and respiratory symptoms.",
        urgency: UrgencyLevel.MEDIUM,
        specialties: ["General Physician", "Infectious Disease Specialist"]
      },
      {
        name: "COVID-19",
        probability: 40,
        description: "Viral infection causing fever, cough, shortness of breath, and loss of taste or smell.",
        urgency: UrgencyLevel.MEDIUM,
        specialties: ["General Physician", "Infectious Disease Specialist", "Pulmonologist"]
      },
      {
        name: "Urinary Tract Infection",
        probability: 20,
        description: "Bacterial infection of the urinary tract causing fever, frequent urination, and pain during urination.",
        urgency: UrgencyLevel.MEDIUM,
        specialties: ["General Physician", "Urologist"]
      }
    ],
    bodyParts: [BodyPart.GENERAL]
  },
  "cough": {
    conditions: [
      {
        name: "Common Cold",
        probability: 70,
        description: "Viral infection causing cough, runny nose, sore throat, and mild fever.",
        urgency: UrgencyLevel.LOW,
        specialties: ["General Physician"]
      },
      {
        name: "Bronchitis",
        probability: 40,
        description: "Inflammation of the bronchial tubes causing cough with mucus, chest discomfort, and fatigue.",
        urgency: UrgencyLevel.MEDIUM,
        specialties: ["General Physician", "Pulmonologist"]
      },
      {
        name: "Asthma",
        probability: 30,
        description: "Chronic condition causing cough, wheezing, shortness of breath, and chest tightness.",
        urgency: UrgencyLevel.MEDIUM,
        specialties: ["Pulmonologist", "Allergist"]
      },
      {
        name: "Pneumonia",
        probability: 20,
        description: "Infection causing inflammation of the air sacs in the lungs, with symptoms including cough, fever, and difficulty breathing.",
        urgency: UrgencyLevel.HIGH,
        specialties: ["Pulmonologist", "Infectious Disease Specialist"]
      }
    ],
    bodyParts: [BodyPart.CHEST]
  },
  "chest pain": {
    conditions: [
      {
        name: "Muscle Strain",
        probability: 40,
        description: "Pain caused by strained chest muscles, often worsened by movement or breathing.",
        urgency: UrgencyLevel.LOW,
        specialties: ["General Physician"]
      },
      {
        name: "Acid Reflux",
        probability: 35,
        description: "Burning pain in the chest caused by stomach acid flowing back into the esophagus.",
        urgency: UrgencyLevel.LOW,
        specialties: ["Gastroenterologist", "General Physician"]
      },
      {
        name: "Angina",
        probability: 25,
        description: "Chest pain caused by reduced blood flow to the heart muscle, often described as pressure or squeezing.",
        urgency: UrgencyLevel.HIGH,
        specialties: ["Cardiologist"]
      },
      {
        name: "Heart Attack",
        probability: 15,
        description: "Severe chest pain, often radiating to the arm, jaw, or back, caused by blocked blood flow to the heart.",
        urgency: UrgencyLevel.EMERGENCY,
        specialties: ["Cardiologist", "Emergency Medicine"]
      }
    ],
    bodyParts: [BodyPart.CHEST]
  },
  "abdominal pain": {
    conditions: [
      {
        name: "Gastritis",
        probability: 50,
        description: "Inflammation of the stomach lining causing pain, nausea, and indigestion.",
        urgency: UrgencyLevel.LOW,
        specialties: ["Gastroenterologist", "General Physician"]
      },
      {
        name: "Irritable Bowel Syndrome",
        probability: 40,
        description: "Chronic condition affecting the large intestine, causing abdominal pain, bloating, and changes in bowel habits.",
        urgency: UrgencyLevel.LOW,
        specialties: ["Gastroenterologist"]
      },
      {
        name: "Appendicitis",
        probability: 20,
        description: "Inflammation of the appendix causing severe pain in the lower right abdomen, nausea, and fever.",
        urgency: UrgencyLevel.HIGH,
        specialties: ["General Surgeon"]
      },
      {
        name: "Gallstones",
        probability: 15,
        description: "Hardened deposits in the gallbladder causing sudden pain in the upper right abdomen, often after eating fatty foods.",
        urgency: UrgencyLevel.MEDIUM,
        specialties: ["Gastroenterologist", "General Surgeon"]
      }
    ],
    bodyParts: [BodyPart.ABDOMEN]
  },
  "back pain": {
    conditions: [
      {
        name: "Muscle Strain",
        probability: 70,
        description: "Pain caused by strained back muscles, often due to lifting heavy objects or sudden movements.",
        urgency: UrgencyLevel.LOW,
        specialties: ["Orthopedic Surgeon", "Physiotherapist"]
      },
      {
        name: "Herniated Disc",
        probability: 30,
        description: "Condition where a disc in the spine ruptures, causing pain that may radiate down the legs.",
        urgency: UrgencyLevel.MEDIUM,
        specialties: ["Orthopedic Surgeon", "Neurologist", "Neurosurgeon"]
      },
      {
        name: "Sciatica",
        probability: 25,
        description: "Pain that radiates along the sciatic nerve, from the lower back through the hips and buttocks and down the legs.",
        urgency: UrgencyLevel.MEDIUM,
        specialties: ["Orthopedic Surgeon", "Neurologist", "Physiotherapist"]
      },
      {
        name: "Kidney Stones",
        probability: 15,
        description: "Hard deposits that form in the kidneys, causing severe pain in the back and side, below the ribs.",
        urgency: UrgencyLevel.HIGH,
        specialties: ["Urologist", "Nephrologist"]
      }
    ],
    bodyParts: [BodyPart.BACK]
  },
  "rash": {
    conditions: [
      {
        name: "Contact Dermatitis",
        probability: 60,
        description: "Skin inflammation caused by contact with allergens or irritants, resulting in a red, itchy rash.",
        urgency: UrgencyLevel.LOW,
        specialties: ["Dermatologist", "Allergist"]
      },
      {
        name: "Eczema",
        probability: 40,
        description: "Chronic skin condition causing dry, itchy, and inflamed skin.",
        urgency: UrgencyLevel.LOW,
        specialties: ["Dermatologist"]
      },
      {
        name: "Psoriasis",
        probability: 30,
        description: "Chronic skin condition causing red, scaly patches, often on the knees, elbows, and scalp.",
        urgency: UrgencyLevel.LOW,
        specialties: ["Dermatologist"]
      },
      {
        name: "Allergic Reaction",
        probability: 25,
        description: "Immune system response to allergens, causing a rash, hives, or swelling.",
        urgency: UrgencyLevel.MEDIUM,
        specialties: ["Allergist", "Dermatologist"]
      }
    ],
    bodyParts: [BodyPart.SKIN]
  },
  "sore throat": {
    conditions: [
      {
        name: "Common Cold",
        probability: 70,
        description: "Viral infection causing sore throat, runny nose, cough, and mild fever.",
        urgency: UrgencyLevel.LOW,
        specialties: ["General Physician"]
      },
      {
        name: "Strep Throat",
        probability: 40,
        description: "Bacterial infection causing severe sore throat, pain when swallowing, and fever.",
        urgency: UrgencyLevel.MEDIUM,
        specialties: ["ENT Specialist", "General Physician"]
      },
      {
        name: "Tonsillitis",
        probability: 35,
        description: "Inflammation of the tonsils causing sore throat, difficulty swallowing, and swollen glands.",
        urgency: UrgencyLevel.MEDIUM,
        specialties: ["ENT Specialist", "General Physician"]
      },
      {
        name: "Laryngitis",
        probability: 25,
        description: "Inflammation of the voice box causing hoarseness, sore throat, and sometimes loss of voice.",
        urgency: UrgencyLevel.LOW,
        specialties: ["ENT Specialist", "General Physician"]
      }
    ],
    bodyParts: [BodyPart.HEAD]
  }
};

/**
 * Analyze symptoms and generate health recommendations
 * @param symptoms List of symptom inputs from the user
 * @returns Analysis result with possible conditions and recommendations
 */
export function analyzeSymptoms(symptoms: SymptomInput[]): SymptomAnalysisResult {
  // Initialize result
  const result: SymptomAnalysisResult = {
    possibleConditions: [],
    recommendations: [],
    urgencyLevel: UrgencyLevel.LOW,
    recommendedSpecialties: []
  };

  // If no symptoms provided, return empty result
  if (symptoms.length === 0) {
    return result;
  }

  // Map to track condition scores
  const conditionScores: Record<string, {
    condition: PossibleCondition;
    score: number;
    matchedSymptoms: string[];
  }> = {};

  // Process each symptom
  symptoms.forEach(symptom => {
    // Get conditions associated with this symptom
    const symptomData = symptomConditionMap[symptom.name.toLowerCase()];
    if (!symptomData) return;

    // Calculate severity multiplier
    const severityMultiplier = 
      symptom.severity === SymptomSeverity.SEVERE ? 1.5 :
      symptom.severity === SymptomSeverity.MODERATE ? 1.2 : 1.0;

    // Calculate duration multiplier
    const durationMultiplier = 
      symptom.duration === SymptomDuration.MONTHS ? 1.3 :
      symptom.duration === SymptomDuration.WEEKS ? 1.2 :
      symptom.duration === SymptomDuration.DAYS ? 1.1 : 1.0;

    // Process each condition associated with this symptom
    symptomData.conditions.forEach(condition => {
      // Calculate adjusted probability based on severity and duration
      const adjustedProbability = 
        condition.probability * severityMultiplier * durationMultiplier;

      // If condition already in map, update score
      if (conditionScores[condition.name]) {
        conditionScores[condition.name].score += adjustedProbability;
        conditionScores[condition.name].matchedSymptoms.push(symptom.name);
      } else {
        // Create new condition entry
        conditionScores[condition.name] = {
          condition: {
            name: condition.name,
            probability: adjustedProbability,
            description: condition.description,
            symptoms: [symptom.name],
            urgency: condition.urgency,
            specialties: condition.specialties
          },
          score: adjustedProbability,
          matchedSymptoms: [symptom.name]
        };
      }
    });
  });

  // Convert condition scores to array and sort by score
  const sortedConditions = Object.values(conditionScores)
    .sort((a, b) => b.score - a.score)
    .map(item => {
      // Update condition with matched symptoms
      item.condition.symptoms = item.matchedSymptoms;
      // Normalize probability to 0-100 range
      item.condition.probability = Math.min(Math.round(item.score), 100);
      return item.condition;
    });

  // Take top conditions (limit to 5)
  result.possibleConditions = sortedConditions.slice(0, 5);

  // Determine overall urgency level
  if (result.possibleConditions.some(c => c.urgency === UrgencyLevel.EMERGENCY)) {
    result.urgencyLevel = UrgencyLevel.EMERGENCY;
  } else if (result.possibleConditions.some(c => c.urgency === UrgencyLevel.HIGH)) {
    result.urgencyLevel = UrgencyLevel.HIGH;
  } else if (result.possibleConditions.some(c => c.urgency === UrgencyLevel.MEDIUM)) {
    result.urgencyLevel = UrgencyLevel.MEDIUM;
  }

  // Collect recommended specialties
  const specialtiesSet = new Set<string>();
  result.possibleConditions.forEach(condition => {
    condition.specialties.forEach(specialty => {
      specialtiesSet.add(specialty);
    });
  });
  result.recommendedSpecialties = Array.from(specialtiesSet);

  // Generate recommendations based on urgency level and conditions
  generateRecommendations(result);

  return result;
}

/**
 * Generate health recommendations based on analysis result
 * @param result Analysis result to update with recommendations
 */
function generateRecommendations(result: SymptomAnalysisResult): void {
  // Emergency recommendation
  if (result.urgencyLevel === UrgencyLevel.EMERGENCY) {
    result.recommendations.push({
      type: "emergency",
      description: "Seek immediate medical attention. Your symptoms may indicate a serious condition that requires emergency care.",
      urgency: UrgencyLevel.EMERGENCY,
      timeframe: "Immediately"
    });
    return;
  }

  // Specialist recommendation
  if (result.recommendedSpecialties.length > 0) {
    const timeframe = 
      result.urgencyLevel === UrgencyLevel.HIGH ? "Within 1-2 days" :
      result.urgencyLevel === UrgencyLevel.MEDIUM ? "Within a week" : "When convenient";

    result.recommendations.push({
      type: "specialist",
      description: `Consult with a healthcare professional specializing in ${result.recommendedSpecialties.join(" or ")} for proper diagnosis and treatment.`,
      urgency: result.urgencyLevel,
      specialties: result.recommendedSpecialties,
      timeframe
    });
  }

  // Self-care recommendations based on symptoms
  const selfCareSteps: string[] = [];
  
  // Check for specific symptoms and add relevant self-care steps
  const symptomNames = result.possibleConditions.flatMap(c => c.symptoms);
  
  if (symptomNames.includes("headache")) {
    selfCareSteps.push("Rest in a quiet, dark room and apply a cold compress to your forehead");
    selfCareSteps.push("Stay hydrated and consider over-the-counter pain relievers if appropriate");
  }
  
  if (symptomNames.includes("fever")) {
    selfCareSteps.push("Rest and drink plenty of fluids");
    selfCareSteps.push("Take over-the-counter fever reducers if appropriate");
    selfCareSteps.push("Use a light blanket if you have chills");
  }
  
  if (symptomNames.includes("cough")) {
    selfCareSteps.push("Stay hydrated and use a humidifier to add moisture to the air");
    selfCareSteps.push("Consider over-the-counter cough suppressants or expectorants if appropriate");
    selfCareSteps.push("Avoid irritants like smoke or strong perfumes");
  }
  
  if (symptomNames.includes("sore throat")) {
    selfCareSteps.push("Gargle with warm salt water several times a day");
    selfCareSteps.push("Drink warm liquids like tea with honey");
    selfCareSteps.push("Use throat lozenges or sprays for temporary relief");
  }
  
  if (symptomNames.includes("rash")) {
    selfCareSteps.push("Avoid scratching the affected area");
    selfCareSteps.push("Apply a cool compress or calamine lotion for itching");
    selfCareSteps.push("Use mild, fragrance-free soap and moisturizer");
  }
  
  if (selfCareSteps.length > 0) {
    result.recommendations.push({
      type: "self-care",
      description: "While waiting to see a healthcare professional, you can try these self-care measures to help manage your symptoms:",
      urgency: UrgencyLevel.LOW,
      selfCareSteps
    });
  }

  // General recommendation
  result.recommendations.push({
    type: "general",
    description: "Remember that this analysis is not a medical diagnosis. Always consult with a healthcare professional for proper evaluation and treatment.",
    urgency: UrgencyLevel.LOW
  });
}
