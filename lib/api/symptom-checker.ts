import { SymptomData, SymptomResult } from "./types";
import { getToken } from "./auth";

/**
 * Sends symptom data to the backend for analysis
 * @param symptomData User's symptom information
 * @returns Analysis results with recommendations
 */
export async function analyzeSymptoms(
  symptomData: SymptomData
): Promise<SymptomResult> {
  try {
    const token = getToken();
    const response = await fetch("/api/symptom-checker/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(symptomData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to analyze symptoms");
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    throw error;
  }
}

/**
 * Fetches common symptoms based on body part or system
 * @param bodyPart Body part or system (e.g., "head", "chest", "digestive")
 * @param language Language code (en or bn)
 * @returns List of common symptoms for the specified body part
 */
export async function getCommonSymptoms(
  bodyPart: string,
  language: string = "en"
): Promise<string[]> {
  try {
    const token = getToken();
    const response = await fetch(
      `/api/symptom-checker/common-symptoms?bodyPart=${bodyPart}&language=${language}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch common symptoms");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching common symptoms:", error);
    throw error;
  }
}

/**
 * Saves symptom check result to user's medical history
 * @param resultId ID of the symptom check result to save
 * @returns Success message
 */
export async function saveSymptomResult(
  resultId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const token = getToken();
    const response = await fetch("/api/symptom-checker/save-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ resultId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to save symptom result");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving symptom result:", error);
    throw error;
  }
}

/**
 * Gets user's symptom check history
 * @returns List of previous symptom checks
 */
export async function getSymptomHistory(): Promise<SymptomResult[]> {
  try {
    const token = getToken();
    const response = await fetch("/api/symptom-checker/history", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch symptom history");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching symptom history:", error);
    throw error;
  }
}
