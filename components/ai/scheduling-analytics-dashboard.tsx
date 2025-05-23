"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target,
  Zap,
  Activity,
  PieChart,
  LineChart,
} from 'lucide-react';

interface SchedulingMetrics {
  totalAppointments: number;
  aiScheduledAppointments: number;
  conflictsDetected: number;
  conflictsResolved: number;
  averageSchedulingTime: number;
  patientSatisfaction: number;
  doctorUtilization: number;
  noShowRate: number;
}

interface ConflictPrediction {
  date: string;
  time: string;
  conflictProbability: number;
  potentialCauses: string[];
  preventionSuggestions: string[];
}

interface DoctorAnalytics {
  doctorId: string;
  doctorName: string;
  specialty: string;
  utilizationRate: number;
  averageRating: number;
  appointmentCount: number;
  aiRecommendationRate: number;
  conflictRate: number;
}

export default function SchedulingAnalyticsDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState<SchedulingMetrics>({
    totalAppointments: 1250,
    aiScheduledAppointments: 890,
    conflictsDetected: 45,
    conflictsResolved: 42,
    averageSchedulingTime: 2.3,
    patientSatisfaction: 4.6,
    doctorUtilization: 78,
    noShowRate: 8.5,
  });
  
  const [conflictPredictions, setConflictPredictions] = useState<ConflictPrediction[]>([
    {
      date: '2024-01-15',
      time: '10:00',
      conflictProbability: 0.85,
      potentialCauses: ['High demand time slot', 'Multiple urgent appointments'],
      preventionSuggestions: ['Add buffer time', 'Suggest alternative times'],
    },
    {
      date: '2024-01-16',
      time: '14:00',
      conflictProbability: 0.72,
      potentialCauses: ['Doctor availability conflict', 'System overload'],
      preventionSuggestions: ['Reschedule non-urgent appointments', 'Enable video consultations'],
    },
  ]);

  const [doctorAnalytics, setDoctorAnalytics] = useState<DoctorAnalytics[]>([
    {
      doctorId: 'doc_1',
      doctorName: 'Dr. Anika Rahman',
      specialty: 'Cardiologist',
      utilizationRate: 85,
      averageRating: 4.8,
      appointmentCount: 156,
      aiRecommendationRate: 78,
      conflictRate: 3.2,
    },
    {
      doctorId: 'doc_2',
      doctorName: 'Dr. Kamal Hossain',
      specialty: 'Neurologist',
      utilizationRate: 92,
      averageRating: 4.9,
      appointmentCount: 189,
      aiRecommendationRate: 82,
      conflictRate: 2.1,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getMetricTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      isNegative: change < 0,
    };
  };

  const getConflictSeverityColor = (probability: number) => {
    if (probability >= 0.8) return 'text-red-600 bg-red-50';
    if (probability >= 0.6) return 'text-orange-600 bg-orange-50';
    if (probability >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Scheduling Analytics</h1>
          <p className="text-muted-foreground">
            Intelligent insights and predictions for appointment scheduling
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshData} disabled={isLoading}>
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Scheduling Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((metrics.aiScheduledAppointments / metrics.totalAppointments) * 100)}%
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conflict Resolution</p>
                <p className="text-2xl font-bold">
                  {Math.round((metrics.conflictsResolved / metrics.conflictsDetected) * 100)}%
                </p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8.3%</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Doctor Utilization</p>
                <p className="text-2xl font-bold">{metrics.doctorUtilization}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5.2%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patient Satisfaction</p>
                <p className="text-2xl font-bold">{metrics.patientSatisfaction}/5.0</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+0.3</span>
                </div>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="predictions">Conflict Predictions</TabsTrigger>
          <TabsTrigger value="doctors">Doctor Analytics</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Conflict Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conflictPredictions.map((prediction, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{prediction.date}</span>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{prediction.time}</span>
                      </div>
                      <Badge className={getConflictSeverityColor(prediction.conflictProbability)}>
                        {Math.round(prediction.conflictProbability * 100)}% Risk
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <Progress 
                        value={prediction.conflictProbability * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-2">Potential Causes:</p>
                        <ul className="space-y-1">
                          {prediction.potentialCauses.map((cause, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Prevention Suggestions:</p>
                        <ul className="space-y-1">
                          {prediction.preventionSuggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctorAnalytics.map((doctor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{doctor.doctorName}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{doctor.appointmentCount}</div>
                        <div className="text-sm text-muted-foreground">appointments</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium">Utilization</p>
                        <div className="flex items-center mt-1">
                          <Progress value={doctor.utilizationRate} className="flex-1 mr-2" />
                          <span className="text-sm font-medium">{doctor.utilizationRate}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">AI Recommendations</p>
                        <div className="flex items-center mt-1">
                          <Progress value={doctor.aiRecommendationRate} className="flex-1 mr-2" />
                          <span className="text-sm font-medium">{doctor.aiRecommendationRate}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Rating</p>
                        <div className="text-lg font-semibold">{doctor.averageRating}/5.0</div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Conflict Rate</p>
                        <div className="text-lg font-semibold text-green-600">{doctor.conflictRate}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Current Efficiency</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <Progress value={78} />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Reduced wait times by 15%</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Improved doctor utilization by 12%</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Decreased conflicts by 23%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">Add Evening Slots</p>
                    <p className="text-sm text-blue-600">
                      Consider adding 6-8 PM slots for high-demand doctors
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800">Buffer Time</p>
                    <p className="text-sm text-green-600">
                      Implement 5-minute buffers between appointments
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-medium text-purple-800">Video Consultations</p>
                    <p className="text-sm text-purple-600">
                      Promote video consultations for follow-ups
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Appointment Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Chart visualization would go here
                  <br />
                  (Integration with charting library needed)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Scheduling Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>AI Scheduled</span>
                    <span className="font-semibold">71%</span>
                  </div>
                  <Progress value={71} className="bg-blue-100" />
                  
                  <div className="flex items-center justify-between">
                    <span>Manual Booking</span>
                    <span className="font-semibold">29%</span>
                  </div>
                  <Progress value={29} className="bg-gray-100" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
