"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Heart,
  Pill,
  Calendar,
  Users,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
  category: "vital" | "medication" | "activity" | "mental";
  lastUpdated: string;
  target?: number;
  status: "good" | "warning" | "critical";
}

interface HealthAnalyticsDashboardProps {
  userId: string;
  isDoctor?: boolean;
  patientId?: string;
}

export default function HealthAnalyticsDashboard({ 
  userId, 
  isDoctor = false, 
  patientId 
}: HealthAnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample health metrics data
  const healthMetrics: HealthMetric[] = [
    {
      id: "1",
      name: "Blood Pressure",
      value: 125,
      unit: "mmHg",
      trend: "down",
      trendValue: -5,
      category: "vital",
      lastUpdated: "2024-01-20T08:30:00Z",
      target: 120,
      status: "good"
    },
    {
      id: "2",
      name: "Blood Sugar",
      value: 140,
      unit: "mg/dL",
      trend: "up",
      trendValue: 15,
      category: "vital",
      lastUpdated: "2024-01-20T07:00:00Z",
      target: 100,
      status: "warning"
    },
    {
      id: "3",
      name: "Medication Adherence",
      value: 85,
      unit: "%",
      trend: "up",
      trendValue: 10,
      category: "medication",
      lastUpdated: "2024-01-20T09:00:00Z",
      target: 95,
      status: "good"
    },
    {
      id: "4",
      name: "Daily Steps",
      value: 7500,
      unit: "steps",
      trend: "up",
      trendValue: 500,
      category: "activity",
      lastUpdated: "2024-01-19T23:59:00Z",
      target: 10000,
      status: "good"
    },
    {
      id: "5",
      name: "Sleep Quality",
      value: 7.2,
      unit: "hours",
      trend: "stable",
      trendValue: 0,
      category: "mental",
      lastUpdated: "2024-01-20T06:00:00Z",
      target: 8,
      status: "good"
    },
    {
      id: "6",
      name: "Heart Rate",
      value: 72,
      unit: "bpm",
      trend: "stable",
      trendValue: 0,
      category: "vital",
      lastUpdated: "2024-01-20T09:15:00Z",
      target: 70,
      status: "good"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-600 bg-green-100";
      case "warning": return "text-yellow-600 bg-yellow-100";
      case "critical": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vital": return <Heart className="h-5 w-5 text-red-500" />;
      case "medication": return <Pill className="h-5 w-5 text-blue-500" />;
      case "activity": return <Activity className="h-5 w-5 text-green-500" />;
      case "mental": return <Target className="h-5 w-5 text-purple-500" />;
      default: return <BarChart3 className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredMetrics = selectedCategory === "all" 
    ? healthMetrics 
    : healthMetrics.filter(metric => metric.category === selectedCategory);

  const getHealthScore = () => {
    const goodMetrics = healthMetrics.filter(m => m.status === "good").length;
    const totalMetrics = healthMetrics.length;
    return Math.round((goodMetrics / totalMetrics) * 100);
  };

  const getAchievements = () => {
    return [
      {
        id: "1",
        title: "Medication Consistency",
        description: "85% adherence this month",
        icon: <Pill className="h-5 w-5 text-blue-500" />,
        earned: true
      },
      {
        id: "2", 
        title: "Blood Pressure Control",
        description: "Within target range for 2 weeks",
        icon: <Heart className="h-5 w-5 text-red-500" />,
        earned: true
      },
      {
        id: "3",
        title: "Active Lifestyle",
        description: "7,500+ steps daily average",
        icon: <Activity className="h-5 w-5 text-green-500" />,
        earned: true
      },
      {
        id: "4",
        title: "Sleep Champion",
        description: "7+ hours sleep for 10 days",
        icon: <Target className="h-5 w-5 text-purple-500" />,
        earned: false
      }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-blue-600" />
            Health Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            {isDoctor ? "Patient health insights and trends" : "Your health journey and progress"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Score</p>
                <p className="text-3xl font-bold text-blue-600">{getHealthScore()}%</p>
                <p className="text-xs text-gray-500 mt-1">+5% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Metrics in Range</p>
                <p className="text-3xl font-bold text-green-600">
                  {healthMetrics.filter(m => m.status === "good").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">of {healthMetrics.length} total</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {healthMetrics.filter(m => m.status === "warning").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">requires monitoring</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-lg font-bold text-purple-600">Today</p>
                <p className="text-xs text-gray-500 mt-1">9:15 AM</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">📊 Health Metrics</TabsTrigger>
          <TabsTrigger value="trends">📈 Trends</TabsTrigger>
          <TabsTrigger value="achievements">🏆 Achievements</TabsTrigger>
        </TabsList>

        {/* Health Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          {/* Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="vital">❤️ Vital Signs</SelectItem>
                    <SelectItem value="medication">💊 Medications</SelectItem>
                    <SelectItem value="activity">🏃 Activity</SelectItem>
                    <SelectItem value="mental">🧠 Mental Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMetrics.map((metric) => (
              <Card key={metric.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(metric.category)}
                      <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                    </div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {metric.value.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600">{metric.unit}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        <span className="text-sm text-gray-600">
                          {metric.trendValue > 0 ? '+' : ''}{metric.trendValue}
                          {metric.unit === '%' ? 'pp' : metric.unit}
                        </span>
                      </div>
                      
                      {metric.target && (
                        <div className="text-sm text-gray-600">
                          Target: {metric.target}{metric.unit}
                        </div>
                      )}
                    </div>
                    
                    {metric.target && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.status === 'good' ? 'bg-green-500' :
                            metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${Math.min((metric.value / metric.target) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      Last updated: {new Date(metric.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Trends Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Improving Metrics</h4>
                    <div className="space-y-2">
                      {healthMetrics.filter(m => m.trend === "up" && m.trendValue > 0).map(metric => (
                        <div key={metric.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(metric.category)}
                            <span className="font-medium">{metric.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm">+{metric.trendValue}{metric.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Areas for Improvement</h4>
                    <div className="space-y-2">
                      {healthMetrics.filter(m => m.status === "warning" || m.status === "critical").map(metric => (
                        <div key={metric.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(metric.category)}
                            <span className="font-medium">{metric.name}</span>
                          </div>
                          <Badge className={getStatusColor(metric.status)}>
                            {metric.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Health Insights</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your blood pressure has improved by 5 mmHg over the past month</li>
                    <li>• Medication adherence is excellent at 85% - keep up the good work!</li>
                    <li>• Consider increasing daily activity to reach your 10,000 step goal</li>
                    <li>• Blood sugar levels need attention - consult with your doctor</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getAchievements().map((achievement) => (
              <Card key={achievement.id} className={`${achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${achievement.earned ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        {achievement.earned && (
                          <Badge className="bg-green-100 text-green-800">
                            <Award className="h-3 w-3 mr-1" />
                            Earned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progress Towards Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Health Score Target</span>
                    <span>{getHealthScore()}% / 90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(getHealthScore() / 90) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Medication Adherence Goal</span>
                    <span>85% / 95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(85 / 95) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Activity Target</span>
                    <span>7,500 / 10,000 steps</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(7500 / 10000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
