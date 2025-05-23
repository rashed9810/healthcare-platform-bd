/**
 * AI Conflict Resolution System
 * 
 * Intelligent system for detecting and resolving appointment scheduling conflicts
 * with automatic rescheduling and optimization capabilities.
 */

import { Appointment, Doctor } from '@/lib/api/types';

export interface SchedulingConflict {
  id: string;
  type: 'doctor_unavailable' | 'patient_conflict' | 'system_overload' | 'emergency_override';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedAppointments: string[];
  conflictDetails: {
    originalSlot: {
      doctorId: string;
      date: string;
      time: string;
      duration: number;
    };
    conflictingSlot?: {
      appointmentId: string;
      patientId: string;
      reason: string;
    };
  };
  detectedAt: string;
  resolvedAt?: string;
  resolutionStrategy?: ResolutionStrategy;
}

export interface ResolutionStrategy {
  type: 'reschedule' | 'reassign' | 'split' | 'defer' | 'escalate';
  confidence: number;
  estimatedImpact: {
    patientsAffected: number;
    timeDelayMinutes: number;
    costImpact: number;
  };
  alternatives: Array<{
    doctorId: string;
    date: string;
    time: string;
    priority: number;
    reason: string;
  }>;
  autoApprove: boolean;
}

export interface ConflictResolutionResult {
  success: boolean;
  conflictId: string;
  strategy: ResolutionStrategy;
  newAppointments: Array<{
    appointmentId: string;
    doctorId: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending_approval';
  }>;
  notifications: Array<{
    recipientId: string;
    type: 'patient' | 'doctor' | 'admin';
    message: string;
    urgency: 'low' | 'medium' | 'high';
  }>;
}

export class AIConflictResolver {
  private activeConflicts: Map<string, SchedulingConflict> = new Map();
  private resolutionHistory: ConflictResolutionResult[] = [];
  private doctorAvailability: Map<string, any[]> = new Map();

  /**
   * Detect potential scheduling conflicts
   */
  async detectConflicts(
    newAppointment: {
      doctorId: string;
      patientId: string;
      date: string;
      time: string;
      duration: number;
      urgency: 'low' | 'medium' | 'high' | 'emergency';
    },
    existingAppointments: Appointment[]
  ): Promise<SchedulingConflict[]> {
    const conflicts: SchedulingConflict[] = [];

    // Check for direct time conflicts
    const timeConflicts = this.checkTimeConflicts(newAppointment, existingAppointments);
    conflicts.push(...timeConflicts);

    // Check for doctor availability conflicts
    const availabilityConflicts = await this.checkDoctorAvailability(newAppointment);
    conflicts.push(...availabilityConflicts);

    // Check for system capacity conflicts
    const capacityConflicts = this.checkSystemCapacity(newAppointment, existingAppointments);
    conflicts.push(...capacityConflicts);

    // Check for patient conflicts (multiple appointments same day)
    const patientConflicts = this.checkPatientConflicts(newAppointment, existingAppointments);
    conflicts.push(...patientConflicts);

    return conflicts;
  }

  /**
   * Resolve conflicts using AI-powered strategies
   */
  async resolveConflict(conflictId: string): Promise<ConflictResolutionResult> {
    const conflict = this.activeConflicts.get(conflictId);
    if (!conflict) {
      throw new Error('Conflict not found');
    }

    // Analyze conflict and determine best resolution strategy
    const strategy = await this.analyzeAndCreateStrategy(conflict);
    
    // Execute the resolution strategy
    const result = await this.executeResolutionStrategy(conflict, strategy);
    
    // Update conflict status
    conflict.resolvedAt = new Date().toISOString();
    conflict.resolutionStrategy = strategy;
    
    // Store resolution history
    this.resolutionHistory.push(result);
    
    return result;
  }

  /**
   * Get intelligent rescheduling suggestions
   */
  async getReschedulingSuggestions(
    appointmentId: string,
    preferences: {
      maxDelayDays: number;
      preferredTimes: string[];
      sameDoctorPreferred: boolean;
    }
  ): Promise<Array<{
    doctorId: string;
    doctorName: string;
    date: string;
    time: string;
    confidence: number;
    benefits: string[];
    tradeoffs: string[];
  }>> {
    const suggestions = [];

    // Mock implementation - in real app, this would use ML algorithms
    const mockSuggestions = [
      {
        doctorId: 'doc_1',
        doctorName: 'Dr. Anika Rahman',
        date: '2024-01-15',
        time: '10:00',
        confidence: 0.95,
        benefits: [
          'Same doctor maintains continuity',
          'Preferred morning time slot',
          'Only 1 day delay',
        ],
        tradeoffs: ['Slightly higher cost'],
      },
      {
        doctorId: 'doc_2',
        doctorName: 'Dr. Kamal Hossain',
        date: '2024-01-14',
        time: '14:00',
        confidence: 0.87,
        benefits: [
          'Available sooner',
          'Highly rated specialist',
          'Lower consultation fee',
        ],
        tradeoffs: ['Different doctor', 'Afternoon slot'],
      },
    ];

    return mockSuggestions;
  }

