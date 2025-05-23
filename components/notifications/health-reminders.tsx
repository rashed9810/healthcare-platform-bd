"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  Clock,
  Pill,
  Calendar,
  Stethoscope,
  Heart,
  Activity,
  AlertCircle,
  CheckCircle,
  Settings,
  Smartphone,
  Mail,
  MessageSquare
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface HealthReminder {
  id: string;
  title: string;
  description: string;
  type: "medication" | "appointment" | "checkup" | "exercise" | "diet" | "custom";
  frequency: "once" | "daily" | "weekly" | "monthly" | "custom";
  time: string;
  days?: string[]; // For weekly reminders
  date?: string; // For one-time reminders
  isActive: boolean;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  lastTriggered?: string;
  nextTrigger?: string;
  medicationDetails?: {
    name: string;
    dosage: string;
    beforeFood: boolean;
  };
}

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  reminderSound: string;
  vibration: boolean;
}

interface HealthRemindersProps {
  userId: string;
}

export default function HealthReminders({ userId }: HealthRemindersProps) {
  const [reminders, setReminders] = useState<HealthReminder[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "07:00"
    },
    reminderSound: "default",
    vibration: true
  });
  const [isCreating, setIsCreating] = useState(false);
  const [editingReminder, setEditingReminder] = useState<HealthReminder | null>(null);
  const [newReminder, setNewReminder] = useState<Partial<HealthReminder>>({
    type: "medication",
    frequency: "daily",
    time: "09:00",
    isActive: true,
    notifications: {
      push: true,
      email: false,
      sms: false
    }
  });

  // Sample reminders data
  const sampleReminders: HealthReminder[] = [
    {
      id: "1",
      title: "Take Metformin",
      description: "Take 500mg Metformin with breakfast",
      type: "medication",
      frequency: "daily",
      time: "08:00",
      isActive: true,
      notifications: {
        push: true,
        email: false,
        sms: false
      },
      medicationDetails: {
        name: "Metformin",
        dosage: "500mg",
        beforeFood: false
      },
      nextTrigger: "2024-01-21T08:00:00Z"
    },
    {
      id: "2",
      title: "Blood Pressure Check",
      description: "Weekly blood pressure monitoring",
      type: "checkup",
      frequency: "weekly",
      time: "19:00",
      days: ["monday", "friday"],
      isActive: true,
      notifications: {
        push: true,
        email: true,
        sms: false
      },
      nextTrigger: "2024-01-22T19:00:00Z"
    },
    {
      id: "3",
      title: "Cardiology Appointment",
      description: "Follow-up appointment with Dr. Rahman",
      type: "appointment",
      frequency: "once",
      time: "10:30",
      date: "2024-01-25",
      isActive: true,
      notifications: {
        push: true,
        email: true,
        sms: true
      },
      nextTrigger: "2024-01-25T10:30:00Z"
    }
  ];

  // Initialize with sample data
  useEffect(() => {
    setReminders(sampleReminders);
  }, []);

  const getReminderIcon = (type: string) => {
    switch (type) {
      case "medication": return <Pill className="h-5 w-5 text-blue-600" />;
      case "appointment": return <Calendar className="h-5 w-5 text-green-600" />;
      case "checkup": return <Stethoscope className="h-5 w-5 text-purple-600" />;
      case "exercise": return <Activity className="h-5 w-5 text-orange-600" />;
      case "diet": return <Heart className="h-5 w-5 text-red-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getReminderTypeLabel = (type: string) => {
    const labels = {
      medication: "Medication",
      appointment: "Appointment",
      checkup: "Health Check",
      exercise: "Exercise",
      diet: "Diet",
      custom: "Custom"
    };
    return labels[type as keyof typeof labels] || "Custom";
  };

  const getFrequencyLabel = (frequency: string, days?: string[]) => {
    switch (frequency) {
      case "once": return "One time";
      case "daily": return "Daily";
      case "weekly": return days ? `Weekly (${days.join(", ")})` : "Weekly";
      case "monthly": return "Monthly";
      default: return "Custom";
    }
  };

  const formatNextTrigger = (nextTrigger?: string) => {
    if (!nextTrigger) return "Not scheduled";
    
    const date = new Date(nextTrigger);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 1) {
      return `In ${diffDays} days`;
    } else if (diffHours > 1) {
      return `In ${diffHours} hours`;
    } else if (diffMs > 0) {
      return "Soon";
    } else {
      return "Overdue";
    }
  };

  const createReminder = () => {
    if (!newReminder.title || !newReminder.time) return;
    
    const reminder: HealthReminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description || "",
      type: newReminder.type || "custom",
      frequency: newReminder.frequency || "daily",
      time: newReminder.time,
      days: newReminder.days,
      date: newReminder.date,
      isActive: true,
      notifications: newReminder.notifications || {
        push: true,
        email: false,
        sms: false
      },
      medicationDetails: newReminder.medicationDetails
    };
    
    setReminders(prev => [...prev, reminder]);
    setNewReminder({
      type: "medication",
      frequency: "daily",
      time: "09:00",
      isActive: true,
      notifications: {
        push: true,
        email: false,
        sms: false
      }
    });
    setIsCreating(false);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-7 w-7 text-blue-600" />
            Health Reminders
          </h2>
          <p className="text-gray-600 mt-1">
            Stay on top of your health with personalized reminders
          </p>
        </div>
        
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <Tabs defaultValue="reminders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reminders">📋 My Reminders</TabsTrigger>
          <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
        </TabsList>

        {/* Reminders Tab */}
        <TabsContent value="reminders" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reminders</p>
                    <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
                  </div>
                  <Bell className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                      {reminders.filter(r => r.isActive).length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Medications</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {reminders.filter(r => r.type === "medication").length}
                    </p>
                  </div>
                  <Pill className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {reminders.filter(r => r.nextTrigger && new Date(r.nextTrigger) > new Date()).length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reminders List */}
          <div className="space-y-4">
            {reminders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders set</h3>
                  <p className="text-gray-600 text-center max-w-md mb-6">
                    Create your first health reminder to stay on track with medications, appointments, and health checks.
                  </p>
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Reminder
                  </Button>
                </CardContent>
              </Card>
            ) : (
              reminders.map((reminder) => (
                <Card key={reminder.id} className={`${!reminder.isActive ? 'opacity-60' : ''} hover:shadow-md transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          {getReminderIcon(reminder.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {reminder.title}
                            </h3>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge variant="outline">
                                {getReminderTypeLabel(reminder.type)}
                              </Badge>
                              {reminder.isActive ? (
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-100 text-gray-600">Paused</Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{reminder.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {reminder.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {getFrequencyLabel(reminder.frequency, reminder.days)}
                              </span>
                              {reminder.nextTrigger && (
                                <span className="flex items-center gap-1">
                                  <Bell className="h-4 w-4" />
                                  {formatNextTrigger(reminder.nextTrigger)}
                                </span>
                              )}
                            </div>
                            
                            {reminder.medicationDetails && (
                              <div className="flex items-center gap-2 text-sm text-blue-600">
                                <Pill className="h-4 w-4" />
                                <span>{reminder.medicationDetails.dosage}</span>
                                {reminder.medicationDetails.beforeFood && (
                                  <Badge variant="outline" className="text-xs">Before food</Badge>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>Notifications:</span>
                              {reminder.notifications.push && <Smartphone className="h-4 w-4 text-blue-500" />}
                              {reminder.notifications.email && <Mail className="h-4 w-4 text-green-500" />}
                              {reminder.notifications.sms && <MessageSquare className="h-4 w-4 text-purple-500" />}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Switch
                          checked={reminder.isActive}
                          onCheckedChange={() => toggleReminder(reminder.id)}
                        />
                        
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteReminder(reminder.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications on your device</p>
                  </div>
                  <Switch
                    checked={settings.pushEnabled}
                    onCheckedChange={(checked) => updateSettings({ pushEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive reminders via email</p>
                  </div>
                  <Switch
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) => updateSettings({ emailEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive text message reminders</p>
                  </div>
                  <Switch
                    checked={settings.smsEnabled}
                    onCheckedChange={(checked) => updateSettings({ smsEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Vibration</Label>
                    <p className="text-sm text-gray-600">Vibrate device for reminders</p>
                  </div>
                  <Switch
                    checked={settings.vibration}
                    onCheckedChange={(checked) => updateSettings({ vibration: checked })}
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Reminder Sound</Label>
                  <Select
                    value={settings.reminderSound}
                    onValueChange={(value) => updateSettings({ reminderSound: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="gentle">Gentle Bell</SelectItem>
                      <SelectItem value="chime">Soft Chime</SelectItem>
                      <SelectItem value="beep">Simple Beep</SelectItem>
                      <SelectItem value="none">Silent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Quiet Hours</Label>
                    <p className="text-sm text-gray-600">Disable notifications during these hours</p>
                  </div>
                  <Switch
                    checked={settings.quietHours.enabled}
                    onCheckedChange={(checked) => updateSettings({ 
                      quietHours: { ...settings.quietHours, enabled: checked }
                    })}
                  />
                </div>
                
                {settings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => updateSettings({
                          quietHours: { ...settings.quietHours, start: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => updateSettings({
                          quietHours: { ...settings.quietHours, end: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Reminder Dialog */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Create New Reminder</span>
                <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    placeholder="e.g., Take morning medication"
                    value={newReminder.title || ""}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={newReminder.type}
                    onValueChange={(value: any) => setNewReminder(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">💊 Medication</SelectItem>
                      <SelectItem value="appointment">📅 Appointment</SelectItem>
                      <SelectItem value="checkup">🩺 Health Check</SelectItem>
                      <SelectItem value="exercise">🏃 Exercise</SelectItem>
                      <SelectItem value="diet">🥗 Diet</SelectItem>
                      <SelectItem value="custom">⚙️ Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={newReminder.frequency}
                    onValueChange={(value: any) => setNewReminder(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">One time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Time *</Label>
                  <Input
                    type="time"
                    value={newReminder.time || ""}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Additional details about this reminder..."
                  value={newReminder.description || ""}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Notification Methods</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push Notifications</span>
                    <Switch
                      checked={newReminder.notifications?.push || false}
                      onCheckedChange={(checked) => setNewReminder(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications!, push: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email</span>
                    <Switch
                      checked={newReminder.notifications?.email || false}
                      onCheckedChange={(checked) => setNewReminder(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications!, email: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS</span>
                    <Switch
                      checked={newReminder.notifications?.sms || false}
                      onCheckedChange={(checked) => setNewReminder(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications!, sms: checked }
                      }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={createReminder} disabled={!newReminder.title || !newReminder.time}>
                  <Save className="h-4 w-4 mr-2" />
                  Create Reminder
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
