"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Activity,
  Server,
  Zap,
  Brain,
  Database,
  Clock,
} from "lucide-react";
import { pythonBackendService } from "@/lib/services/python-backend-service";

interface BackendStatus {
  isOnline: boolean;
  responseTime: number;
  lastChecked: string;
}

interface HealthData {
  status: string;
  timestamp: string;
  version: string;
  service: string;
}

export default function BackendStatus() {
  const [status, setStatus] = useState<BackendStatus | null>(null);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBackendStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check backend status
      const statusResult = await pythonBackendService.monitorBackendStatus();
      setStatus(statusResult);

      // Get health data if online
      if (statusResult.isOnline) {
        const healthResponse = await pythonBackendService.getHealthStatus();
        if (healthResponse.success) {
          setHealthData(healthResponse.data);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to check backend status");
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const isConnected = await pythonBackendService.testConnection();
      if (isConnected) {
        await checkBackendStatus();
      } else {
        setError("Connection test failed");
      }
    } catch (err: any) {
      setError(err.message || "Connection test failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();

    // Auto-refresh every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? "text-green-600" : "text-red-600";
  };

  const getStatusBadge = (isOnline: boolean) => {
    return isOnline ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Online
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        <XCircle className="h-3 w-3 mr-1" />
        Offline
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Server className="h-5 w-5 mr-2" />
              Python Backend Status
            </div>
            {status && getStatusBadge(status.isOnline)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Activity
                  className={`h-4 w-4 ${
                    status ? getStatusColor(status.isOnline) : "text-gray-400"
                  }`}
                />
                <span className="text-sm font-medium">Status:</span>
                <span
                  className={`text-sm ${
                    status ? getStatusColor(status.isOnline) : "text-gray-400"
                  }`}
                >
                  {status
                    ? status.isOnline
                      ? "Online"
                      : "Offline"
                    : "Unknown"}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Response Time:</span>
                <span className="text-sm text-blue-600">
                  {status ? `${status.responseTime}ms` : "N/A"}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Version:</span>
                <span className="text-sm text-purple-600">
                  {healthData ? healthData.version : "N/A"}
                </span>
              </div>
            </div>

            {/* Health Information */}
            {healthData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Backend Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Service:</span>{" "}
                    {healthData.service}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {new Date(healthData.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="space-y-2">
                    <p>{error}</p>
                    {error.includes("401") || error.includes("Unauthorized") ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          Please log in to access Python backend features.
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => (window.location.href = "/login")}
                        >
                          Login
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                onClick={checkBackendStatus}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Activity className="h-4 w-4 mr-2" />
                )}
                Refresh Status
              </Button>

              <Button
                onClick={testConnection}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Test Connection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Available Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">AI Analysis</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Symptom Analysis</li>
                <li>• Appointment Enhancement</li>
                <li>• Health Risk Assessment</li>
                <li>• Medical Image Analysis</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Integration</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Real-time Data Sync</li>
                <li>• Analytics Processing</li>
                <li>• Notification System</li>
                <li>• Payment Enhancement</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {status?.isOnline && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() =>
                  window.open("http://localhost:8001/docs", "_blank")
                }
              >
                <Server className="h-6 w-6" />
                <span>API Docs</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() =>
                  window.open("http://localhost:8001/health", "_blank")
                }
              >
                <Activity className="h-6 w-6" />
                <span>Health Check</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => window.open("http://localhost:8001", "_blank")}
              >
                <Brain className="h-6 w-6" />
                <span>Backend Home</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
