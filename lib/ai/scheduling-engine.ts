/**
 * AI Scheduling Engine
 * 
 * Advanced AI-powered appointment scheduling system that optimizes
 * doctor availability, patient preferences, and system efficiency.
 */

import { Doctor, Appointment, TimeSlot } from '@/lib/api/types';

export interface SchedulingPreferences {
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'any';
  preferredDays: string[]; // ['monday', 'tuesday', etc.]
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  maxTravelTime: number; // in minutes
  consultationType: 'video' | 'in-person' | 'any';
  languagePreference: string[];
  budgetRange: {
    min: number;
    max: number;
  };
}

export interface SchedulingContext {
  patientId: string;
  symptoms?: string[];
  medicalHistory?: string[];
  previousDoctors?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  insurance?: string;
}

export interface SmartRecommendation {
  doctor: Doctor;
  appointmentSlot: {
    date: string;
    time: string;
    duration: number;
  };
  confidence: number; // 0-1
  reasoning: string[];
  alternatives: Array<{
    doctor: Doctor;
    slot: { date: string; time: string; duration: number };
    reason: string;
  }>;
  estimatedWaitTime: number;
  travelInfo?: {
    distance: number;
    estimatedTime: number;
    transportOptions: string[];
  };
}

export interface ConflictResolution {
  conflictType: 'doctor_unavailable' | 'patient_conflict' | 'system_overload';
  originalSlot: { doctorId: string; date: string; time: string };
  alternatives: Array<{
    doctorId: string;
    date: string;
    time: string;
    priority: number;
    reason: string;
  }>;
  autoReschedule: boolean;
}

export class AISchedulingEngine {
  private doctorAvailability: Map<string, TimeSlot[]> = new Map();
  private appointmentHistory: Appointment[] = [];
  private patientPreferences: Map<string, SchedulingPreferences> = new Map();

  /**
   * Initialize the scheduling engine with data
   */
  async initialize(doctors: Doctor[], appointments: Appointment[]) {
    // Load doctor availability
    doctors.forEach(doctor => {
      this.doctorAvailability.set(doctor.id, doctor.availableSlots);
    });

    // Load appointment history for pattern analysis
    this.appointmentHistory = appointments;

    // Analyze patient preferences from history
    this.analyzePatientPreferences();
  }

  /**
   * Get smart appointment recommendations
   */
  async getSmartRecommendations(
    preferences: SchedulingPreferences,
    context: SchedulingContext,
    specialty?: string
  ): Promise<SmartRecommendation[]> {
    const recommendations: SmartRecommendation[] = [];

    // Get available doctors
    const availableDoctors = await this.getAvailableDoctors(specialty, context);

    for (const doctor of availableDoctors) {
      const slots = await this.getOptimalSlots(doctor, preferences, context);
      
      for (const slot of slots.slice(0, 3)) { // Top 3 slots per doctor
        const confidence = this.calculateConfidence(doctor, slot, preferences, context);
        const reasoning = this.generateReasoning(doctor, slot, preferences, context);
        const alternatives = await this.getAlternativeSlots(doctor, slot, preferences);

        recommendations.push({
          doctor,
          appointmentSlot: slot,
          confidence,
          reasoning,
          alternatives,
          estimatedWaitTime: this.estimateWaitTime(doctor, slot),
          travelInfo: context.location ? await this.calculateTravelInfo(doctor, context.location) : undefined,
        });
      }
    }

    // Sort by confidence and other factors
    return recommendations
      .sort((a, b) => {
        // Primary sort: urgency handling
        if (preferences.urgency === 'emergency') {
          return a.estimatedWaitTime - b.estimatedWaitTime;
        }
        
        // Secondary sort: confidence
        if (Math.abs(a.confidence - b.confidence) > 0.1) {
          return b.confidence - a.confidence;
        }
        
        // Tertiary sort: patient history
        const aHistory = this.getPatientDoctorHistory(context.patientId, a.doctor.id);
        const bHistory = this.getPatientDoctorHistory(context.patientId, b.doctor.id);
        
        return bHistory - aHistory;
      })
      .slice(0, 10); // Return top 10 recommendations
  }

