"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Mic, 
  Monitor, 
  Settings, 
  Volume2, 
  Wifi,
  Shield,
  Zap,
  HardDrive
} from "lucide-react";

interface VideoSettingsProps {
  onSettingsChange?: (settings: VideoSettings) => void;
  currentSettings?: VideoSettings;
}

export interface VideoSettings {
  camera: {
    deviceId: string;
    resolution: string;
    frameRate: number;
  };
  microphone: {
    deviceId: string;
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
  };
  speaker: {
    deviceId: string;
    volume: number;
  };
  video: {
    quality: "low" | "medium" | "high" | "auto";
    bandwidth: "low" | "medium" | "high" | "auto";
  };
  privacy: {
    recordingEnabled: boolean;
    screenShareEnabled: boolean;
    chatEnabled: boolean;
  };
  advanced: {
    lowLatencyMode: boolean;
    hardwareAcceleration: boolean;
    adaptiveBitrate: boolean;
  };
}

const defaultSettings: VideoSettings = {
  camera: {
    deviceId: "default",
    resolution: "720p",
    frameRate: 30,
  },
  microphone: {
    deviceId: "default",
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  speaker: {
    deviceId: "default",
    volume: 80,
  },
  video: {
    quality: "auto",
    bandwidth: "auto",
  },
  privacy: {
    recordingEnabled: true,
    screenShareEnabled: true,
    chatEnabled: true,
  },
  advanced: {
    lowLatencyMode: false,
    hardwareAcceleration: true,
    adaptiveBitrate: true,
  },
};

export default function VideoSettings({ onSettingsChange, currentSettings }: VideoSettingsProps) {
  const [settings, setSettings] = useState<VideoSettings>(currentSettings || defaultSettings);
  const [devices, setDevices] = useState<{
    cameras: MediaDeviceInfo[];
    microphones: MediaDeviceInfo[];
    speakers: MediaDeviceInfo[];
  }>({
    cameras: [],
    microphones: [],
    speakers: [],
  });
  const [connectionSpeed, setConnectionSpeed] = useState<"slow" | "medium" | "fast">("medium");

  // Get available devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request permissions first
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        
        setDevices({
          cameras: deviceList.filter(device => device.kind === "videoinput"),
          microphones: deviceList.filter(device => device.kind === "audioinput"),
          speakers: deviceList.filter(device => device.kind === "audiooutput"),
        });
      } catch (error) {
        console.error("Error getting devices:", error);
      }
    };

    getDevices();
  }, []);

  // Test connection speed
  useEffect(() => {
    const testConnectionSpeed = async () => {
      try {
        const startTime = Date.now();
        await fetch('/api/ping', { method: 'HEAD' });
        const latency = Date.now() - startTime;
        
        if (latency < 100) {
          setConnectionSpeed("fast");
        } else if (latency < 300) {
          setConnectionSpeed("medium");
        } else {
          setConnectionSpeed("slow");
        }
      } catch (error) {
        setConnectionSpeed("slow");
      }
    };

    testConnectionSpeed();
  }, []);

  const updateSettings = (newSettings: Partial<VideoSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    onSettingsChange?.(updatedSettings);
  };

  const getRecommendedSettings = () => {
    if (connectionSpeed === "slow") {
      return {
        video: { quality: "low", bandwidth: "low" },
        camera: { resolution: "480p", frameRate: 15 },
        advanced: { lowLatencyMode: true, adaptiveBitrate: true }
      };
    } else if (connectionSpeed === "fast") {
      return {
        video: { quality: "high", bandwidth: "high" },
        camera: { resolution: "1080p", frameRate: 30 },
        advanced: { lowLatencyMode: false, adaptiveBitrate: false }
      };
    }
    return {
      video: { quality: "medium", bandwidth: "medium" },
      camera: { resolution: "720p", frameRate: 30 },
      advanced: { lowLatencyMode: false, adaptiveBitrate: true }
    };
  };

  const applyRecommendedSettings = () => {
    const recommended = getRecommendedSettings();
    updateSettings(recommended);
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionSpeed === "fast" ? "bg-green-500" :
                connectionSpeed === "medium" ? "bg-yellow-500" : "bg-red-500"
              }`} />
              <span className="capitalize">{connectionSpeed} Connection</span>
            </div>
            <Button variant="outline" size="sm" onClick={applyRecommendedSettings}>
              <Zap className="h-4 w-4 mr-2" />
              Apply Recommended
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Camera Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Camera Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Camera Device</Label>
            <Select
              value={settings.camera.deviceId}
              onValueChange={(value) => updateSettings({
                camera: { ...settings.camera, deviceId: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Camera</SelectItem>
                {devices.cameras.map((camera) => (
                  <SelectItem key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Resolution</Label>
              <Select
                value={settings.camera.resolution}
                onValueChange={(value) => updateSettings({
                  camera: { ...settings.camera, resolution: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="480p">480p (SD)</SelectItem>
                  <SelectItem value="720p">720p (HD)</SelectItem>
                  <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Frame Rate</Label>
              <Select
                value={settings.camera.frameRate.toString()}
                onValueChange={(value) => updateSettings({
                  camera: { ...settings.camera, frameRate: parseInt(value) }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 FPS</SelectItem>
                  <SelectItem value="30">30 FPS</SelectItem>
                  <SelectItem value="60">60 FPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Audio Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Microphone</Label>
            <Select
              value={settings.microphone.deviceId}
              onValueChange={(value) => updateSettings({
                microphone: { ...settings.microphone, deviceId: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Microphone</SelectItem>
                {devices.microphones.map((mic) => (
                  <SelectItem key={mic.deviceId} value={mic.deviceId}>
                    {mic.label || `Microphone ${mic.deviceId.slice(0, 8)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Speaker</Label>
            <Select
              value={settings.speaker.deviceId}
              onValueChange={(value) => updateSettings({
                speaker: { ...settings.speaker, deviceId: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Speaker</SelectItem>
                {devices.speakers.map((speaker) => (
                  <SelectItem key={speaker.deviceId} value={speaker.deviceId}>
                    {speaker.label || `Speaker ${speaker.deviceId.slice(0, 8)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Volume: {settings.speaker.volume}%</Label>
            <Slider
              value={[settings.speaker.volume]}
              onValueChange={([value]) => updateSettings({
                speaker: { ...settings.speaker, volume: value }
              })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Echo Cancellation</Label>
              <Switch
                checked={settings.microphone.echoCancellation}
                onCheckedChange={(checked) => updateSettings({
                  microphone: { ...settings.microphone, echoCancellation: checked }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Noise Suppression</Label>
              <Switch
                checked={settings.microphone.noiseSuppression}
                onCheckedChange={(checked) => updateSettings({
                  microphone: { ...settings.microphone, noiseSuppression: checked }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Auto Gain Control</Label>
              <Switch
                checked={settings.microphone.autoGainControl}
                onCheckedChange={(checked) => updateSettings({
                  microphone: { ...settings.microphone, autoGainControl: checked }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