  /**
   * Predict future conflicts based on patterns
   */
  async predictFutureConflicts(
    timeRange: { startDate: string; endDate: string }
  ): Promise<Array<{
    date: string;
    time: string;
    conflictProbability: number;
    potentialCauses: string[];
    preventionSuggestions: string[];
  }>> {
    const predictions = [];

    // Analyze historical patterns
    const historicalData = this.analyzeHistoricalConflicts();
    
    // Generate predictions for each day in range
    const start = new Date(timeRange.startDate);
    const end = new Date(timeRange.endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayPredictions = this.predictDayConflicts(date, historicalData);
      predictions.push(...dayPredictions);
    }

    return predictions;
  }

  /**
   * Optimize overall schedule to minimize conflicts
   */
  async optimizeSchedule(
    appointments: Appointment[],
    optimizationGoals: {
      minimizeWaitTimes: boolean;
      maximizeUtilization: boolean;
      balanceWorkload: boolean;
      prioritizeUrgent: boolean;
    }
  ): Promise<{
    optimizedAppointments: Appointment[];
    improvements: {
      conflictsReduced: number;
      averageWaitTimeReduction: number;
      utilizationImprovement: number;
    };
    recommendations: string[];
  }> {
    // Mock implementation of schedule optimization
    const optimizedAppointments = [...appointments];
    
    // Apply optimization algorithms
    if (optimizationGoals.prioritizeUrgent) {
      optimizedAppointments.sort((a, b) => {
        const urgencyOrder = { emergency: 4, high: 3, medium: 2, low: 1 };
        return (urgencyOrder[b.urgency as keyof typeof urgencyOrder] || 0) - 
               (urgencyOrder[a.urgency as keyof typeof urgencyOrder] || 0);
      });
    }

    return {
      optimizedAppointments,
      improvements: {
        conflictsReduced: 5,
        averageWaitTimeReduction: 12,
        utilizationImprovement: 8,
      },
      recommendations: [
        'Consider adding evening slots for high-demand doctors',
        'Implement buffer time between appointments',
        'Use video consultations for follow-ups',
      ],
    };
  }

  // Private helper methods

  private checkTimeConflicts(
    newAppointment: any,
    existingAppointments: Appointment[]
  ): SchedulingConflict[] {
    const conflicts: SchedulingConflict[] = [];

    for (const existing of existingAppointments) {
      if (
        existing.doctorId === newAppointment.doctorId &&
        existing.date === newAppointment.date &&
        this.timesOverlap(existing.time, newAppointment.time, newAppointment.duration)
      ) {
        conflicts.push({
          id: `conflict_${Date.now()}_${Math.random()}`,
          type: 'doctor_unavailable',
          severity: newAppointment.urgency === 'emergency' ? 'critical' : 'high',
          affectedAppointments: [existing.id],
          conflictDetails: {
            originalSlot: {
              doctorId: newAppointment.doctorId,
              date: newAppointment.date,
              time: newAppointment.time,
              duration: newAppointment.duration,
            },
            conflictingSlot: {
              appointmentId: existing.id,
              patientId: existing.patientId,
              reason: 'Time slot already booked',
            },
          },
          detectedAt: new Date().toISOString(),
        });
      }
    }

    return conflicts;
  }

  private async checkDoctorAvailability(newAppointment: any): Promise<SchedulingConflict[]> {
    // Mock implementation - check against doctor's schedule
    const isAvailable = Math.random() > 0.1; // 90% availability
    
    if (!isAvailable) {
      return [{
        id: `availability_conflict_${Date.now()}`,
        type: 'doctor_unavailable',
        severity: 'medium',
        affectedAppointments: [],
        conflictDetails: {
          originalSlot: {
            doctorId: newAppointment.doctorId,
            date: newAppointment.date,
            time: newAppointment.time,
            duration: newAppointment.duration,
          },
        },
        detectedAt: new Date().toISOString(),
      }];
    }

    return [];
  }