  /**
   * Detect and resolve scheduling conflicts
   */
  async detectConflicts(
    doctorId: string,
    date: string,
    time: string,
    duration: number = 30
  ): Promise<ConflictResolution | null> {
    const doctor = await this.getDoctorById(doctorId);
    if (!doctor) {
      return {
        conflictType: 'doctor_unavailable',
        originalSlot: { doctorId, date, time },
        alternatives: [],
        autoReschedule: false,
      };
    }

    // Check doctor availability
    const isAvailable = this.isDoctorAvailable(doctorId, date, time, duration);
    if (!isAvailable) {
      const alternatives = await this.findAlternativeSlots(doctorId, date, time, duration);
      
      return {
        conflictType: 'doctor_unavailable',
        originalSlot: { doctorId, date, time },
        alternatives,
        autoReschedule: alternatives.length > 0 && alternatives[0].priority > 0.8,
      };
    }

    // Check for system overload
    const systemLoad = this.calculateSystemLoad(date, time);
    if (systemLoad > 0.9) {
      const alternatives = await this.findLessCongestedSlots(doctorId, date, time);
      
      return {
        conflictType: 'system_overload',
        originalSlot: { doctorId, date, time },
        alternatives,
        autoReschedule: false,
      };
    }

    return null; // No conflicts
  }

  /**
   * Optimize appointment scheduling for maximum efficiency
   */
  async optimizeSchedule(
    appointments: Array<{
      patientId: string;
      doctorId: string;
      preferredDate: string;
      preferredTime: string;
      duration: number;
      priority: number;
    }>
  ): Promise<Array<{
    patientId: string;
    doctorId: string;
    scheduledDate: string;
    scheduledTime: string;
    confidence: number;
    adjustments: string[];
  }>> {
    // Sort appointments by priority and urgency
    const sortedAppointments = appointments.sort((a, b) => b.priority - a.priority);
    
    const optimizedSchedule = [];
    const scheduledSlots = new Set<string>();

    for (const appointment of sortedAppointments) {
      const slotKey = `${appointment.doctorId}-${appointment.preferredDate}-${appointment.preferredTime}`;
      
      if (scheduledSlots.has(slotKey)) {
        // Find alternative slot
        const alternative = await this.findBestAlternative(appointment, scheduledSlots);
        optimizedSchedule.push(alternative);
        scheduledSlots.add(`${alternative.doctorId}-${alternative.scheduledDate}-${alternative.scheduledTime}`);
      } else {
        // Use preferred slot
        optimizedSchedule.push({
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          scheduledDate: appointment.preferredDate,
          scheduledTime: appointment.preferredTime,
          confidence: 1.0,
          adjustments: [],
        });
        scheduledSlots.add(slotKey);
      }
    }

    return optimizedSchedule;
  }

  /**
   * Predict future availability patterns
   */
  async predictAvailability(
    doctorId: string,
    startDate: string,
    endDate: string
  ): Promise<Array<{
    date: string;
    timeSlots: Array<{
      time: string;
      probability: number;
      expectedDemand: number;
    }>;
  }>> {
    const predictions = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      const timeSlots = [];
      
      // Generate predictions for each hour
      for (let hour = 9; hour <= 17; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const probability = this.calculateAvailabilityProbability(doctorId, dayOfWeek, hour);
        const expectedDemand = this.predictDemand(doctorId, dayOfWeek, hour);
        
        timeSlots.push({
          time,
          probability,
          expectedDemand,
        });
      }
      
      predictions.push({
        date: dateStr,
        timeSlots,
      });
    }

