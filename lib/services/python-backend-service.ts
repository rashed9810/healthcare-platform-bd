/**
 * Python Backend Integration Service
 * 
 * Service to integrate Next.js frontend with Python FastAPI backend
 */

export interface PythonBackendResponse<T = any> {
  success: boolean;
  data: T;
  status: number;
}

export interface SymptomAnalysisRequest {
  symptoms: string[];
  patient_age?: number;
  patient_gender?: string;
  medical_history?: string[];
}

export interface SymptomAnalysisResult {
  analysis_id: string;
  symptoms: string[];
  confidence: number;
  emergency_level: 'low' | 'medium' | 'high';
  recommendations: string[];
  possible_conditions: Array<{
    name: string;
    probability: number;
    severity: string;
  }>;
  analysis_timestamp: string;
}

export interface AppointmentEnhancementRequest {
  appointment_id?: string;
  patient_id: string;
  doctor_id: string;
  symptoms?: string[];
  preferred_date: string;
  preferred_time: string;
  patient_age?: number;
  medical_history?: string[];
}

export interface AppointmentEnhancementResult {
  appointment_id: string;
  patient_id: string;
  ai_priority_score: number;
  recommended_urgency: string;
  ai_insights: string[];
  symptom_analysis?: {
    symptoms_count: number;
    emergency_level: string;
    confidence: number;
  };
  enhanced_at: string;
}

class PythonBackendService {
  private baseUrl = '/api/python-backend';

  /**
   * Make a request to the Python backend
   */
  private async makeRequest<T>(
    endpoint: string,
    data?: any,
    method: 'GET' | 'POST' = 'POST'
  ): Promise<PythonBackendResponse<T>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: method === 'GET' ? 'GET' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === 'GET' 
          ? undefined 
          : JSON.stringify({ endpoint, data, method }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Python backend request failed:', error);
      throw error;
    }
  }

  /**
   * Test connection to Python backend
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/api/v1/test/connection', undefined, 'GET');
      return response.success && response.data.status === 'connected';
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get Python backend health status
   */
  async getHealthStatus(): Promise<PythonBackendResponse<any>> {
    return this.makeRequest('/health', undefined, 'GET');
  }

  /**
   * Analyze symptoms using Python AI backend
   */
  async analyzeSymptoms(request: SymptomAnalysisRequest): Promise<PythonBackendResponse<SymptomAnalysisResult>> {
    return this.makeRequest<SymptomAnalysisResult>('/api/v1/symptoms/analyze', request);
  }

  /**
   * Enhance appointment with AI insights
   */
  async enhanceAppointment(request: AppointmentEnhancementRequest): Promise<PythonBackendResponse<AppointmentEnhancementResult>> {
    return this.makeRequest<AppointmentEnhancementResult>('/api/v1/appointments/enhance', request);
  }

  /**
   * Sync data with Python backend
   */
  async syncData(type: string, data: any): Promise<PythonBackendResponse<any>> {
    return this.makeRequest('/api/v1/integration/sync', { type, data });
  }

  /**
   * Get analytics summary from Python backend
   */
  async getAnalyticsSummary(): Promise<PythonBackendResponse<any>> {
    return this.makeRequest('/api/v1/analytics/summary', undefined, 'GET');
  }

  /**
   * Enhanced appointment booking with AI analysis
   */
  async bookAppointmentWithAI(appointmentData: {
    patient_id: string;
    doctor_id: string;
    preferred_date: string;
    preferred_time: string;
    symptoms?: string[];
    patient_age?: number;
    patient_gender?: string;
    medical_history?: string[];
  }): Promise<{
    appointmentResult: any;
    aiAnalysis?: SymptomAnalysisResult;
    enhancement?: AppointmentEnhancementResult;
  }> {
    try {
      let aiAnalysis: SymptomAnalysisResult | undefined;
      let enhancement: AppointmentEnhancementResult | undefined;

      // Step 1: Analyze symptoms if provided
      if (appointmentData.symptoms && appointmentData.symptoms.length > 0) {
        const analysisResponse = await this.analyzeSymptoms({
          symptoms: appointmentData.symptoms,
          patient_age: appointmentData.patient_age,
          patient_gender: appointmentData.patient_gender,
          medical_history: appointmentData.medical_history,
        });

        if (analysisResponse.success) {
          aiAnalysis = analysisResponse.data;
        }
      }

      // Step 2: Enhance appointment with AI
      const enhancementResponse = await this.enhanceAppointment(appointmentData);
      if (enhancementResponse.success) {
        enhancement = enhancementResponse.data;
      }

      // Step 3: Book appointment through regular Next.js API
      const appointmentResponse = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...appointmentData,
          ai_analysis: aiAnalysis,
          ai_enhancement: enhancement,
          booking_source: 'ai_enhanced',
        }),
      });

      const appointmentResult = await appointmentResponse.json();

      return {
        appointmentResult,
        aiAnalysis,
        enhancement,
      };

    } catch (error) {
      console.error('AI-enhanced booking failed:', error);
      throw error;
    }
  }

  /**
   * Get AI recommendations for a patient
   */
  async getAIRecommendations(patientId: string, symptoms?: string[]): Promise<{
    symptomAnalysis?: SymptomAnalysisResult;
    recommendations: string[];
    urgencyLevel: string;
    suggestedSpecialties: string[];
  }> {
    try {
      let symptomAnalysis: SymptomAnalysisResult | undefined;

      if (symptoms && symptoms.length > 0) {
        const response = await this.analyzeSymptoms({ symptoms });
        if (response.success) {
          symptomAnalysis = response.data;
        }
      }

      // Generate recommendations based on analysis
      const recommendations: string[] = [];
      let urgencyLevel = 'low';
      const suggestedSpecialties: string[] = [];

      if (symptomAnalysis) {
        recommendations.push(...symptomAnalysis.recommendations);
        urgencyLevel = symptomAnalysis.emergency_level;
        
        // Extract specialties from conditions
        symptomAnalysis.possible_conditions.forEach(condition => {
          if (condition.name.toLowerCase().includes('heart')) {
            suggestedSpecialties.push('Cardiology');
          } else if (condition.name.toLowerCase().includes('lung') || 
                     condition.name.toLowerCase().includes('respiratory')) {
            suggestedSpecialties.push('Pulmonology');
          } else if (condition.name.toLowerCase().includes('stomach') || 
                     condition.name.toLowerCase().includes('gastro')) {
            suggestedSpecialties.push('Gastroenterology');
          } else {
            suggestedSpecialties.push('General Medicine');
          }
        });
      }

      return {
        symptomAnalysis,
        recommendations,
        urgencyLevel,
        suggestedSpecialties: [...new Set(suggestedSpecialties)], // Remove duplicates
      };

    } catch (error) {
      console.error('Failed to get AI recommendations:', error);
      throw error;
    }
  }

  /**
   * Monitor Python backend status
   */
  async monitorBackendStatus(): Promise<{
    isOnline: boolean;
    responseTime: number;
    lastChecked: string;
  }> {
    const startTime = Date.now();
    
    try {
      const response = await this.getHealthStatus();
      const responseTime = Date.now() - startTime;
      
      return {
        isOnline: response.success,
        responseTime,
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      return {
        isOnline: false,
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
      };
    }
  }
}

// Create singleton instance
export const pythonBackendService = new PythonBackendService();

// Export types
export type {
  PythonBackendResponse,
  SymptomAnalysisRequest,
  SymptomAnalysisResult,
  AppointmentEnhancementRequest,
  AppointmentEnhancementResult,
};

export default pythonBackendService;