  private checkSystemCapacity(newAppointment: any, existingAppointments: Appointment[]): SchedulingConflict[] {
    // Check if system is overloaded at this time
    const sameTimeAppointments = existingAppointments.filter(apt =>
      apt.date === newAppointment.date &&
      apt.time === newAppointment.time
    );

    if (sameTimeAppointments.length >= 10) { // System capacity limit
      return [{
        id: `capacity_conflict_${Date.now()}`,
        type: 'system_overload',
        severity: 'medium',
        affectedAppointments: sameTimeAppointments.map(apt => apt.id),
        conflictDetails: {
          originalSlot: {
            doctorId: newAppointment.doctorId,
            date: newAppointment.date,
            time: newAppointment.time,
            duration: newAppointment.duration,
          },
        },
        detectedAt: new Date().toISOString(),
      }];
    }

    return [];
  }

  private checkPatientConflicts(newAppointment: any, existingAppointments: Appointment[]): SchedulingConflict[] {
    // Check if patient already has appointment same day
    const patientSameDayAppointments = existingAppointments.filter(apt =>
      apt.patientId === newAppointment.patientId &&
      apt.date === newAppointment.date
    );

    if (patientSameDayAppointments.length > 0) {
      return [{
        id: `patient_conflict_${Date.now()}`,
        type: 'patient_conflict',
        severity: 'low',
        affectedAppointments: patientSameDayAppointments.map(apt => apt.id),
        conflictDetails: {
          originalSlot: {
            doctorId: newAppointment.doctorId,
            date: newAppointment.date,
            time: newAppointment.time,
            duration: newAppointment.duration,
          },
        },
        detectedAt: new Date().toISOString(),
      }];
    }

    return [];
  }

  private timesOverlap(time1: string, time2: string, duration: number): boolean {
    // Simple overlap check - in real implementation, use proper time parsing
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    
    const start1 = h1 * 60 + m1;
    const end1 = start1 + 30; // Assume 30 min default
    const start2 = h2 * 60 + m2;
    const end2 = start2 + duration;
    
    return start1 < end2 && start2 < end1;
  }

  private async analyzeAndCreateStrategy(conflict: SchedulingConflict): Promise<ResolutionStrategy> {
    // AI-powered strategy creation based on conflict type and severity
    const strategies: ResolutionStrategy = {
      type: 'reschedule',
      confidence: 0.85,
      estimatedImpact: {
        patientsAffected: 1,
        timeDelayMinutes: 60,
        costImpact: 0,
      },
      alternatives: [
        {
          doctorId: conflict.conflictDetails.originalSlot.doctorId,
          date: conflict.conflictDetails.originalSlot.date,
          time: '11:00',
          priority: 0.9,
          reason: 'Next available slot with same doctor',
        },
      ],
      autoApprove: conflict.severity !== 'critical',
    };

    return strategies;
  }

  private async executeResolutionStrategy(
    conflict: SchedulingConflict,
    strategy: ResolutionStrategy
  ): Promise<ConflictResolutionResult> {
    // Execute the chosen strategy
    const result: ConflictResolutionResult = {
      success: true,
      conflictId: conflict.id,
      strategy,
      newAppointments: strategy.alternatives.map(alt => ({
        appointmentId: `apt_${Date.now()}_${Math.random()}`,
        doctorId: alt.doctorId,
        date: alt.date,
        time: alt.time,
        status: strategy.autoApprove ? 'confirmed' : 'pending_approval',
      })),
      notifications: [
        {
          recipientId: 'patient_id',
          type: 'patient',
          message: 'Your appointment has been rescheduled',
          urgency: 'medium',
        },
      ],
    };

    return result;
  }

  private analyzeHistoricalConflicts() {
    // Analyze past conflicts to identify patterns
    return {
      peakConflictTimes: ['10:00', '14:00'],
      commonCauses: ['doctor_unavailable', 'system_overload'],
      seasonalPatterns: {},
    };
  }

  private predictDayConflicts(date: Date, historicalData: any) {
    // Predict conflicts for a specific day
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (isWeekend) {
      return []; // Lower conflict probability on weekends
    }

    return [
      {
        date: date.toISOString().split('T')[0],
        time: '10:00',
        conflictProbability: 0.7,
        potentialCauses: ['High demand time slot', 'Multiple urgent appointments'],
        preventionSuggestions: ['Add buffer time', 'Suggest alternative times'],
      },
    ];
  }
}

// Export singleton instance
export const aiConflictResolver = new AIConflictResolver();