    return predictions;
  }

  // Private helper methods

  private async getAvailableDoctors(specialty?: string, context?: SchedulingContext): Promise<Doctor[]> {
    // Mock implementation - in real app, fetch from database
    const mockDoctors: Doctor[] = [
      {
        id: 'doc_1',
        name: 'Dr. Anika Rahman',
        email: 'dr.anika@example.com',
        phone: '+8801712345678',
        role: 'doctor',
        language: 'en',
        createdAt: '2023-01-15T00:00:00Z',
        specialty: 'Cardiologist',
        qualifications: ['MBBS', 'MD', 'FCPS'],
        experience: 8,
        languages: ['English', 'Bengali'],
        availableSlots: [
          { day: 'Monday', startTime: '10:00', endTime: '16:00', available: true },
          { day: 'Wednesday', startTime: '10:00', endTime: '16:00', available: true },
          { day: 'Friday', startTime: '14:00', endTime: '18:00', available: true },
        ],
        location: {
          address: '123 Medical Center, Gulshan',
          city: 'Dhaka',
          coordinates: { latitude: 23.7937, longitude: 90.4066 },
        },
        rating: 4.8,
        reviewCount: 124,
        consultationFee: 1500,
        bio: 'Experienced cardiologist with 8 years of practice.',
      },
      // Add more mock doctors...
    ];

    return specialty 
      ? mockDoctors.filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()))
      : mockDoctors;
  }

  private async getOptimalSlots(
    doctor: Doctor,
    preferences: SchedulingPreferences,
    context: SchedulingContext
  ): Promise<Array<{ date: string; time: string; duration: number }>> {
    const slots = [];
    const today = new Date();
    
    // Generate slots for next 14 days
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const doctorSlot = doctor.availableSlots.find(slot => 
        slot.day.toLowerCase() === dayName && slot.available
      );
      
      if (doctorSlot) {
        const timeSlots = this.generateTimeSlots(doctorSlot.startTime, doctorSlot.endTime, 30);
        
        for (const time of timeSlots) {
          if (this.matchesPreferences(time, preferences)) {
            slots.push({
              date: date.toISOString().split('T')[0],
              time,
              duration: 30,
            });
          }
        }
      }
    }
    
    return slots.slice(0, 10); // Return top 10 slots
  }

  private generateTimeSlots(startTime: string, endTime: string, duration: number): string[] {
    const slots = [];
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);
    
    for (let time = start; time < end; time += duration) {
      slots.push(this.minutesToTime(time));
    }
    
    return slots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private matchesPreferences(time: string, preferences: SchedulingPreferences): boolean {
    const hour = parseInt(time.split(':')[0]);
    
    switch (preferences.preferredTimeOfDay) {
      case 'morning':
        return hour >= 9 && hour < 12;
      case 'afternoon':
        return hour >= 12 && hour < 17;
      case 'evening':
        return hour >= 17 && hour < 20;
      default:
        return true;
    }
  }

  private calculateConfidence(
    doctor: Doctor,
    slot: { date: string; time: string; duration: number },
    preferences: SchedulingPreferences,
    context: SchedulingContext
  ): number {
    let confidence = 0.5; // Base confidence
    
    // Doctor rating factor
    confidence += (doctor.rating - 3) * 0.1;
    
    // Experience factor
    confidence += Math.min(doctor.experience * 0.02, 0.2);
    
    // Language match
    if (doctor.languages.some(lang => preferences.languagePreference.includes(lang))) {
      confidence += 0.1;
    }
    
    // Budget match
    if (doctor.consultationFee >= preferences.budgetRange.min && 
        doctor.consultationFee <= preferences.budgetRange.max) {
      confidence += 0.1;
    }
    
    // Time preference match
    if (this.matchesPreferences(slot.time, preferences)) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }

  private generateReasoning(
    doctor: Doctor,
    slot: { date: string; time: string; duration: number },
    preferences: SchedulingPreferences,
    context: SchedulingContext
  ): string[] {
    const reasons = [];
    
    if (doctor.rating >= 4.5) {
      reasons.push(`Highly rated doctor (${doctor.rating}/5.0)`);
    }
    
    if (doctor.experience >= 10) {
      reasons.push(`Experienced specialist (${doctor.experience} years)`);
    }
    
    if (doctor.languages.includes('Bengali') && preferences.languagePreference.includes('Bengali')) {
      reasons.push('Speaks your preferred language');
    }
    
    if (this.matchesPreferences(slot.time, preferences)) {
      reasons.push('Matches your preferred time');
    }
    
    if (context.symptoms && context.symptoms.length > 0) {
      reasons.push(`Specializes in treating ${context.symptoms[0]}`);
    }
    
    return reasons;
  }

  private async getAlternativeSlots(
    doctor: Doctor,
    primarySlot: { date: string; time: string; duration: number },
    preferences: SchedulingPreferences
  ): Promise<Array<{
    doctor: Doctor;
    slot: { date: string; time: string; duration: number };
    reason: string;
  }>> {
    // Generate alternative slots for the same doctor
    const alternatives = [];
    const slots = await this.getOptimalSlots(doctor, preferences, {
      patientId: 'temp',
    });
    
    // Filter out the primary slot and get next best options
    const filteredSlots = slots.filter(slot => 
      !(slot.date === primarySlot.date && slot.time === primarySlot.time)
    );
    
    for (const slot of filteredSlots.slice(0, 2)) {
      alternatives.push({
        doctor,
        slot,
        reason: 'Alternative time with same doctor',
      });
    }
    
    return alternatives;
  }

  private estimateWaitTime(doctor: Doctor, slot: { date: string; time: string }): number {
    // Mock implementation - in real app, calculate based on actual data
    const baseWaitTime = 15; // minutes
    const popularityFactor = (doctor.rating - 3) * 5;
    const timeFactor = slot.time.includes('10:') || slot.time.includes('14:') ? 5 : 0;
    
    return Math.max(baseWaitTime + popularityFactor + timeFactor, 5);
  }

  private async calculateTravelInfo(doctor: Doctor, userLocation: { latitude: number; longitude: number }) {
    // Mock implementation - in real app, use actual distance calculation
    return {
      distance: 5.2,
      estimatedTime: 25,
      transportOptions: ['CNG', 'Uber', 'Bus'],
    };
  }

  private getPatientDoctorHistory(patientId: string, doctorId: string): number {
    // Count previous appointments with this doctor
    return this.appointmentHistory.filter(apt => 
      apt.patientId === patientId && apt.doctorId === doctorId
    ).length;
  }

  private async getDoctorById(doctorId: string): Promise<Doctor | null> {
    // Mock implementation
    return null;
  }

  private isDoctorAvailable(doctorId: string, date: string, time: string, duration: number): boolean {
    // Mock implementation
    return Math.random() > 0.2; // 80% availability
  }

  private async findAlternativeSlots(doctorId: string, date: string, time: string, duration: number) {
    // Mock implementation
    return [
      {
        doctorId,
        date,
        time: '11:00',
        priority: 0.9,
        reason: 'Next available slot',
      },
    ];
  }

  private calculateSystemLoad(date: string, time: string): number {
    // Mock implementation
    return Math.random() * 0.8; // Random load between 0-80%
  }

  private async findLessCongestedSlots(doctorId: string, date: string, time: string) {
    // Mock implementation
    return [
      {
        doctorId,
        date,
        time: '15:00',
        priority: 0.7,
        reason: 'Less congested time',
      },
    ];
  }

  private async findBestAlternative(appointment: any, scheduledSlots: Set<string>) {
    // Mock implementation
    return {
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      scheduledDate: appointment.preferredDate,
      scheduledTime: '11:00',
      confidence: 0.8,
      adjustments: ['Time adjusted due to conflict'],
    };
  }

  private calculateAvailabilityProbability(doctorId: string, dayOfWeek: number, hour: number): number {
    // Mock implementation based on typical patterns
    if (dayOfWeek === 0 || dayOfWeek === 6) return 0.3; // Weekend
    if (hour < 9 || hour > 17) return 0.1; // Outside hours
    if (hour >= 10 && hour <= 16) return 0.8; // Peak hours
    return 0.6; // Regular hours
  }

  private predictDemand(doctorId: string, dayOfWeek: number, hour: number): number {
    // Mock implementation
    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Weekdays
      if (hour >= 10 && hour <= 12) return 0.9; // Morning peak
      if (hour >= 14 && hour <= 16) return 0.8; // Afternoon peak
    }
    return 0.4; // Low demand
  }

  private analyzePatientPreferences(): void {
    // Analyze appointment history to learn patient preferences
    // This would be implemented with actual ML algorithms in production
  }
}
